import React from 'react';

function AddDocs() {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative">
      <h2 className="text-xl font-semibold mb-2">Add your Docs</h2>
      <p className="text-gray-700 text-base mb-4">Upload your documents here and manage them easily.</p>
      <button
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Add Document Button"
      >
        Add Docs
      </button>
    </div>
  );
}

export default AddDocs;
