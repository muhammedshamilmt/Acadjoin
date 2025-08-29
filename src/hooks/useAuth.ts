import { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this is a new user by checking if user metadata was created recently
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // Store user data in your database
        await storeUserInDatabase(user);
        toast.success('Account created successfully! Please complete your profile.');
      } else {
        toast.success('Welcome back!');
      }
      
      return { user, isNewUser };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
      } else {
        toast.error('Failed to sign in with Google');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Admin functionality
  const isAuthenticated = !!user;
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['admin@example.com'];
  
  // Check if user is admin from localStorage (for non-Google auth users)
  const [isAdminFromStorage] = useLocalStorage('fp_user_is_admin');
  const isAdmin = (user?.email && adminEmails.includes(user.email)) || isAdminFromStorage === 'true';
  
  const logout = signOutUser;

  // Admin password verification function
  const verifyAdminPassword = (password: string) => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    return adminPassword === password;
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    isAuthenticated,
    isAdmin,
    logout,
    verifyAdminPassword,
  };
};

// Function to store user data in your database
const storeUserInDatabase = async (user: User) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      isProfileComplete: false, // Flag to indicate profile needs completion
    };

    const response = await fetch('/api/auth/store-google-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to store user data');
    }

    console.log('User data stored successfully');
  } catch (error) {
    console.error('Error storing user data:', error);
    // Don't throw here as we don't want to break the sign-in flow
    // The user can still sign in, we'll just show a message about profile completion
  }
};
