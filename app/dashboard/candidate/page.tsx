"use client";

import { Navbar } from '@/components/Navbar';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import withAuth from '@/components/withAuth';
import axios from 'axios';

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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    age: '',
    promises: '',
    party: '',
    votingId: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if ((name === "age" || name === "votingId") && value.startsWith("0")) {
      // Prevent leading zeros
      setFormData({ ...formData, [name]: value.replace(/^0+/, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/candidate', formData);
      console.log('Form submitted successfully:', response.data);
      // Optionally, reset form and hide it after submission
      setFormData({
        name: '',
        gender: '',
        age: '',
        promises: '',
        party: '',
        votingId: ''
      });
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
    </div>
  );
}

export default withAuth(CandidateDashboard, 'Candidate');