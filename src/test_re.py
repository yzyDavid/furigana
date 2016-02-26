import re


re1_str = '假名">【([/u2E80-/u9FFF]*)】<'
fp = open('../res/html_part.txt')
stotal = fp.readline()
for line in fp:
    s = fp.readline()
    stotal += s
print(stotal)
