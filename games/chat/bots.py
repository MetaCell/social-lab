from otree.api import Currency as c, currency_range
from . import views
from ._builtin import Bot
from .models import Constants
import random
from urlparse import urlparse
import requests
from pyquery import PyQuery as pq
import re

class PlayerBot(Bot):


    def on_message(self, message):
        return self.mitsuku.send(message)

    def play_round(self):
        self.mitsuku = Mitsuku()
        yield (views.Chat,{"sent_text":"I am a bot"})



class Mitsuku():

    ENDPOINT_CHAT_MITSUKU = "https://kakko.pandorabots.com/pandora/talk?botid=f326d0be8e345a13&skin=chat"
    MESSAGE_REGEX = "/(Mitsuku:(.*))/"
    MESSAGE_REJECT_REGEX = "/(x(.*)x[^\s]+)|(\|)|(BYESPLIT X1234)/ig"
    MESSAGE_SENDER_TAG = "You:"

    def __init__(self):
        self.tag = 'Anonymous'
        self.conn = requests.Session()

    def get_raw_html_for_message(self, message):
            resp = self.conn.post("POST", self.ENDPOINT_CHAT_MITSUKU, { "message": message }, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            return resp.text

    def parse_message_from_html(self, html):
        conv = pq(html)
        conv = conv('body').find('p').text().trim()
        match = re.search(self.MESSAGE_REGEX, conv)

        if match and match.length > 0:
            message = match[match.length - 1]
            prevMessageStart = message.indexOf(self.MESSAGE_SENDER_TAG)
            if prevMessageStart != -1:
                message = message.substr(0, prevMessageStart)

            return message.replace(self.MESSAGE_REJECT_REGEX, '').trim()
        else:
            raise "Could not parse Mitsuku response";

    def send(self, message):
        return self.parse_message_from_html(self.get_raw_html_for_message(message))




