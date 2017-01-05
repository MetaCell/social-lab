from . import models
from ._builtin import Page, WaitPage
from otree.api import Currency as c, currency_range
from .models import Constants


class Introduction(Page):
    timeout_seconds = 100


class Intention(Page):
    form_model = models.Player
    form_fields = ['intention']


class Decision(Page):
    form_model = models.Player
    form_fields = ['decision']

    def vars_for_template(self):

        return {
            'other_player_intention': self.player.other_player().intention,
        }


class WaitForOther(WaitPage):
    pass


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        for p in self.group.get_players():
            p.set_payoff()


class Results(Page):
    def vars_for_template(self):
        self.player.set_payoff()

        return {
            'my_intention': self.player.intention.lower(),
            'other_player_intention': self.player.other_player().intention.lower(),
            'my_decision': self.player.decision.lower(),
            'other_player_decision': self.player.other_player().decision.lower(),
            'same_choice': self.player.decision == self.player.other_player().decision,
        }


page_sequence = [
    Intention,
    WaitForOther,
    Decision,
    ResultsWaitPage,
    Results
]
