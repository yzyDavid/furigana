__doc__ = """
dynamic configs, can be changed according to
actual database and machine parameters.
"""

# database config
db_name = 'furigana'
table_name = 'ruby_table'
username = 'root'
password = ''

BASIC_URL = r'http://dict.hjenglish.com/jp/jc/'
headers = {"User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'}

max_in_pools = 0
debug = True
