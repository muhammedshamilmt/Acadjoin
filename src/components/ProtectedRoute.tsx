'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuth as useAuthStore } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const storeUser = useAuthStore(state => state.user);
  // Track Zustand persisted store hydration to avoid false logouts on refresh
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Immediately check current hydration state
      const hydratedNow = (useAuthStore as any)?.persist?.hasHydrated?.() ?? true;
      setStoreHydrated(Boolean(hydratedNow));

      // Subscribe to hydration finish
      const unsub = (useAuthStore as any)?.persist?.onFinishHydration?.(() => {
        setStoreHydrated(true);
      });
      return unsub;
    } catch {
      setStoreHydrated(true);
    }
  }, []);

  // Only count Zustand user once the store has hydrated
  const isAuthenticated = !!(user || (storeHydrated && storeUser));

  useEffect(() => {
    if (!loading && storeHydrated && !isAuthenticated) {
      router.push('/');
    }
  }, [user, storeUser, isAuthenticated, loading, storeHydrated, router]);

  if (loading || !storeHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-coral-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};
