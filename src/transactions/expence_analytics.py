import re
import pendulum


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
        result = []
        for category, category_df in self.__last_month_df().groupby('category'):
            result.append({'category': category, 'amount': f"{category_df['amount'].sum():.02f}"})
        result = sorted(result, key=lambda x: -float(x['amount']))
        return result

    def __last_month_df(self):
        return self.__df()[self.__df()['date'] >= pendulum.now().start_of('month')]

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
