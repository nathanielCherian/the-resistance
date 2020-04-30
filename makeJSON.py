import json

def updateLobby(pList, roomid):
    dict = {
        'roomid': roomid,
        'status':'updatingLobby',
        'players': pList
    }
    return dict
