import { useState, useEffect } from 'react';
import { useAuth as useAuthStore } from '@/lib/auth';

export type UserRole = 'user' | 'individual' | 'institute' | 'admin' | null;

export const useUserRole = () => {
  const storeUser = useAuthStore(state => state.user);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineUserRole = async () => {
      console.log('🔍 useUserRole: Starting role determination...');
      console.log('🔍 useUserRole: storeUser:', storeUser);
      
      const effectiveEmail = storeUser?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
      console.log('🔍 useUserRole: effectiveEmail:', effectiveEmail);
      
      if (!effectiveEmail) {
        console.log('🔍 useUserRole: No email found, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // PRIORITY 1: Use role from auth store if available (this is set during login)
        if (storeUser?.role) {
          console.log('🎯 useUserRole: Using role from auth store:', storeUser.role);
          setRole(storeUser.role as UserRole);
          setLoading(false);
          return;
        }
        
        // PRIORITY 2: Check if user is admin from storage
        const isAdminFromStorage = typeof window !== 'undefined' && window.localStorage.getItem('fp_user_is_admin') === 'true';
        if (isAdminFromStorage || storeUser?.isAdmin) {
          console.log('🎯 useUserRole: Setting admin role from storage');
          setRole('admin');
          setLoading(false);
          return;
        }
        
        // PRIORITY 3: Fallback to API calls only if no role is stored
        console.log('🔍 useUserRole: No role in auth store, checking collections...');
        
        // Check people registrations
        const peopleResponse = await fetch(`/api/people-registration?email=${encodeURIComponent(effectiveEmail)}`);
        if (peopleResponse.ok) {
          console.log('🔍 useUserRole: Found in people registrations, setting individual role');
          setRole('individual');
          setLoading(false);
          return;
        }

        // Check institute registrations
        const instituteResponse = await fetch(`/api/institute-registration?email=${encodeURIComponent(effectiveEmail)}`);
        if (instituteResponse.ok) {
          console.log('🔍 useUserRole: Found in institute registrations, setting institute role');
          setRole('institute');
          setLoading(false);
          return;
        }

        // Check Firebase users collection
        const firebaseResponse = await fetch(`/api/auth/store-google-user?email=${encodeURIComponent(effectiveEmail)}`);
        if (firebaseResponse.ok) {
          console.log('🔍 useUserRole: Found in Firebase users, setting user role');
          setRole('user');
          setLoading(false);
          return;
        }

        // Default to user if no specific role found
        console.log('🔍 useUserRole: No collection found, defaulting to user role');
        setRole('user');
      } catch (error) {
        console.error('💥 useUserRole: Error determining user role:', error);
        setRole('user'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    determineUserRole();
  }, [storeUser?.email, storeUser?.role, storeUser?.isAdmin]);

  console.log('🔍 useUserRole: Final role state:', { role, loading, storeUserRole: storeUser?.role });
  return { role, loading };
};
