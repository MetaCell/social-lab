from . import models
from ._builtin import Page, WaitPage
from otree.api import Currency as c, currency_range
from .models import Constants


class HumanTest(Page):
    form_model = models.Player
    form_fields = ['guess']


class TestResult(Page):
    pass

page_sequence = [HumanTest, TestResult]
