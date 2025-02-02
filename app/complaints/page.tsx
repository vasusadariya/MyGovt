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

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(storedComplaints);

    // Check and remove resolved complaints that are older than one day
    const updatedComplaints = storedComplaints.filter((complaint: Complaint) => {
      if (complaint.status === "Resolved" && complaint.resolveTimestamp) {
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const now = new Date().getTime();
        return now - complaint.resolveTimestamp < oneDay;
      }
      return true;
    });

    if (updatedComplaints.length !== storedComplaints.length) {
      setComplaints(updatedComplaints);
      localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
    }
  }, []);

  const updateComplaintStatus = (index: number, newStatus: "Pending" | "Resolved") => {
    const updatedComplaints = complaints.map((complaint, i) => {
      if (i === index) {
        return { ...complaint, status: newStatus, resolveTimestamp: new Date().getTime() };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
  };

  const deleteComplaint = (index: number) => {
    const updatedComplaints = complaints.filter((_, i) => i !== index);
    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-4">Complaints</h1>
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
              {complaint.status === "Pending" && (
                <button
                  onClick={() => updateComplaintStatus(index, "Resolved")}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => deleteComplaint(index)}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No complaints submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;