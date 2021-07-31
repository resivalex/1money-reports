from flask import Flask, request, make_response, send_from_directory
from config import load_config, PROJECT_ROOT_PATH
import os
from functools import lru_cache
import traceback
import simplejson
from transactions import Analytics


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


def get_analytics():
    return Analytics(csv_path=config()['data_path'])


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

    return success_response(get_analytics().sample_record())


@app.route('/last_month_summary', methods=['GET'])
def last_month_summary():
    check_authorization()

    return success_response(get_analytics().last_month_summary())


@app.route('/previous_month_summary', methods=['GET'])
def previous_month_summary():
    check_authorization()

    return success_response(get_analytics().previous_month_summary())


@app.route('/period_summary', methods=['GET'])
def period_summary():
    check_authorization()

    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    return success_response(get_analytics().period_summary(date_from, date_to))


@app.route('/static/<path:path>', methods=['GET'])
def serve_static(path):
    return send_from_directory(f'{PROJECT_ROOT_PATH}/web/build/static', path)


@app.route('/', methods=['GET'])
def index():
    resp = make_response(open(f'{PROJECT_ROOT_PATH}/web/build/index.html').read(), 200)
    resp.headers['Content-Type'] = 'text/html'
    return resp


app.run(host='0.0.0.0', port=80)
