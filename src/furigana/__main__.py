import sys
from optparse import OptionParser

import configs
import db
import process


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


def worker(text: str = '', search_only=False, local_only=False) -> str:
    """
    process a text.
    :return:
    """
    db.connect()

    result = process.process_text(text)

    db.disconnect()
    return result


if __name__ == '__main__':
    main()
