from flask import Flask, render_template, url_for, session, request, redirect, flash
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import csv #for db
from io import StringIO
from config import Config
from random import randint
import json as j


app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)

db = SQLAlchemy(app)

import events

class players(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    gameCode = db.Column("gameCode", db.String(100),unique=True)
    playerList = db.Column("playerList", db.String(150),unique=False)
    isPlaying = db.Column("isPlaying", db.Boolean,unique=False)

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


@app.route('/', methods=['GET', 'POST'])
def home():

    if request.method == "POST":
        usedRooms = []
        for player in players.query.all():
            if player.isPlaying == False:
                usedRooms.append(player.gameCode)

        if request.form['code'].strip(' ') in usedRooms:
            session['room'] = request.form['code'].strip(' ')
            session['name'] = request.form['uname']
            return redirect(url_for('lobby'))
        else:
            flash("incorrect code")
            return redirect(url_for('home'))

    return render_template('home.html')


@app.route('/lobby')
def lobby():
    room = session['room']
    return  render_template('lobby.html', roomID=room, name=session['name'])


@app.route('/play')
def play():
    return render_template('play.html')





@app.route('/getstarted', methods=['GET', 'POST'])
def getstarted():

    if request.method == 'POST':
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
        player = players(gameCode=session['room'], playerList= pData, isPlaying=False)
        db.session.add(player)
        db.session.commit()
        return redirect(url_for('lobby'))

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