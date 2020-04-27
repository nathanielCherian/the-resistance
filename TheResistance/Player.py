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
