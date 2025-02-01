"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

interface Complaint {
  complaintType: string;
  date: string;
  area: string;
  description: string;
  name: string;
  contact: string;
  status: "Pending" | "Resolved";
  resolveTimestamp?: number; // Timestamp for when the complaint was resolved
  rating?: number; // Rating given by the user
}

const Inbox: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [rating, setRating] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(storedComplaints);
  }, []);

  const handleRatingChange = (index: number, newRating: number) => {
    const updatedComplaints = complaints.map((complaint, i) => {
      if (i === index) {
        return { ...complaint, rating: newRating };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
    setRating((prev) => ({ ...prev, [index]: newRating }));
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold text-center my-4">Inbox</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {complaints.length > 0 ? (
          complaints.map((complaint, index) => (
            <div
              key={index}
              className={`shadow-lg p-4 rounded-lg ${complaint.status === "Resolved" ? "bg-green-200" : "bg-white"}`}
            >
              <h2 className="text-lg font-bold">{complaint.complaintType}</h2>
              <p><strong>Date:</strong> {complaint.date}</p>
              <p><strong>Area:</strong> {complaint.area}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Reported by:</strong> {complaint.name}</p>
              <p><strong>Contact:</strong> {complaint.contact}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              {complaint.status === "Resolved" && (
                <div className="mt-4">
                  <p>Rate the resolution:</p>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(index, star)}
                      className={`mx-1 ${complaint.rating === star ? "text-yellow-500" : "text-gray-400"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No complaints submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;