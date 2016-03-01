import re


def main():
    str_re_kana = r'[\u3040-\u30FF]'
    com = re.compile(str_re_kana)
    print(com.search('めてクルマ').group(0))
