import unittest
import process
import db


class FuriganaTestCase(unittest.TestCase):
    def setUp(self):
        db.connect()

    def tearDown(self):
        db.disconnect()

    def test_smoking(self):
        self.assertEqual(True, True)

    def test_check_exists_in_db(self):
        self.assertFalse(process.check_exists_in_db('just_a_english_word'))

    def test_search_word(self):
        process.search_word('寝ない')


if __name__ == '__main__':
    unittest.main()
