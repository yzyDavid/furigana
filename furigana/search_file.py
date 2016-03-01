from multiprocessing.dummy import Pool
from search_word import search_word
from dict import *
from globals import DEBUG

str_re_kanji = r'[\u3400-\u9FFF\uF900-\uFAFF]+'
str_re_kana = r'[\u3040-\u30ff]'


def try_string(str_to_search: str):
    if DEBUG:
        print(str_to_search)
    result = search_word(str_to_search)
    if result is None:
        return
    origin = str_to_search
    if len(origin) < len(result):
        length = len(origin)
    else:
        length = len(result)
    left = 1
    while origin[-left] == result[-left] and left < length:
        left += 1
    left -= 1
    if not left == 0:
        rep_dict[origin] = origin[:-left] + '(' + result[:-left] + ')' + origin[len(origin) - left:]
    else:
        rep_dict[origin] = origin + '(' + result + ')'


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
            pool = Pool(20)
            list_to_process = []
            for i in range(0, length):
                for j in range(i + 1, length + 1):
                    if line[i:j] not in rep_dict:
                        for word in line[i:j].split():
                            list_to_process.append(word)
            pool.map(try_string, list_to_process)
            pool.close()
            pool.join()
