from globals import rep_dict
from globals import sorted_list


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


def sort_dict():
    """
    this function should generate a list of the sorted dict from rep_dict to sorted_list.
    :return: nothing
    """
    pass
