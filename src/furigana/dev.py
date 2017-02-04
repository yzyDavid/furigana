import requests
from bs4 import BeautifulSoup as bs

import configs


def dev_test():
    url = 'http://dict.hjenglish.com/jp/jc/寝ない'
    content = requests.get(url, headers=configs.headers).content.decode('utf-8')
    doc = bs(content, 'html.parser')
    print(doc.find_all(id='jpword_1')[0].text)
    print(doc.find_all(id='kana_1')[0].text[1:-1])


if __name__ == '__main__':
    dev_test()
