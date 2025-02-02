"use client";

import { Navbar } from '@/components/Navbar';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import withAuth from '@/components/withAuth';
import axios from 'axios';

import { X, UserPlus } from "lucide-react";


interface Candidate {
  _id: string;
  name: string;
  gender: string;
  age: number;
  promises: string;
  party: string;
  votingId: number;
  votes: number;
}

interface FormData {
  name: string;
  gender: string;
  age: number | string;
  promises: string;
  party: string;
  votingId: number | string;
}

function CandidateDashboard() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    age: "",
    promises: "",
    party: "",
    votingId: "",
  });

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await axios.get("http://localhost:8080/candidate");
        setCandidates(response.data.candidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    }
    fetchCandidates();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: name === "age" || name === "votingId" ? Number(value) : value });


    if ((name === "age" || name === "votingId") && value.startsWith("0")) {
      setFormData({ ...formData, [name]: value.replace(/^0+/, "") });
    } else {
      setFormData({ ...formData, [name]: value });
    }

  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {

      const response = await axios.post("http://localhost:8080/candidates", formData);
      console.log('Form submitted successfully:', response.data);

      // Refresh candidates list after submission
      const updatedCandidates = await axios.get("http://localhost:8080/candidate");
      setCandidates(updatedCandidates.data.candidates);

      setFormData({ name: '', gender: '', age: '', promises: '', party: '', votingId: '' });

      const response2 = await axios.post("http://localhost:3000/candidate", formData);
      console.log("Form submitted successfully:", response.data);
      
      setFormData({
        name: "",
        gender: "",
        age: "",
        promises: "",
        party: "",
        votingId: "",
      });


      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Welcome to the Candidate Dashboard
        </h1>

        {/* Enter Details Card */}
        <div
          onClick={() => setShowForm(true)}
          className="max-w-md mx-auto bg-blue-500 text-white p-6 rounded-xl shadow-lg cursor-pointer 
          flex items-center justify-center gap-3 hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300"
        >
          <UserPlus className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Enter Your Details</h2>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Candidate Details</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Promises:</label>
                  <input
                    type="text"
                    name="promises"
                    value={formData.promises}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Party:</label>
                  <input
                    type="text"
                    name="party"
                    value={formData.party}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">Voting ID:</label>
                  <input
                    type="number"
                    name="votingId"
                    value={formData.votingId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-semibold mt-10">List of Candidates</h2>
      <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Sr No.</th>
            <th className="px-6 py-3 text-left">Candidate Name</th>
            <th className="px-6 py-3 text-left">Party</th>
            <th className="px-6 py-3 text-left">Voting ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {candidates.map((candidate, index) => (
            <tr key={candidate._id} className="hover:bg-gray-100 transition">
              <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
              <td className="px-6 py-4">{candidate.name}</td>
              <td className="px-6 py-4">{candidate.party}</td>
              <td className="px-6 py-4 text-gray-600">{candidate.votingId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default withAuth(CandidateDashboard, 'Candidate');



