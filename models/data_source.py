class DataSource(object):
    '''
    Open file and return pairs id and title
    '''
    def __init__(self, file_name):
        self.file_name = file_name

    def read_file(self):
        with open(self.file_name, 'r') as text:
            for line in text.readlines():
                yield tuple(line.split("\t")[0:2])
