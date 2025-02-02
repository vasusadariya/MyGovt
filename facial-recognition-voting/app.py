import streamlit as st
import cv2
import numpy as np
from api.face_recognition import FaceRecognition
from api.database import Database
import pickle
import os

# Initialize face recognition and database
face_recognition = FaceRecognition()
db = Database()

def initialize_data_directories():
    
    if not os.path.exists('data'):
        os.makedirs('data')
    if not os.path.exists('haar_cascades'):
        os.makedirs('haar_cascades')
        # You'll need to download the haar cascade file and place it in this directory

def save_face_data(aadhar_no, face_data):
    if 'names.pkl' not in os.listdir('data/'):
        names = [aadhar_no] * len(face_data)
        with open('data/names.pkl', 'wb') as f:
            pickle.dump(names, f)
    else:
        with open('data/names.pkl', 'rb') as f:
            names = pickle.load(f)
        names = names + [aadhar_no] * len(face_data)
        with open('data/names.pkl', 'wb') as f:
            pickle.dump(names, f)

    if 'faces.pkl' not in os.listdir('data/'):
        with open('data/faces.pkl', 'wb') as f:
            pickle.dump(face_data, f)
    else:
        with open('data/faces.pkl', 'rb') as f:
            faces = pickle.load(f)
        faces = np.append(faces, face_data, axis=0)
        with open('data/faces.pkl', 'wb') as f:
            pickle.dump(faces, f)

def main():
    st.title("Facial Recognition Voting System")
    initialize_data_directories()

    # Sidebar navigation
    page = st.sidebar.selectbox("Choose a page", ["Voter Registration", "Voting"])

    if page == "Voter Registration":
        st.header("Voter Registration")
        aadhar_no = st.text_input("Enter Aadhar Number")
        
        if st.button("Start Registration"):
            frames = []
            face_data = []
            progress_bar = st.progress(0)
            frame_placeholder = st.empty()
            
            cap = cv2.VideoCapture(0)
            
            for i in range(100):
                ret, frame = cap.read()
                if ret:
                    frames.append(frame)
                    processed_face = face_recognition.register_face(frame, aadhar_no)
                    if len(processed_face) > 0:
                        face_data.extend(processed_face)
                    
                    # Display progress
                    frame_placeholder.image(frame, channels="BGR")
                    progress_bar.progress((i + 1) / 100)
            
            cap.release()
            
            if len(face_data) >= 51:
                face_data = np.array(face_data[:51])
                save_face_data(aadhar_no, face_data)
                db.register_voter(aadhar_no, face_data)
                st.success("Registration successful!")
            else:
                st.error("Not enough valid face frames captured. Please try again.")

    elif page == "Voting":
        st.header("Voting")
        vote_choice = st.selectbox("Select your vote", 
                                 ["", "BJP", "CONGRESS", "AAP", "NOTA"])
        
        if st.button("Start Voting"):
            frame_placeholder = st.empty()
            cap = cv2.VideoCapture(0)
            
            ret, frame = cap.read()
            if ret:
                frame_placeholder.image(frame, channels="BGR")
                voter_id = face_recognition.verify_face(frame)
                
                if voter_id:
                    if not db.check_voter(voter_id):
                        if vote_choice:
                            db.record_vote(voter_id, vote_choice)
                            st.success("Vote recorded successfully!")
                        else:
                            st.warning("Please select your vote")
                    else:
                        st.error("You have already voted!")
                else:
                    st.error("Face not recognized or no face detected")
            
            cap.release()

if __name__ == "__main__":
    main()

