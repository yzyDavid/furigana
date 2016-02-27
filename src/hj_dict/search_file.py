from src.hj_dict.search_word import search_word
from src.core.dict import *

str_re_kanji = r'[\u3400-\u9FFF\uF900-\uFAFF]+'
str_re_kana = r'[\u3040-\u30ff]'


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
                for j in range(i, length):
                    result = search_word(line[i:j])
                    if result and line[i:j] not in rep_dict:
                        origin = line[i:j]
                        i = 1
                        while origin[-i] == result[-i]:
                            i += 1
                        i -= 1
                        if not i == 0:
                            rep_dict[origin] = origin[:-i] + '(' + result[:-i] + ')' + origin[len(origin) - i:]
                        else:
                            rep_dict[origin] = origin + '(' + result + ')'
