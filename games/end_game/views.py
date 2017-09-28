from . import models
from ._builtin import Page, WaitPage
from .models import Constants


class EndGame(Page):
    form_model = models.Player
    form_fields = ['guess']


class TestResult(Page):
    def vars_for_template(self):
        return {
            'participant_platform': self.player.participant.external_platform,
            'participant_worker_id': self.player.participant.worker_id,
            'participant_completion_url': self.player.participant.completion_url,
            'page': "final",
            'game': self.session.game,
            'playerIdInSession': self.player.id_in_subsession,
            'participantCode': self.participant.code,
            'sessionId': self.session.id
        }

page_sequence = [TestResult]