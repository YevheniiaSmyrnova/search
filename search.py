from flask import Flask
import json
from flask import render_template
from flask import request

app = Flask(__name__)


from settings import INVERTED_INDEX_FILE, COOKING_BOOKS_FILE
from models.searcher import Searcher
from models.inverted_index import InvertedIndex
from models.data_source import DataSource


def main(query):
    data_source = DataSource(COOKING_BOOKS_FILE)
    inverted_index = InvertedIndex(INVERTED_INDEX_FILE)
    result = Searcher(data_source, inverted_index).search(query)
    resp = []
    for id, title, score in result:
        resp.append({'id': id, 'title': title, 'score': score})
    return resp


@app.route('/books', methods=['GET', 'POST'])
def api_echo():
    if request.method == 'GET':
        data_source = DataSource(COOKING_BOOKS_FILE)
        data_source = data_source.read_file()
        content = []
        for data in data_source:
            content.append({'id': data[0],
                            'title': data[1]})
        return json.dumps(content)

    elif request.method == 'POST':
        try:
            content = request.get_json()
            print content['query']
        # main(content['query'])
        except:
            return json.dumps({'result': 'bad'})
        return json.dumps(main(content['query']))


if __name__ == "__main__":
    app.run()
