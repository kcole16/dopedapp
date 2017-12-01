import json
import os
from pymongo import MongoClient
from web3 import Web3, HTTPProvider, TestRPCProvider
import time

def write_post(posts):
    client = MongoClient('localhost', 27017)
    db = client.test_database
    db_posts = db.posts
    for post in posts:
        post_id = db_posts.insert_one(post).inserted_id
        print(post_id)

w3 = Web3(HTTPProvider('http://localhost:8545'))
abi = json.loads(open(os.getcwd()+'/build/contracts/Post.json','r').read())['abi']
contract_instance = w3.eth.contract(abi, '0xde2102acfd07a93afb99b95c16d1b80bfe3d58e4')
transfer_filter = contract_instance.on('PostCreated')
while True:
    time.sleep(5)
    posts = transfer_filter.get()
    write_post(posts)

# for post in posts:
#     post_id = db_posts.insert_one(post).inserted_id
#     print(post_id)
