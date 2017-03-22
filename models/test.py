import unittest
import pickle
from searcher import Searcher
from inverted_index import InvertedIndex
from data_source import DataSource


class TestDataSource(unittest.TestCase):
    def setUp(self):
        self.books_file = 'test_data/test_cooking_books.tsv'
        self.book_id = 'B000S1L8ZW'
        self.book_title = 'Cowgirl Cuisine: Rustic Recipes and Cowgirl Adventures from a Texas Ranch'

    def test_read_file(self):
        data_source = DataSource(self.books_file)
        for id, title in data_source.read_file():
            self.assertEqual(id, self.book_id)
            self.assertEqual(title, self.book_title)
            break


class TestInvertedIndex(unittest.TestCase):
    def setUp(self):
        self.index_file = 'test_data/test_inverted_index'
        self.books_file = 'test_data/test_cooking_books.tsv'
        self.keyword = 'deceptively'

    def test_get_index_data(self):
        data_source = DataSource(self.books_file)
        inverted_index = InvertedIndex(self.index_file)
        inverted_index.get_inverted_index(data_source.read_file())
        with open(inverted_index.file_name, 'r') as f:
            keywords_dict = pickle.load(f)
        self.assertEqual(keywords_dict[self.keyword], ['B000UZNREG'])


class TestSearcher(unittest.TestCase):
    def setUp(self):
        self.index_file = 'test_data/test_inverted_index'
        self.books_file = 'test_data/test_cooking_books.tsv'
        self.query = 'good food'

    def test_search(self):
        inverted_index = InvertedIndex(self.index_file)
        data_source = DataSource(self.books_file)
        searcher = Searcher(data_source, inverted_index)
        search_results = searcher.search(self.query)
        self.assertEqual(search_results, [(
            'B000UZNREG', 'Deceptively Delicious: Simple Secrets to Get Your Kids Eating Good Food', 2),
            ('B00N2A6HLG', 'Good and Cheap: Eat Well on $4/Day', 1),
            ('B00BATL11W',"The Southerner's Handbook: A Guide to Living the Good Life", 1)])


if __name__ == '__main__':
    unittest.main()