from otree.api import (
    models, widgets, BaseConstants, BaseSubsession, BaseGroup, BasePlayer
)


class Constants(BaseConstants):
    name_in_url = 'humantest'
    players_per_group = None
    num_rounds = 1


class Subsession(BaseSubsession):
    def before_session_starts(self):
        for p in self.get_players():
            p.guess = "Unknown"
            p.opponent = "Human"


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    guess = models.CharField(
        choices=['Human', 'Robot'],
        doc="""This player's guess"""
    )
    opponent = models.CharField(
        choices=['Human', 'Robot'],
        doc="""The actual opponent"""
    )






