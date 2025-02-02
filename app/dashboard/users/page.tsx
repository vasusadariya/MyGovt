"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import useAuthGuard from "@/app/hooks/useAuthGuard";
import withAuth from "@/components/withAuth";
import Card from "@/components/ComplaintCard";
import VoteCard from "@/components/VoteCard";
import AddDocs from "@/components/AddDocs";

function Dashboard() {
  const loading = useAuthGuard(); // Get loading state from the hook
  const [user] = useAuthState(auth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarVisible ? "block" : "hidden"
          } md:block fixed left-0 top-0 h-full`}
        >
          <div className="h-full w-64 mt-16 border-r border-gray-200 dark:border-gray-700">
            <Sidebar />
        </div>
               
                
            </div>

        {/* Main content */}
        <div
          className={`transition-all duration-200 ease-in-out ${
            isSidebarVisible ? "md:ml-64" : "ml-0"
          } p-4 sm:p-6 md:p-8`}
        >
          <div className="mb-8 md:mb-12 pt-20 md:pt-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-900 dark:text-gray-100">
              Hello {user?.displayName ?? "User"}!👋
            </h2>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card />
            <VoteCard />
            <AddDocs />
          </div>

        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, "User");
