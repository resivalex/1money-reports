import re
import pendulum
from functools import lru_cache
from .expence_aggregation import ExpenseAggregation


NIL_SUBCATEGORY = '-'


def _split_target(s):
    matches = re.match(r'^(.+) \((.+)\)$', s)
    if matches is None:
        return [s, NIL_SUBCATEGORY]

    return [matches[1], matches[2]]


class ExpenseAnalytics:

    def __init__(self, expenses):
        self.___expenses = expenses

    def last_month_summary(self):
        return ExpenseAggregation(self.__last_month_df()).summary()

    def __last_month_df(self):
        return self.__df()[self.__df()['date'] >= pendulum.now().start_of('month')]

    @lru_cache()
    def __df(self):
        df = self.___expenses.copy()
        categories = []
        subcategories = []
        for target in df['target']:
            cat, subcat = _split_target(target)
            categories.append(cat)
            subcategories.append(subcat)
        df.drop('target', axis=1, inplace=True)
        df['category'] = categories
        df['subcategory'] = subcategories

        return df
