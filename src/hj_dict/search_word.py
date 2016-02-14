# -*- coding:utf-8 -*-


# import urllib.request as ur
# import codecs

import requests

DEBUG = True

BASIC_URL = r'http://dict.hjenglish.com/jp/jc/'


# def search_word(word):
#    basic_url = r'http://dict.hjenglish.com/jp/jc/'
#    search_url = basic_url + word
#    #search_url = search_url.encode('ascii')
#    fp = ur.urlopen(search_url)
#    html_str = fp.read().decode('utf-8')
#    print(html_str)

def search_word(word):
    search_url = BASIC_URL + word
    r = requests.get(search_url)
    content_str = r.content.decode('utf-8')
    if DEBUG:
        print(search_url)
        print(r.url)
        print(content_str)
        print(r.encoding)
        with open('out.txt', 'w', encoding='utf-8') as fp:
            fp.write(content_str)
