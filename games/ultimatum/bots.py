from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random


class PlayerBot(Bot):

    def play_round(self):
        if self.player.id_in_group == 1:
            value = random.randint(1, 10) * 10
            yield (views.Offer, {'amount_offered': c(value)})
        else:
            value = random.choice([True, False])
            if self.group.strategy:
                yield (views.AcceptStrategy, {'response_{}'.format(
                    int(offer)): value for offer in Constants.offer_choices})
            else:
                yield (views.Accept, {'offer_accepted': value})
        yield (views.Results)



