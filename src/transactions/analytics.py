from .source_report import SourceReport
from .expence_analytics import ExpenseAnalytics
from functools import lru_cache


class Analytics:

    def __init__(self, csv_path):
        self.source_report = SourceReport(csv_path)

    def sample_record(self):
        row = self.__df().sample(1).iloc[0]
        return {
            'date': row['date'].to_date_string(),
            'type': row['type'],
            'source': row['source'],
            'target': row['target'],
            'amount': f"{row['amount']:.02f}",
            'notes': row['notes']
        }

    def last_month_summary(self):
        return self.expense_analytics().last_month_summary()

    def expense_analytics(self):
        return ExpenseAnalytics(self.__df()[self.__df()['type'] == 'expense'])

    @lru_cache()
    def __df(self):
        return self.source_report.parse_to_dataframe()
