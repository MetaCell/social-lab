from . import models
from ._builtin import Page, WaitPage
import random

class Intention(Page):
    timeout_seconds = 30
    form_model = models.Player
    form_fields = ['intention']

    def vars_for_template(self):

        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'points': self.player.participant.payoff,
            'page': "initial" if self.round_number == 1 else "",
            'game': 'peacewar'
        }


class Decision(Page):
    timeout_seconds = 30
    form_model = models.Player
    form_fields = ['decision']

    def vars_for_template(self):

        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'my_intention': self.player.intention.lower(),
            'other_player_intention': self.player.other_player().intention.lower(),
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'sessionId': self.session.id,
            'points': self.player.participant.payoff,
            'game': 'peacewar'
        }


class WaitForOther(WaitPage):
    def vars_for_template(self):

        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'playerIdInSession': self.player.id_in_subsession,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'sessionId': self.session.id,
            'points': self.player.participant.payoff,
            'game': 'peacewar'
        }


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        for p in self.group.get_players():
            p.set_payoff()

    def vars_for_template(self):

        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'playerIdInSession': self.player.id_in_subsession,
            'roundCount': str(self.round_number)+"/"+str(models.Constants.num_rounds),
            'sessionId': self.session.id,
            'points': self.player.participant.payoff,
            'game': 'peacewar'
        }



class Results(Page):
    def vars_for_template(self):
        self.player.set_payoff()

        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'my_intention': self.player.intention.lower(),
            'other_player_intention': self.player.other_player().intention.lower(),
            'my_decision': self.player.decision.lower(),
            'other_player_decision': self.player.other_player().decision.lower(),
            'same_choice': self.player.decision == self.player.other_player().decision,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id,
            'points': self.player.participant.payoff,
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
