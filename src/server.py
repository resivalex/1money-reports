from flask import Flask, request, make_response, send_from_directory
from config import load_config, PROJECT_ROOT_PATH
import os
from functools import lru_cache
import pandas as pd
import numpy as np
from io import StringIO
import traceback
import simplejson


@lru_cache()
def config():
    return load_config()


@lru_cache()
def auth_token():
    return load_config()['auth_token']


@lru_cache()
def debug():
    return os.getenv('FLASK_ENV') == 'development'


os.environ['PYTHONIOENCODING'] = 'UTF-8'


app = Flask(__name__, static_url_path='')


class UnauthorizedError(Exception):
    pass


def check_authorization():
    if 'X-Auth-Token' in request.headers:
        token = request.headers['X-Auth-Token']
    else:
        token = request.args.get('token', '')

    if token != auth_token():
        raise UnauthorizedError()


def json_response(body):
    response = make_response(generate_json(body), 200)
    response.headers['Content-Type'] = 'application/json'
    return response


def success_response(data):
    return json_response({'status': 'success', 'data': data})


def fail_response(data):
    return json_response({'status': 'fail', 'data': data})


def error_response(message):
    return json_response({'status': 'error', 'message': message})


@app.errorhandler(UnauthorizedError)
def handle_exception(_):
    return fail_response({'code': 'unauthorized', 'message': 'Set "X-Auth-Token" header or "token" parameter'})


@app.errorhandler(Exception)
def handle_exception(exception):
    if debug():
        print(exception)
        traceback.print_tb(exception.__traceback__)
    return error_response(str(exception))


def generate_json(value):
    return simplejson.dumps(value, indent=2, ensure_ascii=False, ignore_nan=True).encode('utf8')


@app.route('/info', methods=['GET'])
def info():
    check_authorization()

    return success_response({'info': 'Hello!'})


@app.route('/sample_record', methods=['GET'])
def sample_record():
    check_authorization()

    csv = open(config()['data_path']).read()
    lines = csv.split('\n')
    comma_line_index = np.where(np.array(lines) == ',')[0][0]
    transactions_lines = lines[:comma_line_index]
    headers = pd.read_csv(StringIO(transactions_lines[0])).columns
    df = pd.read_csv(StringIO('\n'.join(transactions_lines)), names=headers)

    return success_response(dict(df.sample(1).iloc[0]))


@app.route('/static/<path:path>', methods=['GET'])
def serve_static(path):
    return send_from_directory(f'{PROJECT_ROOT_PATH}/web/build/static', path)


@app.route('/', methods=['GET'])
def index():
    resp = make_response(open(f'{PROJECT_ROOT_PATH}/web/build/index.html').read(), 200)
    resp.headers['Content-Type'] = 'text/html'
    return resp


app.run(host='0.0.0.0', port=80)
