import pickle
import re


class InvertedIndex(object):
    '''
    Make dict with keyword and books id
    and save it in the file inverted_index
    '''
    def __init__(self, file_name):
        self.file_name = file_name

    def get_inverted_index(self, data_source):
        keywords_dict = {}
        for id, title in data_source:
            keywords = set(re.findall(r'\w+\'?\w*', title.lower()))
            for word in keywords:
                if word in keywords_dict:
                    keywords_dict[word].append(id)
                else:
                    keywords_dict[word] = [id]
        with open(self.file_name, 'wb') as f:
            pickle.dump(keywords_dict, f)