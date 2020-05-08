import json
from model import Player, Session, Mission, Board, createBoard, loadBoard, saveBoard


def updateLobby(pList, roomid):
    d = {
        'roomid': roomid,
        'status':'updatingLobby',
        'players': pList,
        'host': pList[0]
    }
    return d

def playData1(b, roomid):
    d = {
        'roomid':roomid,
        'status':'playData1'
    }

    for player in b.players:
        pData = {player.name:player.role}
        d.update(pData)
    
    d.update({'team_leader':b.players[b.team_leader].name})

    return d

