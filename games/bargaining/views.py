from . import models
from ._builtin import Page, WaitPage
from otree.api import Currency as c, currency_range
from .models import Constants


class Introduction(Page):
    pass


class Request(Page):
    form_model = models.Player
    form_fields = ['request_amount']

    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'participantCode': self.participant.code,
                'sessionId': self.session.id,
                'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
                'page': "initial" if self.round_number == 1 else "",
                'points': self.player.participant.payoff,
                'game': 'bargaining'
        }


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        self.group.set_payoffs()


class Results(Page):
    def vars_for_template(self):
        return {
            'sum': self.player.request_amount + self.player.other_player().request_amount,
            'earn': self.player.payoff,
            'points': self.player.participant.payoff,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number) + "/" + str(models.Constants.num_rounds),
            'round': self.round_number,
            'game': 'bargaining'
        }


page_sequence = [
    Request,
    ResultsWaitPage,
    Results,
]