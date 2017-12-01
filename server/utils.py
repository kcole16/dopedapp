import base64

import requests

from settings import HAPPY_FOX_KEY, HAPPY_FOX_PASSWORD

key_base = HAPPY_FOX_KEY+':'+HAPPY_FOX_PASSWORD
auth_key = base64.b64encode(key_base.encode()).decode('utf8')

headers = {'Authorization': 'Basic %s' % auth_key}


def search_kb(q):
    url = 'https://consensyssupport.happyfox.com/api/1.1/json/kb/search/?q=%s' % q
    r = requests.get(url, headers=headers)
    if r.ok:
        results = r.json()
    else:
        results = []
    return results


def read_article(id):
    url = 'https://consensyssupport.happyfox.com/api/1.1/json/kb/article/%s' % id
    r = requests.get(url, headers=headers)
    if r.ok:
        results = r.json()
    else:
        results = None
    return results


def read_ticket(id):
    url = 'https://consensyssupport.happyfox.com/api/1.1/json/ticket/%s/' % id
    r = requests.get(url, headers=headers)
    if r.ok:
        results = r.json()
    else:
        results = None
    return results


def add_ticket(ticket, user):
    url = 'https://consensyssupport.happyfox.com/api/1.1/json/tickets/'
    data = {
        'assignee': 10,
        'subject': ticket.subject,
        'text': ticket.text,
        'category': 4,
        'priority': 4,
        'email': user.email,
        'name': user.first_name+' '+user.last_name
    }
    r = requests.post(url, data=data, headers=headers)
    if r.ok:
        results = r.json()
    else:
        results = None
    return results


def add_message(message, ticket, user):
    if user.type == 'user':
        print("Hello")
        url = 'https://consensyssupport.happyfox.com/api/1.1/json/ticket/%s/user_reply/' % ticket.happy_fox_id
        data = {
            'user': user.happy_fox_id,
            'client': user.happy_fox_id,
            'text': message
        }
    elif user.type == 'provider':
        url = 'https://consensyssupport.happyfox.com/api/1.1/json/ticket/%s/staff_update/' % ticket.happy_fox_id
        data = {
            'staff': 10,
            'notify_user': 1,
            'text': message
        }
    r = requests.post(url, data=data, headers=headers)
    if r.ok:
        results = r.json()
        print(results)
    else:
        print(r.status_code)
        results = None
    return results
