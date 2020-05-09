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

def rotateLeader(b, roomid):
    d = {
        'roomid':roomid,
        'status':'rotateLeader',
        'team_leader':b.players[b.team_leader].name
    }
    return d


def missionOutcome(b, roomid):   #will return mission outcome as well as instructions for next mission

    d={'roomid':roomid}
    status = "missionOutcome"

    spy = 0
    rebel = 0

    for m in b.mission_info:
        if m == False:
            spy+=1
        elif m == True:
            rebel+=1


    if spy == 3:   #if one team has hit 3 wins end game
        d.update({'status':"gameOver", 'winner':'spy'})
        l = {}
        for player in b.players:
            pData = {player.name:player.role}
            d.update(pData)
            l.update(pData)
        d.update({'roles':l})
        
    elif rebel == 3:
        d.update({'status':"gameOver", 'winner':'rebel'})
        for player in b.players:
            pData = {player.name:player.role}
            d.update(pData)
            l.update(pData)
        d.update({'roles':l})

    else:
        d.update({
            'status':status,
            'outcome':b.mission_list[-1].outcome,
            'team_leader':b.players[b.team_leader].name,
            'ptoPlay':b.playersOnMission(),
            'failsreq':b.failsReq()
        })


    return d
