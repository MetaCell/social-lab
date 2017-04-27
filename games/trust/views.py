from ._builtin import Page, WaitPage
from . import models
from .models import Constants

class Send(Page):
    """This page is only for P1
    P1 sends amount (all, some, or none) to P2
    This amount is tripled by experimenter,
    i.e if sent amount by P1 is 5, amount received by P2 is 15"""

    form_model = models.Group
    form_fields = ['sent_amount']

    def is_displayed(self):
        return self.player.id_in_group == 1


    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'participantCode': self.participant.code,
                'sessionId': self.session.id,
                'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
                'points': self.player.participant.payoff,
                'game': 'trust'
        }

    timeout_seconds = 300


class SendBack(Page):
    """This page is only for P2
    P2 sends back some amount (of the tripled amount received) to P1"""

    form_model = models.Group
    form_fields = ['sent_back_amount']

    def is_displayed(self):
        return self.player.id_in_group == 2

    def vars_for_template(self):
        tripled_amount = self.group.sent_amount * Constants.multiplication_factor

        return {
                'tripled_amount': tripled_amount,
                'prompt': 'Please enter a number from 0 to %s:' % tripled_amount,
                'playerIdInSession': self.player.id_in_subsession,
                'participantCode': self.participant.code,
                'sessionId': self.session.id,
                'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
                'points': self.player.participant.payoff,
                'game': 'trust'
        }

    def sent_back_amount_max(self):
        return self.group.sent_amount * Constants.multiplication_factor

    timeout_seconds = 300


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        self.group.set_payoffs()


class Results(Page):
    """This page displays the earnings of each player"""

    def vars_for_template(self):
        return {
            'tripled_amount': self.group.sent_amount * Constants.multiplication_factor,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'round': self.round_number,
            'points': self.player.participant.payoff,
            'game': 'trust'
        }


page_sequence = [
    Send,
    WaitPage,
    SendBack,
    ResultsWaitPage,
    Results,
]
