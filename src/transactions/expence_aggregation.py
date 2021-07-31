class ExpenseAggregation:

    def __init__(self, df):
        self.__df = df

    def summary(self):
        categories = []
        for category, category_df in self.__df.groupby('category'):
            subcategories = []
            for sub, sub_df in category_df.groupby('subcategory'):
                subcategories.append({'name': sub, 'amount': f"{sub_df['amount'].sum():.02f}"})
            subcategories = sorted(subcategories, key=lambda x: -float(x['amount']))
            categories.append({
                'name': category,
                'subcategories': subcategories,
                'amount': f"{category_df['amount'].sum():.02f}"
            })
        return {'categories': sorted(categories, key=lambda x: -float(x['amount']))}
