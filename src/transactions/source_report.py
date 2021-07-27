import pandas as pd
import numpy as np
from io import StringIO


class SourceReport:

    def __init__(self, csv_path):
        self.csv_path = csv_path

    def parse_to_dataframe(self):
        csv = open(self.csv_path).read()
        lines = csv.split('\n')
        comma_line_index = np.where(np.array(lines) == ',')[0][0]
        transactions_lines = lines[:comma_line_index]
        headers = pd.read_csv(StringIO(transactions_lines[0]))
        transactions = pd.read_csv(StringIO('\n'.join(transactions_lines)), names=headers.columns)
        result = pd.DataFrame({
            'date': transactions['ДАТА'],
            'type': transactions['ТИП'],
            'source': transactions['СО СЧЁТА'],
            'target': transactions['НА СЧЁТ / НА КАТЕГОРИЮ'],
            'amount': transactions['СУММА'],
            'currency': transactions['ВАЛЮТА'],
            'notes': transactions['ЗАМЕТКИ']
        })

        return result
