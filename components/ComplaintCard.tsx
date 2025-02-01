import React, { useState } from "react";
import ComplaintForm from "./ComplaintForm";

const Card: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      {/* Card that opens the form */}
      <div
        className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 cursor-pointer"
        onClick={() => setIsFormOpen(true)}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Register a Complaint</h2>
          <p className="text-gray-700">Click to fill out the form.</p>
        </div>
        {/* Right arrow at the bottom right */}
        <div className="absolute bottom-4 right-4">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Modal for Complaint Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <ComplaintForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
