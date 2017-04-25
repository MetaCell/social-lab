from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random


class PlayerBot(Bot):
    def play_round(self):
        yield (views.Intention, {'intention': random.choice(['Peace', 'War'])})
        yield (views.Decision, {"decision": random.choice(['Peace', 'War'])})
        #assert 'Both of you chose to go to peace' in self.html
        #assert self.player.payoff == Constants.both_cooperate_payoff
        yield (views.Results)