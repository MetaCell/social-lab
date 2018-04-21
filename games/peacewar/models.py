from otree.api import (
    models, widgets, BaseConstants, BaseSubsession, BaseGroup, BasePlayer,
    Currency as c, currency_range
)
import random

doc = """
This is an intention based "Peace War". Two players are asked separately
whether they intend to declare peace or war. They are then asked to follow through with their intentions or not.
Their choices directly determine the payoffs.
"""


class Constants(BaseConstants):
    name_in_url = 'peacewar'
    players_per_group = 2
    num_rounds = 5

    instructions_template = 'peacewar/Instructions.html'

    # payoff if 1 player defects and the other cooperates""",
    betray_payoff = c(0.15)
    betrayed_payoff = c(0)

    # payoff if both players cooperate or both defect
    both_cooperate_payoff = c(0.10)
    both_defect_payoff = c(0.05)


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    decision = models.CharField(
        choices=['Peace', 'War'],
        doc="""This player's decision""",
        widget=widgets.RadioSelect(),
        default='Peace',
        auto_submit_default='Peace'
    )

    intention = models.CharField(
        choices=['Peace', 'War'],
        doc="""This player's intention""",
        widget=widgets.RadioSelect(),
        default='Peace',
        auto_submit_default='Peace'
    )

    def other_player(self):
        return self.get_others_in_group()[0]

    def set_payoff(self):
        points_matrix = {'Peace': {
                             'Peace': Constants.both_cooperate_payoff,
                             'War': Constants.betrayed_payoff},
                         'War': {
                             'Peace': Constants.betray_payoff,
                             'War': Constants.both_defect_payoff}}

        self.payoff = (points_matrix[self.decision]
                       [self.other_player().decision])
