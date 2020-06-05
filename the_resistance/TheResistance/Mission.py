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

