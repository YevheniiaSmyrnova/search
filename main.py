import argparse

from settings import INVERTED_INDEX_FILE, COOKING_BOOKS_FILE
from models.searcher import Searcher
from models.inverted_index import InvertedIndex
from models.data_source import DataSource


def main(query):
    data_source = DataSource(COOKING_BOOKS_FILE)
    inverted_index = InvertedIndex(INVERTED_INDEX_FILE)
    result = Searcher(data_source, inverted_index).search(query)
    for id, title, score in result:
        print id, title, score


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    args = parser.parse_args()
    main(args.query)
