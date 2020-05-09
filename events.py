from __main__ import socketio
from app import players, session, db
from makeJSON import updateLobby, playData1
from model import Player, Session, Mission, Board, createBoard, loadBoard, saveBoard
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

        found_player = players.query.filter_by(gameCode=session['room']).first() #context of elemnt in database

        if json['status'] == 'leave':

            found_player.removePlayer(session['name'])

            d = {'status':'pleft', "roomid":session['room'], 'name':session['name']}

            json = updateLobby(found_player.get_list(), session['room'])
            socketio.emit('my response', json)
            socketio.emit('my response', d)

        
        if json['status'] == 'connectToPlay':
            if json['name'] == found_player.get_list()[0]: #check if user is host
                sendMes = {'roomid' : json['roomid'], 'status':'playCommand'}

                b = createBoard(found_player.get_list()) #loading players into object returning an object
                found_player.board = saveBoard(b) #serializing object into binary and saving in DB
                db.session.commit()

                pdata = playData1(b, session['room'])

                socketio.emit('my response', sendMes) #sending play command

                socketio.emit('my response', pdata) #sending players and their roles

            else: #redirect user
                print("redirect")
                b = loadBoard(found_player.board)
                pdata = playData1(b, session['room'])
                socketio.emit('my response', pdata)


        if json['status'] == 'updateGun':
            socketio.emit('my response', json) #pass on to all players
