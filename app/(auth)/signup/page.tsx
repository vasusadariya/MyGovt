"use client";

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db, updateProfile } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "user" | "";
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [localError, setLocalError] = useState<string>("");
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User state updated:", user);
      const role = formData.role;
      router.push(role === "candidate" ? "/dashboard/candidate" : "/dashboard/users");
    }
  }, [user, formData.role, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role: "candidate" | "user") => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      setLocalError("All fields are required, including role selection.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    setLocalError("");

    try {
      const result = await createUserWithEmailAndPassword(email, password);

      if (result && result.user) {
        console.log("User created successfully!", result.user);

        await updateProfile(result.user, { displayName: `${name} | ${role}` });

        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          role,
          createdAt: new Date(),
        });

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: name,
            role,
          })
        );

        // No need for router.push here as useEffect will handle it
      } else {
        setLocalError("Failed to create user. Please try again.");
      }
    } catch (firebaseError: any) {
      console.error("Firebase error:", firebaseError.code, firebaseError.message);
      setLocalError(firebaseError.message || "An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_#4ade80]">
        <h1 className="text-3xl font-black mb-1 text-center dark:text-black">Sign up</h1>
        <p className="text-sm text-center text-gray-600">Create a new account</p>

        {(localError || error) && (
          <div className="p-2 mb-4 text-sm text-red-800 bg-red-200 border-2 border-red-800 rounded-none">
            {localError || error?.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-black">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full p-2 text-sm border-2 border-black dark:text-black rounded-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset-1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 dark:text-black">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full p-2 text-sm border-2 border-black dark:text-black rounded-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset-1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 dark:text-black">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 text-sm border-2 border-black rounded-none dark:text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset-1"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm font-bold mb-1 dark:text-black">Select Role:</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleRoleSelect("candidate")}
                className={`w-1/2 py-2 px-3 text-sm font-bold border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  formData.role === "candidate" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("user")}
                className={`w-1/2 py-2 px-3 text-sm font-bold border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  formData.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                User
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 bg-green-400 text-black py-2 px-3 text-sm font-bold border-3 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-2 text-sm text-center dark:text-black">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold underline dark:text-gray-400 hover:text-purple-600 dark:hover:text-green-400"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}