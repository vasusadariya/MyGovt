import cv2
import pickle
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import os

class FaceRecognition:
    def __init__(self):
        self.facedetect = cv2.CascadeClassifier("haar_cascades/haarcascade_frontalface_default.xml")
        self.knn = self.load_model()

    def load_model(self):
        try:
            with open('data/names.pkl', 'rb') as f:
                self.LABELS = pickle.load(f)
            with open('data/faces.pkl', 'rb') as f:
                FACES = pickle.load(f)
            knn = KNeighborsClassifier(n_neighbors=5)
            knn.fit(FACES, self.LABELS)
            return knn
        except FileNotFoundError:
            return None

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.facedetect.detectMultiScale(gray, 1.3, 5)
        return faces, gray

    def register_face(self, frame, aadhar_no):
        faces, gray = self.process_frame(frame)
        face_data = []
        
        for (x, y, w, h) in faces:
            crop_img = frame[y:y+h, x:x+w]
            resize_img = cv2.resize(crop_img, (50, 50))
            face_data.append(resize_img.flatten())
            
        return np.array(face_data)

    def verify_face(self, frame):
        faces, gray = self.process_frame(frame)
        if len(faces) == 0:
            return None
            
        for (x, y, w, h) in faces:
            crop_img = frame[y:y+h, x:x+w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
            if self.knn is not None:
                return self.knn.predict(resized_img)[0]
        return None