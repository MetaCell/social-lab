from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random

class PlayerBot(Bot):

    def play_round(self):

        if self.player.id_in_group == 1:
            value = random.randint(1, 10) * 10
            yield (views.Send, {"sent_amount": value})

        else:
            value = random.randint(1, 10) * 10
            yield (views.SendBack, {'sent_back_amount': value})

        yield (views.Results)
