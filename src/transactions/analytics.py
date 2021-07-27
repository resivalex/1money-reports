from .source_report import SourceReport
from functools import lru_cache


class Analytics:

    def __init__(self, csv_path):
        self.source_report = SourceReport(csv_path)

    def sample_record(self):
        return dict(self.df().sample(1).iloc[0])

    @lru_cache()
    def df(self):
        return self.source_report.parse_to_dataframe()
