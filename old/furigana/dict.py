# -*- coding:utf-8 -*-

from globals import rep_dict


def load(filename):
    """
    this function loads a common (user defined) dict file.
    :param filename:
    :return:
    """
    fp = open(filename, 'r', encoding='utf-8')
    flag = 0
    for line in fp:
        if line.endswith('\n'):
            line = line[0:-1]
        if flag == 0:
            match = str(line)
        elif flag == 1:
            origin = str(line)
        elif flag == 2:
            kana = str(line)
            pos = match.find(origin)
            if pos == -1:
                break
            sub = origin + '(' + kana + ')'
            sub = match.replace(origin, sub)
            rep_dict[match] = sub
        flag += 1
        flag %= 4
    fp.close()


def load_dict(last_num):
    """
    this function masters the load of all dict, including the processed dict.
    :param last_num:
    :return:
    """
    load_processed(r'./res/dict_processed.txt')
    for i in range(0, last_num):
        name = './res/dict' + '%03d' % i + '.txt'
        load(name)
    save(r'./res/dict_processed.txt')


def save(filename):
    """
    this function SHOULD save the dict to the processed dict file.
    :param filename:
    :return:
    """
    fp = open(filename, 'w', encoding='utf-8')
    for index in rep_dict:
        fp.write(index)
        fp.write('\n')
        fp.write(rep_dict[index])
        fp.write('\n')
        fp.write('\n')
    fp.close()


def load_processed(filename):
    """
    this function load the processed dictionary.
    :param filename:
    :return:
    """
    try:
        fp = open(filename, 'r', encoding='utf-8')
    except FileNotFoundError:
        fp = open(filename, 'w', encoding='utf-8')
        fp.close()
        fp = open(filename, 'r', encoding='utf-8')
    flag = 0
    for line in fp:
        if line.endswith('\n'):
            line = line[0:-1]
        if flag == 0:
            match = str(line)
        elif flag == 1:
            sub = str(line)
            rep_dict[match] = sub
        elif flag == 2:
            pass
        flag += 1
        flag %= 3
    fp.close()


def gen_inflected(word):
    """
    this function should:
        1.determine the type of the word
        2.generate the inflected form od the word and add it to the dict.
        !:this function should ONLY be called when the word got a result in the dict
          and it has been already added into the rep_dict.
          otherwise a exception would be raised.
    :param word:
    :return:
    """
    verb_suffix_1 = [
        'う', 'く', 'ぐ', 'す', 'ず',
        'つ', 'づ', 'ぬ', 'ふ', 'ぶ',
        'ぷ', 'む', 'ゆ', 'る'
    ]

    verb_suffix_i_1 = [
        'い', 'き', 'ぎ', 'し', 'じ',
        'ち', 'ぢ', 'に', 'ひ', 'び',
        'ぴ', 'み', '', 'り'
    ]

    verb_suffix_nai_1 = [
        'わない', 'かない', 'がない', 'さない', 'ざない',
        'たない', 'だない', 'なない', 'はない', 'ばない',
        'ぱない', 'まない', 'やない', 'らない'
    ]

    verb_suffix_2 = ['いる', 'きる', 'しる', 'ちる', 'にる',
                     'ひる', 'みる', 'りる',
                     'ぎる', 'じる', 'ぢる', 'びる', 'ぴる',
                     'える', 'ける', 'せる', 'てる', 'ねる',
                     'へる', 'める', 'れる',
                     'げる', 'ぜる', 'でる', 'べる', 'ぺる'
                     ]

    verb_suffix_modified = ['ない']
    append_to_pre_masu = ['ます', 'たい', 'たくない', 'なさい']

    adj_suffix = ['い']
    adj_suffix_modified = ['く']

    adjverb_suffix = ['']  # actually I got no idea on it. Besides I don't know if it's useful.

    for suffix in verb_suffix_2:
        if word[-len(suffix):] == suffix:
            pre_masu_fix = word[:-1]
            pre_masu_fix_processed = rep_dict[word][:-1]
            rep_dict[pre_masu_fix] = pre_masu_fix_processed
            return

    for suffix in verb_suffix_1:
        if word[-len(suffix):] == suffix:
            pre_masu_fix = word[:-1] + verb_suffix_i_1[verb_suffix_1.index(suffix)]
            pre_masu_fix_processed = rep_dict[word][:-1] + verb_suffix_i_1[verb_suffix_1.index(suffix)]
            rep_dict[pre_masu_fix] = pre_masu_fix_processed
            rep_dict[word[:-1] + verb_suffix_nai_1[verb_suffix_1.index(suffix)]] = \
                rep_dict[word[:-1]] + verb_suffix_nai_1[verb_suffix_1.index(suffix)]
        return

    for suffix in adj_suffix:
        if word[-len(suffix):] == suffix:
            pre_fix = word[:-1]
            pre_fix_processed = rep_dict[word][:-1]
            rep_dict[pre_fix + adj_suffix_modified[0]] = pre_fix_processed + adj_suffix_modified[0]
            return
