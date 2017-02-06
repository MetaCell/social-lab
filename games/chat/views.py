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

    def vars_for_template(self):

        return {
            'playerIdInSession': self.player.id_in_subsession,
            'sessionId': self.session.id
        }

page_sequence = [
    Chat
]
