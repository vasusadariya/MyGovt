from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017'))
        self.db = self.client['voting_system']
        self.voters = self.db['voters']
        self.votes = self.db['votes']

    def register_voter(self, aadhar_no, face_data):
        return self.voters.insert_one({
            "aadhar_no": aadhar_no,
            "face_data": face_data.tolist(),
            "registration_date": datetime.now()
        })

    def check_voter(self, voter_id):
        return self.votes.find_one({"voter_id": voter_id})

    def record_vote(self, voter_id, vote_choice):
        return self.votes.insert_one({
            "voter_id": voter_id,
            "vote": vote_choice,
            "timestamp": datetime.now()
        })
