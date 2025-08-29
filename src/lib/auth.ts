import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'individual' | 'institute' | 'admin';
  type: 'regular' | 'people' | 'institute' | 'admin';
  currentInstitute?: string;
  course?: string;
  year?: string;
  location?: string;
  phone?: string;
  instituteName?: string;
  address?: string;
  website?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  initializeFromStorage: () => void;
}

const initialAuthState = {
  user: null as User | null,
  isAuthenticated: false,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialAuthState,
      login: (user: User) => {
        // Set localStorage for cross-component access
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('fp_user_email', user.email);
          window.localStorage.setItem('fp_user_name', `${user.firstName} ${user.lastName}`);
          // Store admin status
          if (user.isAdmin) {
            window.localStorage.setItem('fp_user_is_admin', 'true');
          }
        }
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        // Clear localStorage on logout
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('fp_user_email');
          window.localStorage.removeItem('fp_user_name');
          window.localStorage.removeItem('fp_user_is_admin');
        }
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (userData: Partial<User>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
      // Initialize auth state from localStorage if Zustand store is empty
      initializeFromStorage: () => {
        if (typeof window !== 'undefined') {
          const storedEmail = window.localStorage.getItem('fp_user_email');
          const storedName = window.localStorage.getItem('fp_user_name');
          const isAdmin = window.localStorage.getItem('fp_user_is_admin') === 'true';
          
          if (storedEmail && storedName && !get().user) {
            // We have localStorage data but no Zustand user, so we're authenticated
            // Try to reconstruct a minimal user object with role information
            const reconstructedUser: User = {
              id: 'temp-id',
              firstName: storedName.split(' ')[0] || '',
              lastName: storedName.split(' ').slice(1).join(' ') || '',
              email: storedEmail,
              role: 'user', // Default to user role, will be updated by useUserRole hook
              type: 'regular',
              isAdmin: isAdmin
            };
            
            set({ user: reconstructedUser, isAuthenticated: true });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      version: 2,
      // For SSR/Next.js safety. Ensure we only use localStorage in browser
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      // Persist only serializable, necessary fields
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      // Migrate older persisted shapes/versions safely
      migrate: (persistedState: any, version) => {
        try {
          if (!persistedState || typeof persistedState !== 'object') {
            return initialAuthState;
          }
          // v1 -> v2: ensure keys exist and types are correct
          const user: User | null = persistedState.user ?? null;
          const isAuthenticated: boolean = !!persistedState.isAuthenticated;
          return { user, isAuthenticated };
        } catch {
          return initialAuthState;
        }
      },
    }
  )
);

// Helper function to get user display name
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  
  if (user.role === 'institute' && user.instituteName) {
    return user.instituteName;
  }
  
  return `${user.firstName} ${user.lastName}`;
};

// Helper function to get user role display name
export const getUserRoleDisplay = (user: User | null): string => {
  if (!user) return '';
  
  switch (user.role) {
    case 'user':
      return 'User';
    case 'individual':
      return 'Student';
    case 'institute':
      return 'Institute';
    case 'admin':
      return 'Admin';
    default:
      return 'User';
  }
};
