import threading
from src.hj_dict.search_word import search_word
from src.core.dict import *

str_re_kanji = r'[\u3400-\u9FFF\uF900-\uFAFF]+'
str_re_kana = r'[\u3040-\u30ff]'


def try_string(string: str):
    pass


def search_file(filename: str):
    """
    this function search through all kanji in the filename given
    and should add all the matches into the dict.
    :param filename:
    :return:
    """
    with open(filename, 'r', encoding='utf-8') as fp:
        counter = 0
        if not fp:
            return None
        for line in fp:
            counter += 1
            print(counter)
            if line.endswith('\n'):
                line = line[0:-1]
            length = len(line)
            for i in range(0, length):
                for j in range(i + 1, length + 1):
                    if line[i:j] not in rep_dict:
                        print(line[i:j])
                        result = search_word(line[i:j])
                        if result is None:
                            continue
                        origin = line[i:j]
                        left = 1
                        while origin[-left] == result[-left]:
                            left += 1
                        left -= 1
                        if not left == 0:
                            rep_dict[origin] = origin[:-left] + '(' + result[:-left] + ')' + origin[len(origin) - left:]
                        else:
                            rep_dict[origin] = origin + '(' + result + ')'
