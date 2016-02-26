from src.core.process import *
from src.core.dict import *
from src.hj_dict.search_file import *
import sys


def main():
    argc = len(sys.argv)
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
        return 0
    else:
        pass
    return 1


if __name__ == '__main__':
    main()
