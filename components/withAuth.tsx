"use client"

import React, { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType, requiredRole: string) => {
  return (props: any) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      const checkUserRole = async () => {
        if (loading) return; // Wait for authentication state to load
        if (!user) {
          router.push('/login'); // Redirect to login if not authenticated
          return;
        }

        // Fetch user role from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole !== requiredRole) {
            router.push('/unauthorized'); // Redirect if user does not have required role
          }
        } else {
          router.push('/unauthorized'); // Redirect if user data is not found
        }
      };

      if (typeof window !== 'undefined') {
        checkUserRole();
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Show loading indicator while checking authentication
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;