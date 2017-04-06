from ._builtin import Page
from . import models


class Introduction(Page):
    pass


class Chat(Page):
    """This page is only for P1
    P1 sends amount (all, some, or none) to P2
    This amount is tripled by experimenter,
    i.e if sent amount by P1 is 5, amount received by P2 is 15"""

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
            'sessionId': self.session.id,
            'round': self.round_number,
            'game': 'chat'
        }


page_sequence = [
    Chat
]
