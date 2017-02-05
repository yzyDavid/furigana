import unittest
import process
import db


class FuriganaTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_smoking(self):
        self.assertEqual(True, True)

    def test_check_exists_in_db(self):
        self.assertFalse(process.is_exists_in_db('just_a_english_word'))

    def test_search_word(self):
        self.assertEqual(process.search_word('寝ない'), '寝(ね)ない')

    def test_is_kanji_exists(self):
        self.assertFalse(process.is_kanji_exists('かな'))
        self.assertTrue(process.is_kanji_exists('仮名'))

    def test_search_word_in_text(self):
        self.assertEqual(True, True)
        process.search_word_in_text('just_a_english_sentence')
        with open('test_text.txt', mode='r') as file:
            for line in file:
                process.search_word_in_text(line)


if __name__ == '__main__':
    unittest.main()
