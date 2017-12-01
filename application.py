from flask import render_template, jsonify, request
from flask_cors import CORS
from whitenoise import WhiteNoise
from dateutil import parser
import requests
from pymongo import MongoClient

from settings import PRODUCTION, APP_SECRET


application.debug = True
application.config['SECRET_KEY'] = APP_SECRET
db = db
cors = CORS(application)
static = WhiteNoise(application, root='../static/')


@application.route('/getPosts', methods=['GET'])
def get_posts():
    client = MongoClient('localhost', 27017)
    db = client.test_database
    db_posts = db.posts.find()
    posts = []
    for post in db_posts:
        del post['_id']
        posts.append(post)
    response = jsonify({'posts': posts})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/', methods=['GET'])
def app():
    return render_template('index.html');


if __name__ == "__main__":
    application.debug = True
    if PRODUCTION:
        application.debug = False
    application.run()
