"use client";

import { Navbar } from '@/components/Navbar';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import withAuth from '@/components/withAuth';
import axios from 'axios';

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
    name: '',
    gender: '',
    age: '',
    promises: '',
    party: '',
    votingId: ''
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
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Candidate Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Enter your details
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded no-spinner"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="promises" className="block text-gray-700">Promises:</label>
              <input
                type="text"
                id="promises"
                name="promises"
                value={formData.promises}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="party" className="block text-gray-700">Party:</label>
              <input
                type="text"
                id="party"
                name="party"
                value={formData.party}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="votingId" className="block text-gray-700">Voting ID:</label>
              <input
                type="number"
                id="votingId"
                name="votingId"
                value={formData.votingId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded no-spinner"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Submit
            </button>
          </form>
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
