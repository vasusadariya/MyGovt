import React, { useState } from "react";
import ComplaintForm from "./ComplaintForm";

const Card: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      {/* Card that opens the form */}
      <div
        className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-6 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
        onClick={() => setIsFormOpen(true)}
        aria-label="Register a Complaint"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Register a Complaint</h2>
          <p className="text-gray-700 text-sm">Click to fill out the form.</p>
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
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsFormOpen(false)} // Click outside to close
          aria-label="Close Modal"
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setIsFormOpen(false)}
              aria-label="Close Modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <ComplaintForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
