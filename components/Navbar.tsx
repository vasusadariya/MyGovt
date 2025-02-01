"use client";
import Link from "next/link";
import { Binary, Menu, X, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config"; // Adjust the import path based on your config file
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import Image from "next/image";

const navigation = [
  { name: "Platform Solutions", href: "/platform" },
  { name: "Clients", href: "/clients" },
  { name: "Insights", href: "/insights" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);
  const [dashboardLink, setDashboardLink] = useState("/dashboard/users/");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to login page after sign-out
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setRole(role);
          switch (role) {
            case "Admin":
              setDashboardLink("/dashboard/admin/");
              break;
            case "candidate":
              setDashboardLink("/dashboard/candidate/");
              break;
            default:
              setDashboardLink("/dashboard/users/");
          }
        } else {
          setRole(null);
          setDashboardLink("/dashboard/users/");
        }
      }
    };

    if (user) {
      fetchUserRole();
    } else {
      setRole(null); // Reset role when user logs out
      setDashboardLink("/dashboard/users/");
    }
  }, [user]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-b transition-shadow ${isScrolled ? "shadow-lg" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold z-50"
          >
            <Binary className="h-6 w-6 dark:text-green-400 text-purple-500" />
            <span className="dark:text-white">HackOps</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-purple-500 dark:text-white hover:dark:text-green-400"
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* User Authentication Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              // ⬇️ Placeholder while loading
              <div className="flex gap-4">
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Dashboard Button */}
                <Link href={dashboardLink}>
                  <button
                    className="px-6 py-2 hidden md:flex items-center justify-center gap-2 rounded-lg border-2 border-[#000000] bg-[#ae7aff]
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden md:inline">Dashboard</span>
                  </button>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex px-4 py-2 rounded-lg border-2 border-[#000000] bg-[#ae7aff]
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Logout
                </button>

                {/* User Avatar */}
                <div className="relative group">
                  <Image
                    src={user?.photoURL || "/default-avatar.svg"} // Fallback to default avatar
                    alt={user?.displayName || "User Avatar"}
                    width={50}
                    height={50}
                    className="rounded-full cursor-pointer"
                    aria-label="User Avatar"
                  />
                  {/* Optional Dropdown */}
                  <div className="absolute right-0 hidden w-48 p-2 mt-2 bg-white border rounded-lg shadow-lg group-hover:block">
                    <p className="text-sm text-gray-700">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <hr className="my-2" />
                  </div>
                </div>
                <ThemeToggle />
              </>
            ) : (
              <>
                {/* Login and Sign-Up Buttons */}
                <Link href="/login">
                  <button
                    className="px-4 py-2 hidden md:flex rounded-lg border-2 border-[#000000] bg-[#ff1fbc]
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="px-4 py-2 hidden md:flex rounded-lg border-2 border-[#000000] bg-[#ae7aff]
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Sign Up
                  </button>
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 dark:text-white" />
          </button>

          {/* Mobile Menu */}
          <div
            className={`
            fixed inset-0 bg-white dark:bg-gray-900 z-40 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
            md:hidden
          `}
          >
            {/* Close button positioned at top-right */}
            <button
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 dark:text-white" />
            </button>

            <div className="flex flex-col h-full pt-20 px-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg justify-center mx-auto items-center font-medium text-foreground hover:text-purple-500 dark:text-white hover:dark:text-green-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-4 mt-8">
                {loading ? (
                  // ⬇️ Placeholder while loading
                  <div>Loading...</div>
                ) : user ? (
                  <>
                    {/* Dashboard Button */}
                    <Link href={dashboardLink}>
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-[#000000] bg-[#ae7aff]
                          text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                          hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg bg-red-500 border-2 border-[#000000] 
                        shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                        hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-auto px-2 py-2 bg-purple-500 text-white rounded-lg border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_#4ade80] transition-shadow duration-200">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </button>
                    <button className="w-auto px-2 py-2 bg-purple-500 text-white rounded-lg border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_#4ade80] transition-shadow duration-200">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign up
                      </Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}