from ._builtin import Page
from . import models


class Introduction(Page):
    pass


class Chat(Page):
    form_model = models.Player
    form_fields = ['sent_text']
    timeout_seconds = 300

    def before_next_page(self):
        if self.timeout_happened:
            setattr(self.player, 'sent_text', self.request.POST.dict()['sent_text'])
        pass

    def vars_for_template(self):
        return {
            'playerIdInSession': self.player.id_in_subsession,
            'participantIdInSession': self.participant.id_in_session,
            'sessionId': self.session.id,
            'round': self.round_number,
            'game': 'chat'
        }


page_sequence = [
    Chat
]
