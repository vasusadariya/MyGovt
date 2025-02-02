"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from '@/components/Piechart';


interface Candidate {
  _id: string;
  name: string;
  party: string;
  votes: number;
  partySymbol: string; // URL of the party symbol
}

function Election() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchCandidates();

    // Live updates every 5 seconds
    const interval = setInterval(fetchCandidates, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/candidates');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Live Election Results</h1>


      <PieChart/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => (
          <div
            key={candidate._id}
            className={`p-6 rounded-lg shadow-lg transition-transform ${
              index === 0 ? "border-4 border-yellow-500 scale-105" : "border border-gray-300"
            } bg-white`}
          >
            <h2 className="text-xl font-bold text-center">{candidate.name}</h2>
            <p className="text-gray-600 text-center">{candidate.party}</p>
            <p className="text-lg font-semibold text-center mt-2">
              Votes: <span className="text-blue-500">{candidate.votes}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Election;