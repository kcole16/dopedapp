import datetime

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from settings import DATABASE_URL

application = Flask(__name__)
application.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

db = SQLAlchemy(application)
migrate = Migrate(application, db)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(60), unique=True)
    email = db.Column(db.String(120), unique=True)
    first_name = db.Column(db.String(120), unique=False)
    last_name = db.Column(db.String(120), unique=False)
    is_admin = db.Column(db.Boolean(), default=False)
    is_active = db.Column(db.Boolean(), default=True)
    type = db.Column(db.String(120), unique=False)
    happy_fox_id = db.Column(db.String(60), default=None)

    def __init__(self, address, email, first_name, last_name, type,
        is_admin=False, is_active=True, happy_fox_id=None):
        self.address = address
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.type = type
        self.is_admin = is_admin
        self.is_active = is_active
        self.happy_fox_id = happy_fox_id

    def __str__(self):
        return "User(id='%s')" % self.id


class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String(60), unique=False)
    provider_address = db.Column(db.String(60), unique=False)

    # [requested, accepted, in_negotiation, completed, paid, closed]
    status = db.Column(db.String(500), unique=False)

    price = db.Column(db.Float())
    date_due = db.Column(db.DateTime())
    date_created = db.Column(db.DateTime())
    text = db.Column(db.String(2000), unique=False)
    subject = db.Column(db.String(500), unique=False)
    happy_fox_id = db.Column(db.String(60), default=None, unique=False)
    claimed = db.Column(db.Boolean(), default=False)
    requested_price = db.Column(db.Float(), default=0)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User',
    #                        backref=db.backref('users', lazy='dynamic'))

    def __init__(self, user_address, provider_address, status, price, date_due, 
        date_created, text, subject, happy_fox_id=None, claimed=False, requested_price=0):
        self.user_address = user_address
        self.provider_address = provider_address
        self.status = status
        self.price = price
        self.date_due = date_due
        self.date_created = date_created
        self.text = text
        self.subject = subject
        self.happy_fox_id = happy_fox_id
        self.claimed = claimed
        self.requested_price = requested_price

    def __str__(self):
        return "Ticket(id='%s')" % self.id


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String(60), unique=False)
    title = db.Column(db.String(100), unique=False)
    content = db.Column(db.String(10000), unique=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'))
    ticket = db.relationship('Ticket',
                            backref=db.backref('tickets', lazy='dynamic'))

    def __init__(self, user_address, title, content, ticket):
        self.user_address = user_address
        self.title = title
        self.content = content
        self.ticket = ticket

    def __str__(self):
        return "Article(id='%s')" % self.id


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String(60), unique=False)
    text = db.Column(db.String(500), unique=False)
    article_id = db.Column(db.Integer())
    x_coord = db.Column(db.Integer())
    y_coord = db.Column(db.Integer())
    is_internal = db.Column(db.Boolean(), default=False)

    def __init__(self, user_address, text, article_id, x_coord, y_coord, is_internal=False):
        self.user_address = user_address
        self.text = text
        self.article_id = article_id
        self.x_coord = x_coord
        self.y_coord = y_coord
        self.is_internal = is_internal

    def __str__(self):
        return "Comment(id='%s')" % self.id
