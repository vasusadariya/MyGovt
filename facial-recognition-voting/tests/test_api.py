# # tests/test_api.py
# import pickle
# import unittest
# import cv2
# import numpy as np
# import os
# import sys
# import shutil
# from pathlib import Path

# # Add parent directory to path to import api modules
# sys.path.append(str(Path(__file__).parent.parent))

# from api.face_recognition import FaceRecognition
# from api.database import Database

# class TestFaceRecognitionAPI(unittest.TestCase):
#     @classmethod
#     def setUpClass(cls):
#         """Set up test environment before all tests"""
#         # Create test directories
#         os.makedirs('data', exist_ok=True)
#         os.makedirs('haar_cascades', exist_ok=True)
        
#         # Download haar cascade if not exists
#         cascade_path = 'haar_cascades/haarcascade_frontalface_default.xml'
#         if not os.path.exists(cascade_path):
#             import urllib.request
#             url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
#             urllib.request.urlretrieve(url, cascade_path)
        
#         cls.face_recognition = FaceRecognition()
#         cls.db = Database()
        
#         # Create test image with a face
#         cls.test_image = np.zeros((480, 640, 3), dtype=np.uint8)
#         # Draw a simple face-like shape
#         cv2.circle(cls.test_image, (320, 240), 100, (255, 255, 255), -1)
#         cv2.circle(cls.test_image, (280, 200), 20, (0, 0, 0), -1)  # Left eye
#         cv2.circle(cls.test_image, (360, 200), 20, (0, 0, 0), -1)  # Right eye
#         cv2.ellipse(cls.test_image, (320, 280), (60, 30), 0, 0, 180, (0, 0, 0), -1)  # Mouth

#     def tearDown(self):
#         """Clean up after each test"""
#         # Remove test data files
#         if os.path.exists('data/faces.pkl'):
#             os.remove('data/faces.pkl')
#         if os.path.exists('data/names.pkl'):
#             os.remove('data/names.pkl')

#     def test_face_detection(self):
#         """Test if face detection works"""
#         faces, _ = self.face_recognition.process_frame(self.test_image)
#         self.assertGreater(len(faces), 0, "No face detected in test image")

#     def test_face_registration(self):
#         """Test face registration process"""
#         test_aadhar = "123456789012"
#         face_data = self.face_recognition.register_face(self.test_image, test_aadhar)
#         self.assertIsNotNone(face_data)
#         self.assertTrue(isinstance(face_data, np.ndarray))
#         self.assertGreater(len(face_data), 0)

#     def test_face_verification(self):
#         """Test face verification process"""
#         # First register a face
#         test_aadhar = "123456789012"
#         face_data = self.face_recognition.register_face(self.test_image, test_aadhar)
        
#         # Save to pickle files
#         with open('data/names.pkl', 'wb') as f:
#             pickle.dump([test_aadhar], f)
#         with open('data/faces.pkl', 'wb') as f:
#             pickle.dump(face_data, f)
            
#         # Reload the model
#         self.face_recognition = FaceRecognition()
        
#         # Test verification
#         verified_id = self.face_recognition.verify_face(self.test_image)
#         self.assertIsNotNone(verified_id)
#         self.assertEqual(verified_id, test_aadhar)

#     def test_database_operations(self):
#         """Test database operations"""
#         test_aadhar = "123456789012"
#         test_vote = "BJP"
        
#         # Test voter registration
#         face_data = np.random.rand(51, 2500)  # Simulated face data
#         result = self.db.register_voter(test_aadhar, face_data)
#         self.assertIsNotNone(result.inserted_id)
        
#         # Test vote recording
#         vote_result = self.db.record_vote(test_aadhar, test_vote)
#         self.assertIsNotNone(vote_result.inserted_id)
        
#         # Test duplicate voter check
#         voter_exists = self.db.check_voter(test_aadhar)
#         self.assertIsNotNone(voter_exists)

# def create_test_image_sequence():
#     """Helper function to create test image sequence"""
#     images = []
#     for i in range(51):
#         img = np.zeros((480, 640, 3), dtype=np.uint8)
#         # Draw a simple face-like shape with slight variations
#         cv2.circle(img, (320, 240), 100, (255, 255, 255), -1)
#         cv2.circle(img, (280 + i, 200), 20, (0, 0, 0), -1)  # Moving left eye
#         cv2.circle(img, (360 + i, 200), 20, (0, 0, 0), -1)  # Moving right eye
#         cv2.ellipse(img, (320, 280), (60, 30), 0, 0, 180, (0, 0, 0), -1)
#         images.append(img)
#     return images

# class TestStreamlitApp(unittest.TestCase):
#     def setUp(self):
#         """Set up test environment"""
#         self.test_images = create_test_image_sequence()
#         self.test_aadhar = "123456789012"

#     def test_registration_workflow(self):
#         """Test complete registration workflow"""
#         from app import save_face_data
        
#         # Process test images
#         face_recognition = FaceRecognition()
#         face_data = []
        
#         for img in self.test_images:
#             processed_face = face_recognition.register_face(img, self.test_aadhar)
#             if len(processed_face) > 0:
#                 face_data.extend(processed_face)
        
#         face_data = np.array(face_data[:51])
        
#         # Test saving face data
#         save_face_data(self.test_aadhar, face_data)
        
#         # Verify files were created
#         self.assertTrue(os.path.exists('data/faces.pkl'))
#         self.assertTrue(os.path.exists('data/names.pkl'))
        
#         # Test loading saved data
#         with open('data/names.pkl', 'rb') as f:
#             names = pickle.load(f)
#         self.assertIn(self.test_aadhar, names)

#     def test_voting_workflow(self):
#         """Test complete voting workflow"""
#         # First register a voter
#         self.test_registration_workflow()
        
#         # Test voting process
#         face_recognition = FaceRecognition()
#         db = Database()
        
#         # Verify face
#         voter_id = face_recognition.verify_face(self.test_images[0])
#         self.assertIsNotNone(voter_id)
        
#         # Record vote
#         vote_choice = "BJP"
#         vote_result = db.record_vote(voter_id, vote_choice)
#         self.assertIsNotNone(vote_result.inserted_id)
        
#         # Try voting again (should be prevented)
#         duplicate_check = db.check_voter(voter_id)
#         self.assertIsNotNone(duplicate_check)

# if __name__ == '__main__':
#     unittest.main()