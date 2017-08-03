from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
import random

class PlayerBot(Bot):

    def play_round(self):

        value = random.randint(1, 100)

        if self.player.id_in_group == 1:
            yield (views.Offer, {"kept": c(value)})

        yield (views.Results)
