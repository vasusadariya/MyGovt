"use client"

import { useEffect, useState } from "react"

import { Sidebar } from "@/components/sidebar"

import { Navbar } from "@/components/Navbar"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import useAuthGuard from "@/app/hooks/useAuthGuard"
import withAuth from "@/components/withAuth";
import Card from "@/components/ComplaintCard";
import VoteCard from "@/components/VoteCard";



function Dashboard() {
    const loading = useAuthGuard(); // Get loading state from the hook

    const [user] = useAuthState(auth);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarVisible(window.innerWidth >= 768)
        }

        // Initial check
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (loading) return null;

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
                {/* Sidebar */}
                <div className={`${isSidebarVisible ? 'block' : 'hidden'} md:block fixed left-0 top-0 h-full`}>
                    <div className="h-full w-64 mt-16"> {/* Added mt-16 to account for navbar height */}
                        <Sidebar />
                    </div>
                </div>

                {/* Main content */}
                <div className={`transition-all duration-200 ease-in-out ${isSidebarVisible ? 'md:ml-64' : 'ml-0'} p-4 sm:p-6 md:p-8`}>
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-gray-100 pt-20 md:pt-16"> {/* Adjusted padding-top for navbar */}
                            Hello {user?.displayName ?? ""}!! 👋
                        </h2>   
                    </div>

                    <Card/>

                    <div className="mb-2">
                    </div>

                    <VoteCard/>

                </div>
                
            </div>
        </div>
    )
}

export default withAuth(Dashboard, 'User');