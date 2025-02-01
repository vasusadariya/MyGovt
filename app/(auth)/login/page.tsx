"use client";

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [localError, setLocalError] = useState<string>("");
  const [signInWithEmailAndPassword, userCredential, loading, error] = useSignInWithEmailAndPassword(auth);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Setting up auth state listener");
    let isRedirecting = false; // Add flag to prevent multiple redirects

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && !isRedirecting) {
            console.log("User authenticated:", user.uid);
            isRedirecting = true; // Set flag before starting redirect process
            
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    const userRole = userDoc.data().role;
                    console.log("User role:", userRole);
                    sessionStorage.setItem("role", userRole);

                    // Use replace instead of push to prevent back button issues
                    switch (userRole) {
                        case "candidate":
                            console.log("Redirecting to candidate dashboard");
                            await router.replace("/dashboard/candidate");
                            break;
                        case "admin":
                            console.log("Redirecting to admin dashboard");
                            await router.replace("/dashboard/admin");
                            break;
                        default:
                            console.log("Redirecting to users dashboard");
                            await router.replace("/dashboard/users");
                            break;
                    }
                } else {
                    console.log("User document does not exist");
                    setLocalError("User data not found. Please contact support.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLocalError("Error fetching user data. Please try again.");
                isRedirecting = false; // Reset flag if there's an error
            }
        } else {
            console.log("No authenticated user");
            // Optionally redirect to login page if user is not authenticated
            // await router.replace('/login');
        }
        setIsAuthenticating(false);
    });

    return () => {
        isRedirecting = false;
        unsubscribe();
    };
}, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (email === "admin1@gmail.com" && password === "admin123") {
      console.log("Admin logged in successfully!");
      sessionStorage.setItem("role", "admin");
      router.push("/dashboard/admin");
      return;
    }

    setLocalError("");
    setIsAuthenticating(true);
    try {
      console.log("Attempting to sign in with email and password");
      const result = await signInWithEmailAndPassword(email, password);
      if (result) {
        console.log("Sign in successful");
      } else {
        console.log("Sign in failed");
        setLocalError("Invalid email or password. Please try again.");
        setIsAuthenticating(false);
      }
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError);
      setLocalError("An error occurred during login. Please try again.");
      setIsAuthenticating(false);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setIsAuthenticating(true);
    try {
      console.log("Attempting Google Sign-In");
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful:", result.user.uid);
      // The onAuthStateChanged listener will handle the redirection
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setLocalError("Google login failed. Please try again.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_#4ade80]">
        <h2 className="text-3xl font-black mb-1 text-center dark:text-black">Login</h2>
        <p className="text-sm text-center text-gray-600">Sign in to your account</p>

        {(localError || error) && (
          <div className="p-3 my-4 text-sm text-red-800 bg-red-200 rounded-md">{localError || error?.message}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-1 dark:text-black">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full p-2 text-sm border-2 dark:text-black border-black rounded-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset-1"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block dark:text-black text-sm font-bold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 text-sm border-2 border-black dark:text-black rounded-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset-1"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-purple-500 border-2 text-white py-2 px-3 text-sm font-bold border-3 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              isAuthenticating
                ? "opacity-50 cursor-not-allowed"
                : "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            }`}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogle}
            className={`w-full border-2 bg-green-500 text-black py-2 px-3 text-sm font-bold border-3 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              isAuthenticating
                ? "opacity-50 cursor-not-allowed"
                : "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            }`}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "Authenticating..." : "Continue with Google"}
          </button>
        </div>

        <p className="mt-4 text-sm text-center dark:text-black">
          Forgot your password?{" "}
          <a href="/forgot" className="text-blue-500 hover:underline">
            Reset it here
          </a>
        </p>

        <p className="mt-2 text-sm text-center dark:text-black">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-bold underline dark:text-gray-400 hover:text-purple-600 dark:hover:text-green-400"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}