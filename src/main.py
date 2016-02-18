from src.core.process import *
from src.core.dict import *
import sys


def main():
    load_dict(1)
    argc = len(sys.argv)
    for arg in sys.argv:
        print(arg)

    if argc == 1:
        while True:
            name = input()
            if name == '' or name == str(-1):
                return 0
            proc_file(name, name + r'.output.txt')
    elif argc == 2:
        proc_file(sys.argv[1], sys.argv[1] + r'.output.txt')
        return 0
    else:
        pass
    return 1


if __name__ == '__main__':
    main()
