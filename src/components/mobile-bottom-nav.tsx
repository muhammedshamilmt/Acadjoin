'use client';

import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { Building2, GraduationCap, Home, Users, User as UserIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthContext();
  const { role } = useUserRole();

  const tabs = [
    { title: 'Home', icon: Home },
    { title: 'Institutes', icon: Building2 },
    { title: 'Courses', icon: GraduationCap },
    { title: 'People', icon: Users },
    { type: 'separator' as const },
    { title: 'Profile', icon: UserIcon },
  ];

  const selectedIndex = React.useMemo(() => {
    if (pathname === '/') return 0;
    if (pathname?.startsWith('/institutes')) return 1;
    if (pathname?.startsWith('/courses')) return 2;
    if (pathname?.startsWith('/people')) return 3;
    if (pathname?.startsWith('/user-profile') || pathname?.startsWith('/people-profile') || pathname?.startsWith('/institute-profile') || pathname?.startsWith('/admin')) return 5;
    return null;
  }, [pathname]);

  const onChange = (index: number | null) => {
    if (index === null) return;
    const tab = tabs[index] as any;
    if (tab.type === 'separator') return;
    switch (tab.title) {
      case 'Home':
        router.push('/');
        break;
      case 'Institutes':
        router.push('/institutes');
        break;
      case 'Courses':
        router.push('/courses');
        break;
      case 'People':
        router.push('/people');
        break;
      case 'Profile':
        if (!loading && !user) {
          router.push('/login');
        } else {
          // Route to appropriate profile based on role
          if (role === 'individual') {
            router.push('/people-profile');
          } else if (role === 'institute') {
            router.push('/institute-profile');
          } else if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/user-profile');
          }
        }
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-md md:hidden">
      <div className="container mx-auto px-4 py-4">
        <ExpandableTabs
          tabs={tabs}
          onChange={onChange}
          className="w-full justify-between rounded-2xl py-3"
          selectedIndex={selectedIndex}
          keepOpen
        />
      </div>
    </div>
  );
}


