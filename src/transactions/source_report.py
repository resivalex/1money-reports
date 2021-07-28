import pandas as pd
import numpy as np
from io import StringIO
from decimal import Decimal
import pendulum


def _convert_to_decimal(s):
    return Decimal(s)


def _convert_to_date(s):
    return pendulum.from_format(s, 'DD.MM.YYYY')


class SourceReport:

    def __init__(self, csv_path):
        self.csv_path = csv_path

    def parse_to_dataframe(self):
        csv = open(self.csv_path).read()
        lines = csv.split('\n')
        comma_line_index = np.where(np.array(lines) == ',')[0][0]
        transactions_lines = lines[:comma_line_index]
        headers = pd.read_csv(StringIO(transactions_lines[0]))
        transactions = pd.read_csv(
            StringIO('\n'.join(transactions_lines[1:])),
            names=headers.columns,
            converters={
                'СУММА': _convert_to_decimal
            },
            dtype={'ДАТА': 'O'}
        )
        result = pd.DataFrame({
            'date': pd.Series([_convert_to_date(s) for s in transactions['ДАТА']], dtype='O'),
            'type': transactions['ТИП'].replace({'Расход': 'expense', 'Перевод': 'transfer', 'Доход': 'income'}),
            'source': transactions['СО СЧЁТА'],
            'target': transactions['НА СЧЁТ / НА КАТЕГОРИЮ'],
            'amount': transactions['СУММА'],
            'notes': transactions['ЗАМЕТКИ'].fillna('')
        })
        if transactions['ВАЛЮТА'].unique() != ['RUB']:
            raise Exception('Only RUB is allowed')
        if set(transactions['ТИП']) != {'Расход', 'Перевод', 'Доход'}:
            unknown_types = {'Расход', 'Перевод', 'Доход'} - set(transactions['ТИП'])
            raise Exception(f"Unsupported types: {unknown_types}")

        return result
