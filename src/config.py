import os
import json


PROJECT_ROOT_PATH = f'{os.path.dirname(os.path.abspath(__file__))}/..'


def load_config():
    return json.loads(open(f'{PROJECT_ROOT_PATH}/mounted/config.json').read())
