# # tests/conftest.py
# import pytest
# import mongomock
# import os
# from dotenv import load_dotenv

# @pytest.fixture(autouse=True)
# def mock_db_connection(monkeypatch):
#     """Create a mock MongoDB client for testing"""
#     def mock_init(self):
#         self.client = mongomock.MongoClient()
#         self.db = self.client['test_db']
#         self.voters = self.db['voters']
#         self.votes = self.db['votes']
    
#     monkeypatch.setattr("api.database.Database.__init__", mock_init)

# @pytest.fixture(autouse=True)
# def env_setup():
#     """Set up test environment variables"""
#     os.environ['MONGO_URI'] = 'mongodb://testdb:27017'
#     os.environ['TESTING'] = 'True'