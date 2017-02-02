import sys
from optparse import OptionParser

import configs
import db


def main():
    """
    entry for a single furigana run.
    :return:
    """
    parser = OptionParser()
    parser.add_option('-s', '--search-only')
    parser.add_option('-d', '--debug')
    parser.add_option('-l', '--local-only')

    # the --help is conflicting
    # parser.add_option('-h', '--help')
   
    (option, args) = parser.parse_args()

    worker()


def worker():
    db.connect()
    db.disconnect()


if __name__ == '__main__':
    main()
