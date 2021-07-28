from .source_report import SourceReport
from config import PROJECT_ROOT_PATH


def test_loading():
    source_report = SourceReport(f'{PROJECT_ROOT_PATH}/src/transactions/files/report.csv')

    df = source_report.parse_to_dataframe()
    assert df.columns.tolist() == ['date', 'type', 'source', 'target', 'amount', 'currency', 'notes']
    assert df.shape[0] == 2
    assert list(df.iloc[0].values) == ['24.07.2021', 'Расход', 'Карта', 'Продукты (Супермаркет)', 359.67, 'RUB', '']
    assert list(df.iloc[1].values) == ['23.07.2021', 'Расход', 'Карта', 'Продукты (Супермаркет)', 297.93, 'RUB', '']
