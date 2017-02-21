from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random
from urlparse import urlparse
import requests
from pyquery import PyQuery as pq

class PlayerBot(Bot):


    def __init__(self, player, participant_bot):
        self.mitsuku = Mitsuku()
        super(PlayerBot, self).__init__(player, participant_bot)

    def on_message(self, message):
        return self.mitsuku.send(message)

    def play_round(self):
        yield (views.Chat,{"sent_text":"I am a bot"})



class Mitsuku():

    ENDPOINT_CHAT_MITSUKU = "https://kakko.pandorabots.com/pandora/talk?botid=f326d0be8e345a13&skin=chat"


    def __init__(self):
        self.tag = 'Anonymous'
        self.conn = requests.Session()

    def get_raw_html_for_message(self, message):
            resp = self.conn.post(self.ENDPOINT_CHAT_MITSUKU, { "message": message }, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            return resp.text

    def parse_message_from_html(self, html):
        conv = pq(html)
        conv = conv('body').find('p').text().strip()
        message = conv[conv.index("itsuku:")+7:conv.index("Mitsuku:")]
        if message.find("You:") != -1:
            message = message[:message.index("You:")]
        return message.strip()

    def send(self, message):
        return self.parse_message_from_html(self.get_raw_html_for_message(message))




