'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminLoginTest() {
  const { user, isAuthenticated, isAdmin, signInWithGoogle, logout } = useAuth();

  // Debug environment variables
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['admin@example.com'];
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables Debug */}
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Admin Emails:</strong> {adminEmails.join(', ')}</p>
            <p><strong>Admin Password Set:</strong> {adminPassword ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* User Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">User Status:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Authenticated:</strong> 
              <Badge variant={isAuthenticated ? "default" : "secondary"} className="ml-2">
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </p>
            <p><strong>Is Admin:</strong> 
              <Badge variant={isAdmin ? "default" : "secondary"} className="ml-2">
                {isAdmin ? 'Yes' : 'No'}
              </Badge>
            </p>
            {user && (
              <p><strong>User Email:</strong> {user.email}</p>
            )}
          </div>
        </div>

        {/* Login/Logout Buttons */}
        <div className="space-y-2">
          {!isAuthenticated ? (
            <Button onClick={signInWithGoogle} className="w-full">
              Sign in with Google
            </Button>
          ) : (
            <Button onClick={logout} variant="outline" className="w-full">
              Sign Out
            </Button>
          )}
        </div>

        {/* Admin Access Status */}
        {isAuthenticated && !isAdmin && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You are signed in but not recognized as an admin. 
              Make sure your email ({user?.email}) is included in the NEXT_PUBLIC_ADMIN_EMAILS environment variable.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Success!</strong> You have admin access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
