from flask import Flask, render_template, url_for, session, request, redirect, flash
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import csv #for db
from io import StringIO
from the_resistance.config import Config
from random import randint
import json as j
import re


app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)

db = SQLAlchemy(app)



class players(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    gameCode = db.Column("gameCode", db.String(10),unique=True)
    playerList = db.Column("playerList", db.String(255),unique=False)
    isPlaying = db.Column("isPlaying", db.String(1),unique=False)
    board = db.Column("board", db.LargeBinary, unique=False)



    def __init__(self, gameCode, playerList, isPlaying):
        self.gameCode = gameCode
        self.playerList = playerList
        self.isPlaying = isPlaying

    def get_id(self):
        return (self._id)
    
    def get_list(self): # will return a list to pass through websocket
        pJson = j.loads(self.playerList)
        return pJson['playerList']

    def appendList(self, name):
        pJson = j.loads(self.playerList)
        pJson['playerList'].append(name)
        self.playerList = j.dumps(pJson)
        db.session.commit()

    def removePlayer(self, name):
        pJson = j.loads(self.playerList)
        pJson['playerList'].remove(name)
        self.playerList = j.dumps(pJson)
        db.session.commit()

import the_resistance.events

#-------- To make sure name is 'clean' before passing through---------
def checkRe(name):
    reg = re.compile(r'[^a-zA-Z0-9.]')
    return not bool(reg.search(name))
#-----------------------------------------------------------------------

@app.route('/home', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def home():

    
    if request.method == "POST":

        session['room'] = request.form['code'].strip(' ')
        session['name'] = request.form['uname'].strip(' ')
        found_room = players.query.filter_by(gameCode=session['room']).first()

        if(found_room) and found_room.isPlaying == 'n': #found waiting room succesfully and name is clean

            if checkRe(request.form['uname'].strip(' ')):

                if session['name'] not in found_room.get_list(): #unique player check
                    return redirect(url_for('lobby'))
                else:
                    session.pop('name', None)
                    session.pop('room', None)
                    flash("Whoops! that name is already taken!")
                    return redirect(url_for('home'))
            else:
                flash("Whoops! your name can only have letters and numbers!")

        else:
            session.pop('name', None)
            session.pop('room', None)
            flash("This room is not accepting players!")
            return redirect(url_for('home'))

    return render_template('home.html')


@app.route('/lobby')
def lobby():

    if session.get('room') and players.query.filter_by(gameCode=session['room']).first():   #authenticate user trying to acess /lobby

        found_room = players.query.filter_by(gameCode=session['room']).first()
        if found_room.isPlaying == 'y': #in the case a user in a game presses the back button
            return redirect(url_for('play'))


        print('name:    ' + session['name'])
        room = session['room']
        return  render_template('lobby.html', roomID=room, name=session['name'])


    else:
        return redirect(url_for('home'))



@app.route('/play')
def play():

    if session.get('room') and players.query.filter_by(gameCode=session['room']).first():   #authenticate user trying to acess /lobby
        
        found_room = players.query.filter_by(gameCode=session['room']).first()
        if found_room.isPlaying == 'n':    #in the case a user is not in a game
            return redirect(url_for('lobby'))


        print('name:    ' + session['name'])
        plist = players.query.filter_by(gameCode=session['room']).first().get_list()
        players.query.filter_by(gameCode=session['room']).first().isPlaying = 'y'
        db.session.commit()

        plst = []
        idx = plist.index(session['name'])
        for i in range(len(plist)): #to rearrange elemnts in list to make unique for players
            plst.append(plist[idx])
            idx -= 1
            
        jData = {'players':plst} #serialize data
        print(jData)
        return render_template('play.html', roomID=session['room'], name=session['name'], jData=jData)


    else:
        return redirect(url_for('home'))



@app.route('/getstarted', methods=['GET', 'POST'])
def getstarted():

    if request.method == 'POST':
        if checkRe(request.form['name'].strip(' ')):
            name = request.form['name']
            session['name'] = name
            usedRooms = []
            for player in players.query.all():
                usedRooms.append(player.gameCode)
            
            rand = randint(100000,999999)
            while rand in usedRooms:
                rand = randint(100000,999999)

            session['room'] = str(rand) 

            pData = j.dumps({'playerList':[session['name']]})
            player = players(gameCode=session['room'], playerList= pData, isPlaying='n')
            db.session.add(player)
            db.session.commit()
            return redirect(url_for('lobby'))

        else:
            flash("Whoops! your name can only have letters and numbers!")

    return render_template("getstarted.html", values=players.query.all())




@app.route('/view', methods=['GET', 'POST']) #for testing purposes
def view():
    if request.method == 'POST':
        code = request.form['code']
        pl = request.form['pl']
        player = players(gameCode=code, playerList=pl)
        db.session.add(player)
        db.session.commit()
    
    return render_template("view.html", values=players.query.all())



if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True, host='0.0.0.0')