import json

def updateLobby(pList, roomid):
    dict = {
        'roomid': roomid,
        'status':'updatingLobby',
        'players': pList,
        'host': pList[0]
    }
    return dict
