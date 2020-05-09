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
    l = {}
    for player in b.players:
        pData = {player.name:player.role}
        d.update(pData)
        l.update(pData)

    d.update({'roles':l})
    d.update({'team_leader':b.players[b.team_leader].name})
    d.update({'ptoPlay':b.playersOnMission()})
    d.update({'failsreq':b.failsReq()})

    return d

