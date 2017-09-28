from . import models
from ._builtin import Page, WaitPage
from otree.api import Currency as c, currency_range
from .models import Constants


class Introduction(Page):
    """Description of the game: How to play and returns expected"""
    pass


class Contribute(Page):
    """Player: Choose how much to contribute"""

    form_model = models.Player
    form_fields = ['contribution']

    timeout_submission = {'contribution': c(Constants.endowment / 2)}

    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'participantCode': self.participant.code,
                'sessionId': self.session.id,
                'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
                'page': "initial" if self.round_number == 1 else "",
                'points': self.player.participant.payoff,
                'game': 'public_goods'
        }


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        self.group.set_payoffs()

    body_text = "Waiting for other participants to contribute."


class Results(Page):
    """Players payoff: How much each has earned"""

    def vars_for_template(self):
        return {
            'total_earnings': self.group.total_contribution * Constants.efficiency_factor,
            'points': self.player.participant.payoff,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number) + "/" + str(models.Constants.num_rounds),
            'round': self.round_number,
            'game': 'public_goods'
        }


page_sequence = [
    Contribute,
    ResultsWaitPage,
    Results
]