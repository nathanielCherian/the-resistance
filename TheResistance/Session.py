class Session:

    players = []

    def addPlayer(self, name):
        return Player(name)

    def addPlayerS(self, names): #optional way to make multiple players quickly
        players = []
        for name in names:
            players.append(Player(name))
        self.players = players
        return players

