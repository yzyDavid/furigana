from bs4 import BeautifulSoup as bs
from queue import Queue
import requests
import threading

import configs
import res
import db

word_queue = Queue()
threads = []


class WorkThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        if word_queue.empty():
            return
        while not word_queue.empty():
            word = word_queue.get()
            if not check_kanji_exists(word):
                continue
            if check_exists_in_db(word):
                continue
            search_word(word)
        pass


def check_kanji_exists(word: str) -> bool:
    """
    check if a word has kanji.
    return True if the word need to be transformed.
    :param word:
    :return:
    """
    assert isinstance(word, str)
    for c in word:
        if c in res.splitch:
            return False
        if c not in res.kanas and c not in res.letters:
            return True
    return False


def check_exists_in_db(origin_word: str) -> bool:
    """

    :param word:
    :return:
    """
    cursor = db.conn.cursor()
    connect = db.conn
    pass


def search_word(word: str) -> str:
    """
    search one kanji word and return it's furigana if exists.
    :param word: word to search in net
    """
    search_url = configs.BASIC_URL + word
    pass