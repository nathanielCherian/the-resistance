from enum import Enum, auto


class Player:

    # -----------------------
    # constants

    # symbolic constants for roles
    class ROLE(Enum):
        REBEL = auto()
        SPY = auto()

    # used in voting for missions
    class MISSION_VOTE(Enum):
        SUCCESS = auto()
        FAIL = auto()

    # used in voting for team members
    class TEAM_VOTE(Enum):
        ACCEPT = auto()
        REJECT = auto()

    # -----------------------

    def __init__(self, name, role):
        assert isinstance(role, self.ROLE)

        self.name = name
        self.role = role

    def mission_vote_success(self):
        return Player.MISSION_VOTE.SUCCESS

    def mission_vote_fail(self):
        return Player.MISSION_VOTE.FAIL

    def team_vote_accept(self):
        return Player.TEAM_VOTE.ACCEPT

    def team_vote_reject(self):
        return Player.TEAM_VOTE.REJECT


class SpyPlayer(Player):
    def __init__(self, name):
        super().__init__(name, role=Player.ROLE.SPY)


class RebelPlayer(Player):
    def __init__(self, name):
        super().__init__(name, role=Player.ROLE.REBEL)

    # rebel players can't ever fail a mission
    # so we override fail method to always succeed
    def mission_vote_fail(self):
        return Player.MISSION_VOTE.SUCCESS
