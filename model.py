#! python3
import random
import pickle as p


class Player:
    name = ""
    role = "rebel" # 'spy' or 'rebel' 
    teamVote = None # true = accept, false = reject
    missionVote = 0
    
    def __init__(self, name):
        self.name = name

    def mission_vote(self, vote):
        if self.role == 'rebel':
            self.missionVote = 0 #mission votes will be added and if >x fails(x=#of fails req.)
        elif self.role == 'spy':
            self.missionVote = vote

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

class Mission:
    playersM = [] # playersM represents only players currently in mission
    num_playing = 0
    fails_req = 0
    outcome = None # succeeded = True, failed = False
    team_leader = ''

    def __init__(self, playersM, fails_req, team_leader):
        self.playersM = playersM
        self.fails_req = fails_req
        self.team_leader = team_leader
        self.outcome = self.determineOutcome()

    def determineOutcome(self):
        fails = 0
        for player in self.playersM:
            fails += player.missionVote
        if fails >= self.fails_req:
            return False
        else:
            return True


gameData = {
    2:[2,2,1,1,1], #test only
    5:[2,3,2,3,3],
    6:[2,3,4,3,4],
    7:[2,3,3,4,4],
    8:[3,4,4,5,5],
    9:[3,4,4,5,5],
    10:[3,4,4,5,5]
}


class Board:
    num_players = 0
    num_spies = 0
    players = []
    curr_mission = 0 #using index-numbers for mission number
    mission_info = [] #[]false=spys won round, true=resistance won round
    mission_list = [] # use this or/and mission_info
    team_leader = 0
    plOnM = [] #player names on mission
    pmvotes = 0 #number of players that have voted
    
    def __init__(self, players):
        self.players = players
        self.num_players = len(players)
        self.num_spies = self.setSpies(players)
        self.team_leader = random.randint(0,len(self.players)-1) #range?
        #print(players[self.team_leader].name)
        
    def setSpies(self, players):
        nsp = {2:1, 5:2, 6:2, 7:3, 8:3, 9:3, 10:4} # temporary 2:1 for testing p.
        rands = random.sample(range(0, len(self.players)), nsp[self.num_players])
        for rand in rands:
            self.players[rand].role = 'spy'
        return len(rands)
        
    def changeLeader(self):
        if abs(self.team_leader) != len(self.players):
            self.team_leader -= 1
        else:
            self.team_leader = 1
        return self.team_leader

    def countTeamVotes(self):
        positive = 0
        negetive = 0
        for player in self.players:
            if player.teamVote == True:
                positive += 1
            elif player.teamVote == False:
                negetive += 1
            player.teamVote = None # reset for next round
        if positive > negetive:
            print("vote passes!")
            return True
        elif negetive > positive:
            print("vote rejected!")
            return False
        elif positive == negetive:
            print("vote tie!")
            return None

    def goOnMission(self):
        self.pmvotes = 0 #resetting counter back to 0
        pm = []
        for p in self.players:
            if p.name in self.plOnM:
                pm.append(p)

        self.mission_list.append(Mission(pm, self.failsReq(), self.players[self.team_leader].name))
        self.curr_mission+=1
        self.mission_info.append(self.mission_list[-1].outcome)
        return self.mission_list[-1].outcome
       
    def playersOnMission(self):
        return gameData[self.num_players][self.curr_mission]

    def failsReq(self):
        if len(self.players)>=7 and self.curr_mission==4:
            return 2
        else:
            return 1

    def setPlayerVote(self,name,typ,vote):
        for p in self.players:
            if p.name == name:

                if typ == 'team':
                    p.teamVote = vote #boolean
                    break
                elif typ == 'mission':
                    p.missionVote = vote # 1 or 0
                    self.pmvotes += 1
                    break

def createBoard(players):
    s = Session()
    s.addPlayerS(players)
    b = Board(s.players)
    return b

def loadBoard(pickledData):
    b = p.loads(pickledData)
    return b

def saveBoard(b):
    pickledData = p.dumps(b)
    return pickledData


