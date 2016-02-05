rep_list = []
rep_dict = {}


def load(filename):
    fp = open(filename, 'r', encoding='utf-8')
    flag = 0
    for line in fp:
        if line.endswith('\n'):
            line = line[0:-1]
        rep_list.append(line)
        if flag == 0:
            match = str(line)
        elif flag == 1:
            origin = str(line)
        elif flag == 2:
            kana = str(line)
            len_of_char = len(origin)
            pos = match.find(origin)
            print(pos)
            print(len_of_char)
            if pos == -1:
                break
            sub = origin + '(' + kana + ')'
            sub = match.replace(origin, sub)
            rep_dict[match] = sub
        flag += 1
        flag %= 4
    fp.close()


def load_dict(last_num):
    for i in range(0, last_num):
        name = '../res/dict' + '%03d' % i + '.txt'
        load(name)
