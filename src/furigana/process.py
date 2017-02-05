from bs4 import BeautifulSoup as bs
from queue import Queue
import requests
import threading
from itertools import product
import pymysql

import configs
import res
import db

word_queue = Queue()
threads = []


class WorkThread(threading.Thread):
    """
    work thread for the thread pool.
    fetch word in the queue and die if the queue is empty.
    """

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        if configs.debug:
            print(self.getName(), 'started')
        if word_queue.empty():
            return
        while not word_queue.empty():
            word = word_queue.get()
            if not is_kanji_exists(word):
                continue
            if is_exists_in_db(word):
                continue
            search_word(word)


def is_kanji_exists(word: str) -> bool:
    """
    check if a word has kanji.
    return True if the word need to be transformed.
    :param word:
    :return:
    """
    assert isinstance(word, str)
    for c in word:
        if c == ' ':
            return False
        if c in res.splitch:
            return False
        if c not in res.kanas and c not in res.letters:
            return True
    return False


def is_exists_in_db(raw_word: str) -> bool:
    """
    check if the word already in the database.
    :param raw_word:
    :return:
    """
    if len(raw_word) == 0:
        return False
    try:
        conn = db.connect()
        cursor = conn.cursor()
        result = cursor.execute('''SELECT word FROM ruby_table WHERE word = '%s';''' % raw_word)
    except pymysql.err.InternalError:
        print('===ERROR===', raw_word)
    finally:
        conn.close()

    if not result:
        return False
    else:
        return True


def search_word(word: str) -> str:
    """
    search one kanji word and return it's furigana if exists.
    return None on error occurred.
    also put the result in db.
    should NOT be called outside the file.
    :param word: word to search in net
    """
    search_url = configs.BASIC_URL + word
    try:
        content_str = requests.get(search_url, headers=configs.headers).content.decode('utf-8')
    except requests.exceptions.ConnectionError:
        if configs.debug:
            print('Error! Connection failed!\nOn searching %s' % word)
        return None
    doc = bs(content_str, 'html.parser')
    jpword_list = doc.find_all(id='jpword_1')
    assert len(jpword_list) == 0 or len(jpword_list) == 1
    if len(jpword_list) == 0:
        return None
    jpword = jpword_list[0].text
    kana = doc.find_all(id='kana_1')[0].text[1:-1]

    okurigana_len = 1
    while jpword[-okurigana_len] == kana[-okurigana_len]:
        okurigana_len += 1
    okurigana_len -= 1

    kanji = jpword[:-okurigana_len]
    kanji_kana = kana[:-okurigana_len]
    replacement = word.replace(kanji, kanji + '(' + kanji_kana + ')', 1)
    if configs.debug:
        print(kanji, kanji_kana)
    conn = db.connect()
    cursor = conn.cursor()
    cursor.execute(
        '''DELETE FROM ruby_table WHERE word = '%s' ''' % word
    )
    cursor.execute(
        f'''INSERT INTO ruby_table VALUES ('{word}', '{jpword}', '{kanji}', '{kanji_kana}', '{replacement}')'''
    )
    conn.commit()
    conn.close()
    return replacement


def push_word_in_queue(word: str) -> str:
    if word:
        word_queue.put(word)
    return word


def start_search():
    """
    launch the thread pool.
    time keeping is needed.
    :return:
    """
    for n in range(configs.max_in_pools):
        t = WorkThread()
        t.start()
        threads.append(t)


def search_word_in_text(text: str):
    """

    :param text:
    """
    for line in text.split():
        length = len(line)
        if configs.debug:
            print(line)
            print(length)
        for (begin, end) in product(range(length), repeat=2):
            if begin > end:
                continue
            word = line[begin:end + 1]
            if not is_kanji_exists(word) or is_exists_in_db(word):
                continue
            push_word_in_queue(word)
    start_search()


def replace_text(text: str) -> str:
    """

    :param text:
    :return:
    """
    pass
