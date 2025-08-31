"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  BarChart3,
  MessageSquare,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// Import components (we'll create these)
import Dashboard from "@/components/admin/Dashboard";
import PeopleManagement from "@/components/admin/PeopleManagement";
import InstitutesManagement from "@/components/admin/InstitutesManagement";
import Analytics from "@/components/admin/Analytics";
import SettingsManagement from "@/components/admin/SettingsManagement";
import Users from "@/components/admin/Users";
import Messages from "@/components/admin/Messages";

const AdminPage = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, logout, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPaidRegistrationEnabled, setIsPaidRegistrationEnabled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Use custom hook for localStorage access
  const [userName] = useLocalStorage('fp_user_name');
  const [userEmail] = useLocalStorage('fp_user_email');
  const [isAdminFromStorage, setAdminStatus] = useLocalStorage('fp_user_is_admin');

  useEffect(() => {
    // Wait for auth loading to complete and localStorage to hydrate
    if (authLoading) return;
    
    const timer = setTimeout(() => {
      // Check if user is admin from localStorage (for non-Google auth users)
      const isAuthenticatedFromStorage = userEmail !== null;
      const isAdminFromStorageBool = isAdminFromStorage === 'true';
      
      console.log('Admin auth check:', {
        isAuthenticated,
        isAdmin,
        userEmail,
        isAdminFromStorage,
        isAuthenticatedFromStorage,
        isAdminFromStorageBool,
        authLoading
      });
      
      if ((!isAuthenticated && !isAuthenticatedFromStorage) || (!isAdmin && !isAdminFromStorageBool)) {
        console.log('Redirecting to login - not authenticated or not admin');
        router.push("/login");
      } else {
        console.log('Admin access granted');
        setIsCheckingAuth(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, router, userEmail, isAdminFromStorage, authLoading]);

  const isActive = (tab: string) => activeTab === tab;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: UsersIcon },
    { id: "people", label: "People Management", icon: UsersIcon },
    { id: "institutes", label: "Institutes Management", icon: Building2 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Clear admin status from localStorage
      setAdminStatus(null);
      
      toast.success('Logged out successfully');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePaidRegistrationToggle = async (enabled: boolean) => {
    try {
      setIsPaidRegistrationEnabled(enabled);
      // Here you would typically make an API call to update the setting
      toast.success(`Paid registration ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating paid registration setting:', error);
      toast.error('Failed to update setting');
    }
  };

  const renderNavItem = (item: any) => {
    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
          isActive(item.id)
            ? "bg-primary/10 text-primary"
            : "text-fashion-primary hover:bg-gray-50"
        }`}
        aria-current={isActive(item.id) ? "page" : undefined}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
      </button>
    );
  };

  // Show loading state while checking authentication
  if (authLoading || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between p-4 lg:hidden">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-fashion-primary mr-4"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-xl font-bold text-fashion-primary">
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-fashion-primary/70 hover:text-fashion-primary"
            aria-label="Go to home"
          >
            <Home size={20} />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isLoggingOut}
              >
                <LogOut size={20} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to login again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 flex flex-col h-screen ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header in Sidebar */}
        <div className="p-6 border-b border-gray-200 lg:hidden">
          <h1 className="text-xl font-bold text-fashion-primary">AL-HYABA Admin</h1>
        </div>

        {/* Desktop Header in Sidebar */}
        <div className="p-6 border-b border-gray-200 hidden lg:flex items-center">
          <h1 className="text-xl font-bold text-fashion-primary">AL-HYABA Admin</h1>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map(renderNavItem)}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-fashion-primary/10 flex items-center justify-center">
                  <User className="text-fashion-primary" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-fashion-primary">
                    {user?.displayName || userName || "Admin User"}
                  </p>
                  <p className="text-xs text-fashion-primary/60">
                    {user?.email || userEmail || "admin@example.com"}
                  </p>
                </div>
              </div>
              <div className="relative group">
                <button
                  className="text-fashion-primary/70 hover:text-fashion-primary"
                  aria-label="User options"
                >
                  <ChevronDown size={18} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-fashion-primary hover:bg-gray-100"
                  >
                    View Site
                  </Link>
                  <Separator className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-fashion-primary hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-30 flex-1 overflow-y-auto flex flex-col w-full">
        {/* Desktop Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-6 hidden lg:flex items-center justify-between">
          <h1 className="text-xl font-bold text-fashion-primary">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "users" && "Users Management"}
            {activeTab === "people" && "People Management"}
            {activeTab === "institutes" && "Institutes Management"}
            {activeTab === "messages" && "Messages Management"}
            {activeTab === "analytics" && "Analytics"}
            {activeTab === "settings" && "Settings"}
          </h1>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home size={16} className="mr-2" />
                View Site
              </Link>
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "users" && <Users />}
          {activeTab === "people" && <PeopleManagement />}
          {activeTab === "institutes" && <InstitutesManagement />}
          {activeTab === "messages" && <Messages />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "settings" && (
            <SettingsManagement 
              isPaidRegistrationEnabled={isPaidRegistrationEnabled}
              onPaidRegistrationToggle={handlePaidRegistrationToggle}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center flex justify-center text-sm text-fashion-primary/60">
          <p className="font-['Adelone-Serial-Extrabold-Regular'] text-fashion-primary">
            &copy; {new Date().getFullYear()} AL-HYABA.
          </p>
          <p>All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminPage;
