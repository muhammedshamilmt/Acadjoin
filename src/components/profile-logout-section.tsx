'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function ProfileLogoutSection() {
  const { signOutUser } = useAuth();
  const logoutStore = useAuthStore(state => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {}
    finally {
      try {
        logoutStore();
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('fp_user_email');
          window.localStorage.removeItem('fp_user_name');
          window.localStorage.removeItem('fp_user_is_admin');
        }
      } catch {}
      router.push('/login');
    }
  };

  return (
    <Card className="border-primary/20 sticky top-24 self-start">
      <CardHeader>
        <CardTitle className="text-primary">Logout</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">End your session securely.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full justify-center">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to sign in again to access your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}


