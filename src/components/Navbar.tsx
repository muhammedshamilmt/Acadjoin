'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  BookmarkIcon,
  MessageCircle,
  Building2,
  GraduationCap,
  Home,
  GraduationCap as GraduationCapIcon,
  Users,
  User as UserIcon
} from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useAuthStore } from '@/lib/auth';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'react-hot-toast';

interface UserProfile {
  profilePicture?: string;
  logoDataUrl?: string;
  profileId?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const storeUser = useAuthStore(state => state.user);
  const logoutStore = useAuthStore(state => state.logout);
  const { signOutUser } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // Hydration guard for persisted Zustand store and localStorage fallback
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);
  const [lsEmail, setLsEmail] = useState<string>('');
  const [lsName, setLsName] = useState<string>('');

  useEffect(() => {
    // Load minimal identity from localStorage for first paint after refresh
    try {
      if (typeof window !== 'undefined') {
        setLsEmail(window.localStorage.getItem('fp_user_email') || '');
        setLsName(window.localStorage.getItem('fp_user_name') || '');
        // Watch for changes (e.g., login/logout in another tab)
        const onStorage = () => {
          setLsEmail(window.localStorage.getItem('fp_user_email') || '');
          setLsName(window.localStorage.getItem('fp_user_name') || '');
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const hydrated = (useAuthStore as any)?.persist?.hasHydrated?.() ?? true;
      setStoreHydrated(Boolean(hydrated));
      const unsub = (useAuthStore as any)?.persist?.onFinishHydration?.(() => setStoreHydrated(true));
      return unsub;
    } catch {
      setStoreHydrated(true);
    }
  }, []);

  const primaryEmail = user?.email || storeUser?.email || lsEmail || '';
  const displayName =
    user?.displayName ||
    (storeUser?.instituteName || `${storeUser?.firstName ?? ''} ${storeUser?.lastName ?? ''}`.trim()) ||
    lsName ||
    'User';
  const roleDisplay = role === 'individual' ? 'Student' : role === 'institute' ? 'Institute' : role === 'admin' ? 'Admin' : 'User';

  // Fetch user profile data from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!primaryEmail) return;
      
      try {
        setLoadingProfile(true);
        
        // Try to fetch people profile first
        const peopleResponse = await fetch(`/api/people-registration?email=${encodeURIComponent(primaryEmail)}`);
        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          if (peopleData.registration) {
            setUserProfile({ 
              profilePicture: peopleData.registration.profilePicture,
              profileId: peopleData.registration._id 
            });
            return;
          }
        }
        
        // If not found in people, try institute profile
        const instituteResponse = await fetch(`/api/institute-registration?email=${encodeURIComponent(primaryEmail)}`);
        if (instituteResponse.ok) {
          const instituteData = await instituteResponse.json();
          if (instituteData.registration) {
            setUserProfile({ 
              logoDataUrl: instituteData.registration.logoDataUrl,
              profileId: instituteData.registration._id 
            });
            return;
          }
        }
        
        // If not found in people or institute, try regular user profile
        const userResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(primaryEmail)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.user) {
            setUserProfile({ 
              profilePicture: userData.user.profilePicture,
              profileId: userData.user._id 
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [primaryEmail]);

  const navigationLinks = [
    { name: 'About', href: '/about' },
    { name: 'Institutes', href: '/institutes' },
    { name: 'Courses', href: '/courses' },
    { name: 'People', href: '/people' },
    { name: 'Reviews', href: '/reviews' }
  ];

  const mobileNavigationTabs = [
    { title: 'Home', icon: Home },
    { title: 'Institutes', icon: Building2 },
    { title: 'Courses', icon: GraduationCapIcon },
    { title: 'People', icon: Users },
    { type: 'separator' as const },
    { title: 'Profile', icon: UserIcon },
  ];

  const handleMobileNavigation = (index: number | null) => {
    if (index === null) return;
    
    const tab = mobileNavigationTabs[index];
    if (tab.type === 'separator') return;
    
    let href = '/';
    switch (tab.title) {
      case 'Home':
        href = '/';
        break;
      case 'Institutes':
        href = '/institutes';
        break;
      case 'Courses':
        href = '/courses';
        break;
      case 'People':
        href = '/people';
        break;
      case 'Profile':
        if (role === 'individual') {
          href = '/people-profile';
        } else if (role === 'institute') {
          href = '/institute-profile';
        } else if (role === 'admin') {
          href = '/admin';
        } else {
          href = '/user-profile';
        }
        break;
    }
    
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } finally {
      // Always clear app auth store so Navbar reflects logged-out state
      logoutStore();
      // Clear minimal identity from localStorage
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('fp_user_email');
          window.localStorage.removeItem('fp_user_name');
          window.localStorage.removeItem('fp_user_is_admin');
          setLsEmail('');
          setLsName('');
        }
      } catch {}
      router.push('/');
    }
  };

  // Get profile image source
  const getProfileImageSrc = () => {
    // Check for people profile picture
    if (userProfile?.profilePicture) {
      return userProfile.profilePicture;
    }
    // Check for institute logo
    if (userProfile?.logoDataUrl) {
      return userProfile.logoDataUrl;
    }
    // Check for regular user profile picture
    if (userProfile?.profilePicture) {
      return userProfile.profilePicture;
    }
    return null;
  };

  // Check if we have a profile image to display
  const hasProfileImage = getProfileImageSrc() !== null;

  // Get appropriate fallback text based on role
  const getFallbackText = () => {
    if (role === 'admin') {
      return 'A';
    }
    if (role === 'institute' && storeUser?.instituteName) {
      return storeUser.instituteName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors duration-300"
          >
            Acadjoin
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* User Profile or Get Started */}
          <div className="hidden md:block">
            {(user || (storeHydrated && storeUser) || lsEmail) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {hasProfileImage ? (
                        <AvatarImage 
                          src={getProfileImageSrc()!} 
                          alt={displayName}
                          className="object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${
                          role === 'admin' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {getFallbackText()}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{primaryEmail}</p>
                      <p className="text-xs leading-none text-primary">{roleDisplay}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      href={
                        role === 'individual' ? '/people-profile' : 
                        role === 'institute' ? '/institute-profile' : 
                        role === 'admin' ? '/admin' :
                        '/user-profile'
                      } 
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{role === 'admin' ? 'Admin Panel' : 'Profile'}</span>
                    </Link>
                  </DropdownMenuItem>
                  {role === 'institute' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="nav" size="lg">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: show only brand; hide hamburger and menus */}
          <div className="md:hidden" />
        </div>
      </div>
    </nav>
  );
}
