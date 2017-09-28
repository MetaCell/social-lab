from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random


class PlayerBot(Bot):
    def play_round(self):
        yield (views.Decision, {"decision": random.choice(['Cooperate', 'Defect'])})
        yield (views.Results)