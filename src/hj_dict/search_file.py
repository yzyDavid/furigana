from src.hj_dict.search_word import search_word
from src.core.dict import *

str_re_kanji = r'[\u3400-\u9FFF\uF900-\uFAFF]+'


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
            if line.endswith('\n'):
                line = line[0:-1]
            length = len(line)
            for i in range(0, length):
                for j in range(i, length):
                    result = search_word(line[i:j])
                    if result:
                        rep_dict[line[i:j]] = line[i:j] + '(' + result + ')'
