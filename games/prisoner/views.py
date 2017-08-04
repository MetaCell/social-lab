from . import models
from ._builtin import Page, WaitPage
from otree.api import Currency as c, currency_range
from .models import Constants


class Introduction(Page):
    timeout_seconds = 100


class Decision(Page):
    form_model = models.Player
    form_fields = ['decision']

    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'participantCode': self.participant.code,
                'sessionId': self.session.id,
                'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
                'page': "initial" if self.round_number == 1 else "",
                'points': self.player.participant.payoff,
                'game': 'prisoner'
        }


class ResultsWaitPage(WaitPage):
    body_text = 'Waiting for the other participant to choose.'

    def after_all_players_arrive(self):
        for p in self.group.get_players():
            p.set_payoff()


class Results(Page):
    def vars_for_template(self):
        self.player.set_payoff()

        return {
            'my_decision': self.player.decision.lower(),
            'other_player_decision': self.player.other_player().decision.lower(),
            'same_choice': self.player.decision == self.player.other_player().decision,
            'points': self.player.participant.payoff,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number) + "/" + str(models.Constants.num_rounds),
            'round': self.round_number,
            'game': 'prisoner'
        }


page_sequence = [
    Decision,
    ResultsWaitPage,
    Results
]
