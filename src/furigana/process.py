from bs4 import BeautifulSoup as bs
from queue import Queue
import requests
import threading

import configs
import res

word_queue = Queue()


def check_kanji_exists(word: str) -> bool:
    """
    check if a word has kanji.
    return True if the word need to be transformed.
    :param word:
    :return:
    """
    for c in word:
        if c in res.splitch:
            return False
        if c not in res.kanas and c not in res.letters:
            return True
    return False


def search_word(word: str) -> str:
    """
    search one kanji word and return it's furigana if exists.
    :param word: word to search in net
    """
    search_url = configs.BASIC_URL + word
