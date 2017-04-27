from . import models
from ._builtin import Page, WaitPage


class Intention(Page):
    timeout_seconds = 300
    form_model = models.Player
    form_fields = ['intention']

    def vars_for_template(self):

        return {
            'playerIdInSession': self.player.id_in_subsession,
            'participantIdInSession': self.participant.id_in_session,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'game': 'peacewar'
        }


class Decision(Page):
    timeout_seconds = 300
    form_model = models.Player
    form_fields = ['decision']

    def vars_for_template(self):

        return {
            'my_intention': self.player.intention.lower(),
            'other_player_intention': self.player.other_player().intention.lower(),
            'playerIdInSession': self.player.id_in_subsession,
            'participantIdInSession': self.participant.id_in_session,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'sessionId': self.session.id,
            'game': 'peacewar'
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
            'playerIdInSession': self.player.id_in_subsession,
            'participantIdInSession': self.participant.id_in_session,
            'sessionId': self.session.id,
            'round': self.round_number,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'game': 'peacewar'
        }


page_sequence = [
    Intention,
    WaitForOther,
    Decision,
    ResultsWaitPage,
    Results
]
