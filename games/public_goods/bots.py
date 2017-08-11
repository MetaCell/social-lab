from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
import random

class PlayerBot(Bot):

    def play_round(self):

        value = random.randint(0, 100)
        yield (views.Contribute, {"contribution": value})
        yield (views.Results)
