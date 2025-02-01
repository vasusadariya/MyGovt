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
    router.push('/inbox');
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold text-center my-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div
          onClick={handleShowComplaints}
          className="shadow-lg p-4 rounded-lg bg-white cursor-pointer"
        >
          <h2 className="text-lg font-bold text-center">Show Complaints</h2>
        </div>
        <div
          onClick={handleShowInbox}
          className="shadow-lg p-4 rounded-lg bg-white cursor-pointer"
        >
          <h2 className="text-lg font-bold text-center">Inbox</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;