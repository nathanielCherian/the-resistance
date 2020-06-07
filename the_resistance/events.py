from the_resistance.app import socketio
from flask_socketio import emit
from the_resistance.app import players, session, db
from .makeJSON import updateLobby, playData1, rotateLeader, missionOutcome, reloaded
from .model import Player, Session, Mission, Board, createBoard, loadBoard, saveBoard
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
        if ~found_player:
            socketio.emit('my response', {'roomid':session['room'], 'status':'returnHome'})


        if json['status'] == 'leave':

            found_player.removePlayer(session['name'])
            db.session.commit()

            session.pop('name', None)
            session.pop('room', None)

            d = {'status':'pleft', "roomid":session['room'], 'name':session['name']}

            json = updateLobby(found_player.get_list(), session['room'])
            socketio.emit('my response', json)
            socketio.emit('my response', d)

        if json['status'] == 'letMeIn':
            found_player.isPlaying = True
            db.session.commit() #oh the shame

        
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

        if json['status'] == 'reloaded':
            b = loadBoard(found_player.board)
            emit('my response', reloaded(b, session['room'], json['name']))

        if json['status'] == 'dORa' or 'rdORa': #used as message transport
            socketio.emit('my response', json)


        #if json['status'] == 'updateGun':
            #socketio.emit('my response', json) #pass on to all players

        if json['status'] == 'teamFinished':
            b = loadBoard(found_player.board)
            b.plOnM = json['plOnM']

            b.ismissionvote = True #STARTING MISSION VOTE
            found_player.board = saveBoard(b)
            db.session.commit()
            socketio.emit('my response', {
                'roomid':session['room'],
                'status':'voteTeam'
            })

        if json['status'] == 'pteamvote':
            b = loadBoard(found_player.board) #convert from pickle to object
            b.setPlayerVote(json['name'],'team',json['vote'])  #place player vote in

            b.players_voted.append(json['name']) #PLAYER VOTED ON MISSION

            found_player.board = saveBoard(b) #serialize back to pickle
            db.session.commit()
            #socketio.emit('my response', json) #send vote to all players

        if json['status'] == 'doneVoting':
            b = loadBoard(found_player.board)
            result = b.countTeamVotes()

            b.ismissionvote = False #ENDING MISSION VOTE
            b.players_voted = []

            json.update({'result':result})
            #socketio.emit('my response', json)

            if result == False or result == None:   #if vote fails or ties rotate leader
                leader = b.changeLeader()
                b.plOnM = []
                found_player.board = saveBoard(b)
                db.session.commit()
                socketio.emit('my response', rotateLeader(b,session['room'])) #emits command to change leader and reset screens

            elif result == True:
                b.isplayvote = True #STARTING PLAY
                found_player.board = saveBoard(b)
                db.session.commit()

                socketio.emit('my response', {
                    'roomid':session['room'],
                    'status':'collectMVotes',
                    'players':b.plOnM
                })

        if json['status'] == 'sendMVote':
            b = loadBoard(found_player.board)
            b.setPlayerVote(json['name'],'mission',json['vote'])

            b.players_voted.append(json['name']) #PLAYER VOTED ON PLAY

            found_player.board = saveBoard(b)
            db.session.commit()

            if(b.pmvotes == len(b.plOnM)): #if all players have voted
                result = b.goOnMission()
                leader = b.changeLeader()

                b.isplayvote = False #ENDING PLAY VOTE
                b.players_voted = []

                found_player.board = saveBoard(b)
                db.session.commit()
                message = missionOutcome(b,session['room'])
                socketio.emit('my response', message)

                if message['status'] == 'gameOver': #If game is over destroy session so player cant join back
                    session.pop('name', None)
                    session.pop('room', None)
                    db.session.delete(found_player)
                    db.session.commit()