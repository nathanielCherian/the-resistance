class Board:
    num_players = 0
    num_spies = 0
    players = []
    curr_mission = 0 #using index-numbers for mission number
    mission_info = [] #[]false=spys won round, true=resistance won round
    mission_list = [] # use this or/and mission_info
    team_leader = 0

    def __init__(self, players):
        self.players = players
        self.num_players = len(players)
        self.num_spies = self.setSpies(players)
        self.team_leader = random.randint(1,len(self.players)-1) #range?
        print(players[self.team_leader].name)

    def setSpies(self, players):
        nsp = {5:2, 6:2, 7:3, 8:3, 9:3, 10:4}
        rands = random.sample(range(0, len(self.players)), nsp[self.num_players])
        for rand in rands:
            self.players[rand].role = 'spy'
        return len(rands)

    def changeLeader(self):
        self.team_leader -= 1
        return self.team_leader

    def countTeamVotes(self):
        positive = 0
        negetive = 0
        for player in self.players:
            if player.teamVote == True:
                positive += 1
            elif player.teamVote == False:
                negetive += 1
        if positive > negetive:
            print("vote passes!")
            return True
        elif negetive > positive:
            print("vote rejected!")
            return False
        elif positive == negetive:
            print("vote tie!")
            return None

    def goOnMission(self, playersM, fails_req):
        self.mission_list.append(Mission(playersM, fails_req, players[self.team_leader].name))
        return self.mission_list[-1].outcome


