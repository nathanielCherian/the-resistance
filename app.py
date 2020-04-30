from flask import Flask, render_template, url_for, session, request, redirect
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import csv #for db
from io import StringIO
from config import Config
from makeJSON import updateLobby


app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False 
socketio = SocketIO(app)

db = SQLAlchemy(app)

class players(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    gameCode = db.Column("gameCode", db.String(100),unique=True)
    playerList = db.Column("playerList", db.String(150),unique=False)

    def __init__(self, gameCode, playerList):
        self.gameCode = gameCode
        self.playerList = playerList

    def get_id(self):
        return (self._id)
    
    def get_list(self): # will return a list to pass through websocket
        reader = csv.reader(StringIO(self.playerList))
        return list(reader)[0]


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == "POST":
        session['room'] = request.form['code'].strip(' ')
        session['name'] = request.form['uname']

        return redirect(url_for('lobby'))

    return render_template('home.html')


@app.route('/lobby')
def lobby():
    room = session['room']
    return  render_template('lobby.html', roomID=room, name=session['name'])


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')



@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    
    if json['status'] == 'lobby':
        print("hello\n\n\n")
        found_player = players.query.filter_by(gameCode=session['room']).first()
        if found_player:
            if session['name'] not in found_player.get_list():
                found_player.playerList = found_player.playerList + ',"' + session['name'] + '"'
                db.session.commit()
                print("commited player")
        else:
            found_player = players(gameCode=session['room'], playerList='"' + session['name'] + '"')
            db.session.add(found_player)
            db.session.commit()
            print("new player commit")
        print(found_player.get_list())
        json = updateLobby(found_player.get_list(), session['room'])
        socketio.emit('my response', (json, 'bar'))

        print(json)



    #socketio.emit('my response', (d, 'bar', dict))




@app.route('/getstarted', methods=['GET', 'POST'])
def getstarted():

    if request.method == 'POST':
        code = request.form['code']
        pl = request.form['pl']
        player = players(gameCode=code, playerList=pl)
        db.session.add(player)
        db.session.commit()
    return render_template("getstarted.html", values=players.query.all())

if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True, host='0.0.0.0')