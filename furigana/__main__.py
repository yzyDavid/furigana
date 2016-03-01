from process import proc_file
from dict import load_dict
from search_file import search_file
from globals import DEBUG
from optparse import OptionParser
import sys


def main():
    parser = OptionParser()
    parser.add_option('-s', '--search')
    parser.add_option('-q', '--quiet')
    parser.add_option('-d', '--debug')
    (option, args) = parser.parse_args()


def main_old():
    argc = len(sys.argv)
    if DEBUG:
        for arg in sys.argv:
            print(arg)

    if argc == 1:
        while True:
            load_dict(1)
            name = input()
            if name == '' or name == str(-1):
                return 0
            proc_file(name, name + r'.output.txt')
    elif argc == 2:
        search_file(sys.argv[1])
        load_dict(1)
        proc_file(sys.argv[1], sys.argv[1] + r'.output.txt')
        print('finished!')
        return 0
    else:
        pass
    return 1


if __name__ == '__main__':
    main_old()
