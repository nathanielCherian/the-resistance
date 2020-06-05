from Player import Player

class Session:

    players = []

    def addPlayer(self, name):
        return Player(name, 'role?')

    def addPlayerS(self, names): #optional way to make multiple players quickly
        players = []
        for name in names:
            players.append(Player(name, 'role?')) #adding role here or once game started in Board?
        self.players = players
        return players

