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
    parser.add_option('-s', '--search')
    parser.add_option('-q', '--quiet')
    parser.add_option('-d', '--debug')

    # the --help is conflicting
    # parser.add_option('-h', '--help')
   
    (option, args) = parser.parse_args()

    if configs.debug:
        print('furigana')

    db.connect()
    db.disconnect()


if __name__ == '__main__':
    main()
