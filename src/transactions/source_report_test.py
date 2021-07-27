from .source_report import SourceReport
from config import PROJECT_ROOT_PATH


def test_loading():
    source_report = SourceReport(f'{PROJECT_ROOT_PATH}/src/transactions/files/report.csv')

    df = source_report.parse_to_dataframe()
    assert df.columns.tolist() == ['date', 'type', 'source', 'target', 'amount', 'currency', 'notes']
