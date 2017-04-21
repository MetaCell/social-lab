from ._builtin import Page, WaitPage
from . import models
from .models import Constants

class Offer(Page):
    form_model = models.Group
    form_fields = ['amount_offered']

    def is_displayed(self):
        return self.player.id_in_group == 1


    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'sessionId': self.session.id,
                'round': self.round_number,
                'game': 'ultimatum'
        }

    timeout_seconds = 300


class WaitForProposer(WaitPage):
    pass


class Accept(Page):
    form_model = models.Group
    form_fields = ['offer_accepted']

    def is_displayed(self):
        return self.player.id_in_group == 2 and not self.group.strategy

    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'sessionId': self.session.id,
                'round': self.round_number,
                'game': 'ultimatum'
        }

    timeout_seconds = 300


class AcceptStrategy(Page):
    form_model = models.Group
    form_fields = ['response_{}'.format(int(i)) for i in
                   Constants.offer_choices]

    def is_displayed(self):
        return self.player.id_in_group == 2 and self.group.strategy


    def vars_for_template(self):

        return {
                'playerIdInSession': self.player.id_in_subsession,
                'sessionId': self.session.id,
                'round': self.round_number,
                'game': 'ultimatum'
        }

    timeout_seconds = 300

class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        self.group.set_payoffs()


class Results(Page):
    pass


page_sequence = [Offer,
                 WaitForProposer,
                 Accept,
                 ResultsWaitPage,
                 Results]
