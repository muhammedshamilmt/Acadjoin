"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Zap, 
  Crown, 
  X,
  Star,
  MapPin,
  GraduationCap,
  Clock,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { initiatePayment, PaymentOptions } from '@/lib/razorpay';
import { toast } from 'react-hot-toast';

interface QuickConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    location?: string;
    studiedInstitution?: string;
    specializations?: string[];
    skills?: string[];
  } | null;
}

const QuickConnectModal = ({ isOpen, onClose, person }: QuickConnectModalProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  
  if (!person) return null;

  const getPersonRole = (person: any): string => {
    if (person.specializations?.some((spec: string) => spec.toLowerCase().includes('mentor'))) {
      return 'Student Mentor';
    } else if (person.specializations?.some((spec: string) => spec.toLowerCase().includes('counsel'))) {
      return 'Career Counselor';
    } else if (person.specializations?.some((spec: string) => spec.toLowerCase().includes('academic'))) {
      return 'Academic Counselor';
    } else if (person.specializations?.some((spec: string) => spec.toLowerCase().includes('industry'))) {
      return 'Industry Expert';
    } else {
      return 'Professional';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Fetch user details when modal opens
  React.useEffect(() => {
    if (isOpen && user?.uid) {
      fetchUserDetails();
    }
  }, [isOpen, user?.uid]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/auth/get-user-details?uid=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleQuickConnect = async () => {
    if (!user) {
      toast.error('Please login to connect with professionals');
      return;
    }

    setIsProcessing(true);
    try {
      // Close the modal immediately when payment starts
      onClose();
      
      const paymentOptions: PaymentOptions = {
        amount: 10, // 10 rupees for quick connect
        currency: 'INR',
        receipt: `quick_connect_${Date.now()}`,
        notes: {
          connectionType: 'quick_connect',
          personName: `${person.firstName} ${person.lastName}`,
        },
        userId: user.uid,
        connectedPersonId: person._id,
        userName: userDetails?.displayName || user.displayName || 'User',
        userEmail: user.email || '',
        userPhone: user.phoneNumber || undefined,
        userMobile: userDetails?.mobile || userDetails?.phone || '',
      };

      const result = await initiatePayment(paymentOptions);
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Payment successful! You are now connected.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message === 'Payment failed') {
        toast.error('Payment was cancelled or failed. Please try again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFreeConnect = () => {
    if (!user) {
      toast.error('Please login to connect with professionals');
      return;
    }
    
    toast('Free connection feature coming soon!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white">
        {/* Dialog Title for Accessibility */}
        <DialogTitle className="sr-only">
          Connect with {person.firstName} {person.lastName}
        </DialogTitle>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-2 h-[700px]">
          {/* Left Side - Content Section */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl"></div>
            
            {/* Header Section */}
            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                  <Crown className="w-4 h-4 mr-2" />
                  {getPersonRole(person)}
                </Badge>
                <div className="flex items-center space-x-1 bg-amber-100 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-medium text-amber-700">4.9</span>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Connect with <span className="text-primary">{person.firstName}</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Start your learning journey with personalized guidance and expert mentorship
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 space-y-4 mb-8">
              {/* Quick Connect Button */}
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white py-7 text-lg font-bold shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleQuickConnect}
                disabled={isProcessing}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {isProcessing ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Zap className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">
                        {isProcessing ? 'Processing...' : 'Quick Connect'}
                      </div>
                      <div className="text-sm opacity-90">
                        {isProcessing ? 'Please wait...' : 'Instant Connection'}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-sm font-medium">
                    10rs
                  </Badge>
                </div>
              </Button>

              {/* Free Connect Button */}
              <Button 
                variant="outline"
                className="w-full border-3 border-primary/30 text-primary hover:bg-primary hover:text-white py-7 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] group bg-white/80 backdrop-blur-sm"
                onClick={handleFreeConnect}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">Connect</div>
                    <div className="text-sm opacity-90">Free Standard</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">Instant Chat</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">Learning Plans</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">Premium Content</span>
              </div>
            </div>

            {/* Quick Connect Benefits */}
            <div className="relative z-10 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl border border-amber-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold text-amber-800">Quick Connect Benefits</span>
              </div>
              <div className="text-xs text-amber-700 space-y-1">
                <div>• Instant connection with the professional</div>
                <div>• Priority response time & direct access</div>
                <div>• Personalized guidance & mentorship</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}></div>
            
            {/* Profile Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {person.profilePicture ? (
                <div className="relative group">
                  <img 
                    src="https://img.freepik.com/premium-photo/blue-silver-watch-with-dollar-sign-top_1335580-3315.jpg?w=1480"
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/20 group-hover:border-white/40 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 rounded-3xl border-4 border-white/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <GraduationCap className="w-32 h-32 mx-auto mb-4 opacity-60" />
                    <p className="text-2xl font-bold opacity-80">{getInitials(person.firstName, person.lastName)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info Overlay */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-3">
                  {person.firstName} {person.lastName}
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm text-white/80 mb-4">
                  {person.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{person.location}</span>
                    </div>
                  )}
                  {person.studiedInstitution && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{person.studiedInstitution}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {person.skills?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickConnectModal;
