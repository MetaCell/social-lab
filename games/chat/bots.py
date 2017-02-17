from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random


class PlayerBot(Bot):

    def on_message(self, message):
        return "I don't understand"

    def play_round(self):
        yield (views.Chat,{"sent_text":"I am a bot"})