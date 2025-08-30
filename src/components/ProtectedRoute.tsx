'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuth as useAuthStore } from '@/lib/auth';
import { FullScreenLoader } from '@/components/ui/loading-spinner';

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
    return <FullScreenLoader text="Loading..." />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};
