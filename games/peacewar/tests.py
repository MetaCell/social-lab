from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random


class PlayerBot(Bot):
    def play_round(self):
        choice = random.choice(['Peace', 'War'])
        yield (views.Intention, {'intention': choice})
        yield (views.Decision, {"decision": choice})
        #assert 'Both of you chose to go to peace' in self.html
        #assert self.player.payoff == Constants.both_cooperate_payoff
        yield (views.Results)