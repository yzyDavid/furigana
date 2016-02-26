import re
from src.hj_dict.search_word import search_word

print(search_word('足音'))
search_word('勉強')

'''
text = "JGood is a handsome boy, he is cool, clever, and so on..."
m = re.match(r"(\w+)\s", text)
if m:
    print(m.group(0), '\n', m.group(1))
else:
    print('not match')

print(m)

text = "JGood is a handsome boy, he is cool, clever, and so on..."
m = re.search(r'\shan(ds)ome\s', text)
print(m.group(0))
print(m.group(1))
'''
