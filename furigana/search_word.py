# -*- coding:utf-8 -*-


# import urllib.request as ur
# import codecs

import requests
import re

from globals import DEBUG
from globals import kanas
from globals import letters
from globals import splitch

'''
This method should be redesigned
every re just should be compile once and can be used many times for performance.
'''

BASIC_URL = r'http://dict.hjenglish.com/jp/jc/'
str_1_start = r"<span id='kana_1' class='trs_jp bold' title='假名'>【"
str_1_end = r'】</span>'
str_2_start = r"<span id='kana_1' class='trs_jp bold' title='假名'><font color='red'>"
str_2_end = r'】</font></span>'
str_re_bracket = r'(\S+)'


def search_word(word):
    """
    this function should search only one word given and return it's furigana.
    return None if no result can be found
    :type word: str
    """

    word = word.strip()
    if word.startswith(' '):
        return None

    for char in word:
        if char not in kanas and char not in letters and char not in splitch:
            break
    else:
        return None

    search_url = BASIC_URL + word
    try:
        content_str = requests.get(search_url).content.decode('utf-8')
    except requests.exceptions.ConnectionError:
        print('Error! Connection failed!\nOn searching %s' % word)
        return None

    str_1_re = str_1_start + str_re_bracket + str_1_end
    re_1 = re.compile(str_1_re)
    result_1 = re_1.search(content_str)

    if result_1:
        return result_1.group(1)

    str_2_re = str_2_start + str_re_bracket + str_2_end
    re_2 = re.compile(str_2_re)
    result_2 = re_2.search(content_str)

    if result_2:
        return result_2.group(1)

    return None
