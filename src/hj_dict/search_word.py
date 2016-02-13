import urllib.request as ur
import codecs


def search_word(word):
    basic_url = r'http://dict.hjenglish.com/jp/jc/'
    search_url = basic_url + word
    #search_url = search_url.encode('ascii')
    fp = ur.urlopen(search_url)
    html_str = fp.read().decode('utf-8')
    print(html_str)
