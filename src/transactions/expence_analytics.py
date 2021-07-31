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

    def previous_month_summary(self):
        return ExpenseAggregation(self.__previous_month_df()).summary()

    def period_summary(self, date_from, date_to):
        date_from = pendulum.from_format(date_from, 'YYYY-MM-DD')
        date_to = pendulum.from_format(date_to, 'YYYY-MM-DD')
        return ExpenseAggregation(self.__period_df(date_from, date_to)).summary()

    def __period_df(self, date_from, date_to):
        return self.__df()[
            (self.__df()['date'] >= date_from.start_of('day')) &
            (self.__df()['date'] <= date_to.start_of('day'))
        ]

    def __last_month_df(self):
        return self.__period_df(pendulum.now().start_of('month'), pendulum.now())

    def __previous_month_df(self):
        return self.__period_df(
            pendulum.now().subtract(months=1).start_of('month'),
            pendulum.now().subtract(months=1).end_of('month')
        )

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
