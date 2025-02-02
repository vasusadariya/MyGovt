"use client";

import withAuth from '@/components/withAuth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Candidate {
  _id: string;
  name: string;
  party: string;
  votes: number;
  promises: string; // Candidate's promises
}

function UserElections() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 1000); // Live updates
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-transform transform hover:scale-105 duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 text-center">{candidate.name}</h2>
            <p className="text-gray-500 text-center">{candidate.party}</p>
            <p className="text-blue-600 font-semibold text-center mt-2">Votes: {candidate.votes}</p>
            <div className="text-center mt-2">
              <details className="bg-gray-100 p-3 rounded-lg cursor-pointer">
                <summary className="font-semibold text-gray-700">View Promises</summary>
                <p className="text-gray-600 mt-2">{candidate.promises}</p>
              </details>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => voteCandidate(candidate._id)
                  .then(() => {(alert("Vote recorded successfully!\nYou are redirected to the user page."))
                    router.push("/dashboard/users");
                  })
                }
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                {loading ? "Voting..." : "Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(UserElections, "User");
