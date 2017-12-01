from datetime import datetime

from flask import render_template, jsonify, request
from flask_cors import CORS
from whitenoise import WhiteNoise
from dateutil import parser
import requests

from models import application, db, Ticket, User, Article, Comment
from utils import search_kb, read_article, add_ticket, read_ticket, add_message
from settings import PRODUCTION, APP_SECRET, HAPPY_FOX_KEY, HAPPY_FOX_PASSWORD


application.debug = True
application.config['SECRET_KEY'] = APP_SECRET
db = db
cors = CORS(application)
static = WhiteNoise(application, root='../static/')


@application.route('/createUser', methods=['POST'])
def create_user():
    user_details = request.get_json()['user']
    user = User(user_details['address'], user_details['email'],
        user_details['firstName'], user_details['lastName'], user_details['type'])
    db.session.add(user)
    db.session.commit()
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/getUser', methods=['GET'])
def get_user():
    user_address = request.args.get('userAddress')
    raw_user = User.query.filter_by(address=user_address)[0]
    user = {
        'address': raw_user.address,
        'email': raw_user.email,
        'firstName': raw_user.first_name,
        'lastName': raw_user.last_name,
        'type': raw_user.type
    }
    response = jsonify({'user': user})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/createTicket', methods=['POST'])
def create_ticket():
    ticket_details = request.get_json()['ticket']
    date_due = parser.parse(ticket_details['dateDue'])
    user = User.query.filter_by(address=ticket_details['userAddress'])
    ticket = Ticket(user[0].address, None, 'requested',
        ticket_details['price'], date_due, datetime.now(), 
        ticket_details['text'], ticket_details['subject'])
    fox_ticket = add_ticket(ticket, user[0])
    ticket.happy_fox_id = fox_ticket['id']
    user.update(dict(happy_fox_id=fox_ticket['user']['id']))
    ticket_data = {}
    if fox_ticket:
        db.session.add(ticket)
        db.session.commit()

    # db.session.add(ticket)
    # db.session.commit()
    ticket_data = {
        'id': ticket.id,
        'subject': ticket.subject,
        'text': ticket.text,
        'price': ticket.price,
        'requestedPrice': ticket.requested_price,
        'status': ticket.status,
        'dateDue': ticket.date_due,
        'dateCreated': ticket.date_created,
        'userAddress': ticket.user_address
    }
    response = jsonify({'ticket': ticket_data})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/getTickets', methods=['GET'])
def get_tickets():
    user_address = request.args.get('userAddress')
    user = User.query.filter_by(address=user_address)[0]
    raw_tickets = Ticket.query.order_by(Ticket.date_created.desc()).all()
    tickets = []
    for t in raw_tickets:
        a = Article.query.filter_by(ticket_id=t.id)
        article = None
        if a.count() > 0:
            a = a[0]
            article = {
                'id': a.id,
                'title': a.title,
                'content': a.content
            }
        ticket = {
                    'id': t.id,
                    'subject': t.subject,
                    'text': t.text,
                    'price': t.price,
                    'requestedPrice': t.requested_price,
                    'status': t.status,
                    'dateDue': t.date_due,
                    'dateCreated': t.date_created,
                    'userAddress': t.user_address,
                    'providerAddress': t.provider_address,
                    'claimed': t.claimed,
                    'article': article
                }
        tickets.append(ticket)
    response = jsonify({'tickets': tickets})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/getResults', methods=['GET'])
def get_results():
    query = request.args.get('q')
    results = search_kb(query)
    response = jsonify({'results': results})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/getArticle', methods=['GET'])
def get_article():
    query = request.args.get('id')
    is_internal = False if request.args.get('isInternal') == 'false' else True
    if not is_internal:
        article = read_article(query)
    else:
        raw_article = Article.query.filter_by(id=query)[0]
        article = {
            'id': raw_article.id,
            'title': raw_article.title,
            'contents': raw_article.content
        }
    raw_comments = Comment.query.filter_by(article_id=article['id'], is_internal=is_internal)
    comments = []
    for c in raw_comments:
        user = User.query.filter_by(address=c.user_address)[0]
        comment = {
            'id': c.id,
            'text': c.text,
            'articleId': c.article_id,
            'xCoord': c.x_coord,
            'yCoord': c.y_coord,
            'user': {
                'address': user.address,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'email': user.email
            }
        }
        comments.append(comment)
    article['comments'] = comments
    article['isInternal'] = is_internal
    response = jsonify({'article': article})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/sendMessage', methods=['POST'])
def send_message():
    message = request.get_json()['message']
    ticket_id = request.get_json()['ticketId']
    user_address = request.get_json()['userAddress']
    ticket = Ticket.query.filter_by(id=ticket_id)
    user = User.query.filter_by(address=user_address)
    message = add_message(message, ticket[0], user[0])
    if message:
        response = jsonify({'success': True})
    else:
        response = jsonify({'success': False})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/getTicketDetail', methods=['GET'])
def get_ticket_detail():
    ticket_id = request.args.get('ticketId')
    ticket = Ticket.query.filter_by(id=ticket_id)[0]
    ticket_detail = read_ticket(ticket.happy_fox_id)
    response = jsonify({'ticket': ticket_detail})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/changeStatus', methods=['PATCH'])
def change_status():
    ticket_id = request.get_json()['id']
    status = request.get_json()['status']
    ticket = Ticket.query.filter_by(id=ticket_id)
    requested_price = ticket[0].requested_price
    ticket.update(dict(status=status))
    db.session.commit()
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/acceptIncrease', methods=['PATCH'])
def accept_increase():
    ticket_id = request.get_json()['id']
    increase = request.get_json()['increase']
    ticket = Ticket.query.filter_by(id=ticket_id)
    new_price = ticket[0].price + float(increase)
    ticket.update(dict(price=new_price))
    db.session.commit()
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/claimTicket', methods=['PATCH'])
def claim_ticket():
    ticket_id = request.get_json()['id']
    user_address = request.get_json()['userAddress']
    ticket = Ticket.query.filter_by(id=ticket_id)
    if ticket[0].status != 'claimed':
        ticket.update(dict(status='claimed',
        provider_address=user_address, claimed=True))
    else:
        ticket.update(dict(status='requested',
        provider_address=user_address, claimed=False))
    db.session.commit()
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/createArticle', methods=['POST'])
def create_article():
    content = request.get_json()['content']
    title = request.get_json()['title']
    ticket_id = request.get_json()['ticketId']
    user_address = request.get_json()['userAddress']
    if ticket_id:
        ticket = Ticket.query.filter_by(id=ticket_id)
        ticket.update(dict(status='completed'))
        ticket = ticket[0]
    else:
        ticket = Ticket(user_address, None, 'completed',
            0, datetime.now(), datetime.now(), 'text', title)
        db.session.add(ticket)
    article = Article(user_address, title, content, ticket)
    db.session.add(article)
    db.session.commit()
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@application.route('/createComment', methods=['POST'])
def create_comment():
    comment_data = request.get_json()['comment']
    comment = Comment(comment_data['userAddress'], comment_data['text'], comment_data['articleId'],
        comment_data['xCoord'], comment_data['yCoord'], comment_data['isInternal'])
    db.session.add(comment)
    db.session.commit()
    raw_comments = Comment.query.filter_by(article_id=comment.article_id)
    comments = [{
        'id': c.id,
        'text': c.text,
        'articleId': c.article_id,
        'xCoord': c.x_coord,
        'yCoord': c.y_coord
    } for c in raw_comments]
    response = jsonify({'comments': comments})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# @application.route('/requestIncrease', methods=['PATCH'])
# def request_increase():
#     ticket_id = request.get_json()['id']
#     requested_price = request.get_json()['price']
#     ticket = Ticket.query.filter_by(id=ticket_id).update(dict(status='in_negotiation',
#         requested_price=requested_price))
#     db.session.commit()
#     response = jsonify({'success': True})
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response


@application.route('/', methods=['GET'])
def app():
    return render_template('index.html');


if __name__ == "__main__":
    application.debug = True
    if PRODUCTION:
        application.debug = False
    application.run()
