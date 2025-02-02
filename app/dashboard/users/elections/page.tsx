"use client";

import withAuth from '@/components/withAuth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Candidate {
  _id: string;
  name: string;
  party: string;
  votes: number;
  partySymbol: string; // URL of party symbol
}

function UserElections() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 5000); // Live updates
    return () => clearInterval(interval);
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/candidate');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const voteCandidate = async (candidateId: string) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/vote/${candidateId}`);
      fetchCandidates(); // Refresh list after voting
    } catch (error) {
      console.error('Error voting:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🗳 Election Voting</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Party Symbol</th>
              <th className="py-3 px-6 text-left">Candidate</th>
              <th className="py-3 px-6 text-left">Party</th>
              <th className="py-3 px-6 text-left">Votes</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={candidate._id} className="border-t">
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">
                  <img src={candidate.partySymbol} alt={candidate.party} className="w-10 h-10" />
                </td>
                <td className="py-3 px-6">{candidate.name}</td>
                <td className="py-3 px-6">{candidate.party}</td>
                <td className="py-3 px-6 text-blue-500 font-semibold">{candidate.votes}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => voteCandidate(candidate._id)}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    {loading ? "Voting..." : "Vote"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(UserElections, "User");
