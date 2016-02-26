import requests
import re

str_re_kanji = r'[/u3400-/u9FFF/uF900-/uFAFF]+'


def search_file(filename: str):
    """
    this function search through all kanji in the filename given
    and should add all the matches into the dict.
    :param filename:
    :return:
    """
    with open(filename, 'r', encoding='utf-8') as fp:
        if not fp:
            return None
        for line in fp:
            pass
