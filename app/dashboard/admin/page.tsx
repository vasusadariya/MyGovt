"use client";

import { Navbar } from "@/components/Navbar";
import React from "react";
import { useRouter } from 'next/navigation';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const handleShowComplaints = () => {
    router.push('/complaints');
  };

  const handleShowInbox = () => {
    router.push('/Inbox');
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold text-center my-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div
          onClick={handleShowComplaints}
          className="shadow-md p-6 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
        
          <h2 className="text-white font-bold text-center">Show Complaints</h2>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;