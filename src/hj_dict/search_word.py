# -*- coding:utf-8 -*-


# import urllib.request as ur
# import codecs

import requests
import re

DEBUG = False

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
    content_str = re.sub('\n', '', content_str)
    content_str = ''.join(content_str.split())

    if DEBUG:
        '''
        print(search_url)
        print(r.url)
        print(content_str)
        print(r.encoding)
        '''
        with open('out.txt', 'w', encoding='utf-8') as fp:
            fp.write(content_str)

    if DEBUG:
        with open('../../res/html_part.txt', encoding='utf-8') as fpsaved:
            content_str = fpsaved.readline()

    kana = ''
    # re1_str = r'([/u2E80-/u9FFF]+)'
    re1_str = '假名">【([/u2E80-/u9FFF]+)】<'
    re1_str = 'title="假名">【(.*?)】<'
    # re1_str = r'<span id="kana_1" class="trs_jp bold" title="假名">【(\w+)】</span>'
    re2_str = '<span id="kana_1" class="trs_jp bold" title="假名"><font color="red">【(\S+)】</font></span>'
    m1 = re.search(re1_str, content_str)
    c1 = re.compile(re1_str, re.MULTILINE)
    res1 = c1.search(content_str)
    m2 = re.search(re2_str, content_str)
    print(type(m1))
    print(type(res1))
    print(c1.flags)
    print(re.findall(re1_str, content_str))
    print(res1.groups())
    print(m1.group(0))
    print(m1.start(1))
    print(m1.groups())
    #    print(m2.group(1))
    '''
    [/u2E80-/u9FFF]+
    '''
