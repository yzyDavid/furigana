# Project Furigana

This program could add Furigana(a kind of Japanese reading aid) to Japanese characters in brackets after the word. It uses data from dict.hjenglish.com.

### Requirements

To run this repository, these packages have to be available in python environment:

 - beautifulsoup4
 - pymysql
 - aiohttp

### TODO List

 - [ ] Refactor code
 - [ ] Parsing command line arguments
 - [ ] Optimze RegEx: every regex should only be compiled once.
 - [ ] Degermine whether the server returns `dangerous`
 - [ ] Deal with prefix spaces.
 - [ ] Merge the kanjic2j with the project
 - [ ] Figure out the package and import system

### Done list:
 - catch network IO error.
Implemented, only print an error message.

 - sort the dictionary by the length of key
Fixed. a dictionary can be traversed by length of key.

### bugs to fix

 - [x] disable single kana search
 - [x] detect the followed bracket
 - [ ] ignore space - further check needed
 - [ ] deal with form chagne
