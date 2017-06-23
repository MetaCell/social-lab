from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
import random

class PlayerBot(Bot):

    def play_round(self):

        value = random.randint(1, 100)
        yield (views.Offer, {"group.kept": value})
        yield (views.Results)
