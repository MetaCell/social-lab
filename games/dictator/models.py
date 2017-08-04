from otree.api import (
    models, widgets, BaseConstants, BaseSubsession, BaseGroup, BasePlayer,
    Currency as c, currency_range
)
import random


doc = """
One player decides how to divide a certain amount between himself and the other
player.

See: Kahneman, Daniel, Jack L. Knetsch, and Richard H. Thaler. "Fairness
and the assumptions of economics." Journal of business (1986):
S285-S300.

"""


class Constants(BaseConstants):
    name_in_url = 'dictator'
    players_per_group = 2
    num_rounds = 4

    instructions_template = 'dictator/Instructions.html'

    # Initial amount allocated to the dictator
    endowment = c(100)

class Subsession(BaseSubsession):
    def before_session_starts(self):
        # swap roles for even numbered rounds
        if self.round_number % 2 == 0:
            for group in self.get_groups():
                players = group.get_players()
                players.reverse()
                group.set_players(players)

class Group(BaseGroup):
    kept = models.CurrencyField(
        doc="""Amount dictator decided to keep for himself""",
        min=0, max=Constants.endowment,
        verbose_name='I will keep (from 0 to %i)' % Constants.endowment
    )

    def set_payoffs(self):
        p1 = self.get_player_by_id(1)
        p2 = self.get_player_by_id(2)
        p1.payoff = self.kept
        p2.payoff = Constants.endowment - self.kept


class Player(BasePlayer):
    pass
