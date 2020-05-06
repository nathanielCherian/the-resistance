from __main__ import socketio
from app import players, session, db
from makeJSON import updateLobby
import json as j


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')



@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    
    if json['status'] == 'lobby':
        found_player = players.query.filter_by(gameCode=session['room']).first()
        if found_player:
            if session['name'] not in found_player.get_list():
                found_player.appendList(session['name'])
                print("commited player")

        print(found_player.get_list())
        json = updateLobby(found_player.get_list(), session['room'])
        socketio.emit('my response', (json, 'bar'))
        print(json)



    if json['roomid'] == session['room']: # CHECK FOR ROOM NUMBER
        
        if json['status'] == 'leave':
            found_player = players.query.filter_by(gameCode=session['room']).first()

            found_player.removePlayer(session['name'])

            json = updateLobby(found_player.get_list(), session['room'])
            socketio.emit('my response', json)
    #socketio.emit('my response', (d, 'bar', dict))
