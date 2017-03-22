import pickle
import re


class Searcher(object):
    '''
    Input: query - string with keywords
    Output: matched titles (ID, matched title, score)
    '''
    def __init__(self, data_source, inverted_index):
        self.data_source = data_source
        self.inverted_index = inverted_index
        self.inverted_index.get_inverted_index(data_source.read_file())

    def search(self, query):
        query_set = set(re.findall(r'\w+\'?\w*', query.lower()))
        with open(self.inverted_index.file_name, 'r') as f:
            keywords_dict = pickle.load(f)
        dict_id_with_keywords = {}
        for keyword in query_set:
            for id in keywords_dict[keyword]:
                if id in dict_id_with_keywords:
                    dict_id_with_keywords[id].append(keyword)
                else:
                    dict_id_with_keywords[id] = [keyword]
        result = []
        for id in dict_id_with_keywords.keys():
            for id_data, title_data in self.data_source.read_file():
                if id == id_data:
                    title = title_data
            result.append((id, title, len(dict_id_with_keywords[id])))
        result.sort(key=lambda tup: tup[2], reverse=True)
        return result
