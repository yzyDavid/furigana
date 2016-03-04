DEBUG = True
rep_dict = {}
searched_set = ([])

kanas = [
    "ん", "ン",
    "わ", "ワ", "ら", "ラ", "や", "ヤ", "ま", "マ", "は", "ハ",
    "な", "ナ", "た", "タ", "さ", "サ", "か", "カ", "あ", "ア",
    "ゐ", "ヰ", "り", "リ", "み", "ミ", "ひ", "ヒ", "に", "ニ",
    "ち", "チ", "し", "シ", "き", "キ", "い", "イ",
    "る", "ル", "ゆ", "ユ", "む", "ム", "ふ", "フ", "ぬ", "ヌ",
    "つ", "ツ", "す", "ス", "く", "ク", "う", "ウ",
    "ゑ", "ヱ", "れ", "レ", "め", "メ", "へ", "ヘ", "ね", "ネ",
    "て", "テ", "せ", "セ", "け", "ケ", "え", "エ",
    "を", "ヲ", "ろ", "ロ", "よ", "ヨ", "も", "モ", "ほ", "ホ",
    "の", "ノ", "と", "ト", "そ", "ソ", "こ", "コ", "お", "オ",
    "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ",
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ヴ", "ぁ", "ぃ", "ぅ", "ぇ",
    "ぉ", "ゃ", "ゅ", "ょ", "っ", "ガ", "ギ", "グ", "ゲ", "ゴ",
    "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド",
    "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ぺ", "ポ",
    "ゔ", "ァ", "ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ッ"
]

letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
]

splitch = [
    '\n', '/', '.', '(', ')', '\t', ' ',
    '。', '（', '）', '【', '】',
    '[', ']',
]
