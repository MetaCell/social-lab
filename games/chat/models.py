from otree.api import (
    models, widgets, BaseConstants, BaseSubsession, BaseGroup, BasePlayer, currency_range
)


doc = """
Chat game
"""


class Constants(BaseConstants):
    name_in_url = 'chat'
    players_per_group = 2
    num_rounds = 1

    instructions_template = 'chat/Instructions.html'


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    sent_text = models.TextField(
        doc="""The log of the chat""",
        widget=widgets.TextInput()
    )

