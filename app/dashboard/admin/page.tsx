"use client";

import { Navbar } from "@/components/Navbar";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, BarChart, LogOut } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const handleShowComplaints = () => {
    router.push("/complaints");
  };

  const handleLogout = () => {
    // Clear authentication (adjust this according to your auth logic)
    localStorage.removeItem("token"); // Example: Remove token
    sessionStorage.clear(); // Clear session
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show Complaints */}
          <div
            onClick={handleShowComplaints}
            className="p-6 bg-yellow-500 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer 
            hover:bg-yellow-600 transition-transform transform hover:scale-105 duration-300"
          >
            <AlertTriangle className="w-12 h-12 text-white mb-3" />
            <h2 className="text-white font-semibold text-lg">Show Complaints</h2>
          </div>

          {/* Monitor Elections */}
          <Link href="/elections">
            <div
              className="p-6 bg-blue-500 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer 
              hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300"
            >
              <BarChart className="w-12 h-12 text-white mb-3" />
              <h2 className="text-white font-semibold text-lg">Monitor Elections</h2>
            </div>
          </Link>

          {/* Logout Button */}
          <div
            onClick={handleLogout}
            className="p-6 bg-red-500 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer 
            hover:bg-red-600 transition-transform transform hover:scale-105 duration-300"
          >
            <LogOut className="w-12 h-12 text-white mb-3" />
            <h2 className="text-white font-semibold text-lg">Logout</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
