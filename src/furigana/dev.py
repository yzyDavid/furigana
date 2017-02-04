import requests
from bs4 import BeautifulSoup as bs

import configs


def dev_test():
    url = 'http://dict.hjenglish.com/jp/jc/%E5%AF%9D%E3%82%8B'
    content = requests.get(url, headers=configs.headers).content.decode('utf-8')
    doc = bs(content, 'html.parser')
    print(doc)


if __name__ == '__main__':
    dev_test()
