'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth as useAuthStore } from '@/lib/auth';
import { initiateInstitutePayment, InstitutePaymentOptions, InstitutePaymentInstance } from '@/lib/institute-payment';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingToast } from '@/components/ui/loading-toast';
import { 
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Upload,
  Plus,
  X,
  BookOpen,
  Users,
  Award,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Briefcase,
  Eye,
  EyeOff,
  Camera,
  ImageIcon
} from 'lucide-react';

type FacultyMember = {
  name: string;
  position: string;
  specialization: string;
  experience: string;
  publications: string;
  avatarDataUrl: string;
};

type Recruiter = {
  name: string;
  logoDataUrl: string;
};

type InstituteFormState = {
  // Basic Information
  name: string;
  type: string;
  city: string;
  state: string;
  description: string;
  established: string;
  website: string;
  // SEO/Discovery
  keywords: string[];
  // Contact Information
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  // Institution Details
  totalStudents: string;
  accreditations: string[];
  nirfRanking: string;
  qsRanking: string;
  timesRanking: string;
  // Excellence in Education
  excellenceInEducation: string;
  // Placement Information
  placementRate: string;
  averagePackage: string;
  highestPackage: string;
  // Media
  logoDataUrl: string;
  imageDataUrls: string[];
};

const RegisterInstitute = () => {
  const router = useRouter();
  const loginStore = useAuthStore(state => state.login);
  const [activeTab, setActiveTab] = useState("basic");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const { toast } = useToast();
  const [emailError, setEmailError] = useState<string>('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [courses, setCourses] = useState([{ name: '', duration: '', fees: '', seats: '', cutoff: '', viewDetailsLink: '', applyNowLink: '' }]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([{ name: '', position: '', specialization: '', experience: '', publications: '', avatarDataUrl: '' }]);
  const [settings, setSettings] = useState<any>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentInstance, setPaymentInstance] = useState<InstitutePaymentInstance | null>(null);
  const [facilities, setFacilities] = useState(['']);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([{ name: '', logoDataUrl: '' }]);
  const [keywordText, setKeywordText] = useState('');
  const [showLoadingToast, setShowLoadingToast] = useState(false);
  const [loadingToastData, setLoadingToastData] = useState({ title: '', description: '' });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Clear payment instance when form is reset or component unmounts
  useEffect(() => {
    return () => {
      setPaymentInstance(null);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        // Handle both old and new response formats
        if (data.success && data.settings) {
          setSettings(data.settings);
        } else if (data.paidRegistration !== undefined) {
          // Old format - direct settings object
          setSettings(data);
        } else {
          console.error('Unexpected settings response format:', data);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };
  const [fileResetKey, setFileResetKey] = useState(0);

  const [formData, setFormData] = useState<InstituteFormState>({
    // Basic Information
    name: '',
    type: '',
    city: '',
    state: '',
    description: '',
    established: '',
    website: '',
    
    // SEO/Discovery
    keywords: [],
    
    // Contact Information
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    
    // Institution Details
    totalStudents: '',
    accreditations: [],
    nirfRanking: '',
    qsRanking: '',
    timesRanking: '',
    
    // Excellence in Education
    excellenceInEducation: '',
    
    // Placement Information
    placementRate: '',
    averagePackage: '',
    highestPackage: '',
    
    // Media (store file previews as data URLs)
    logoDataUrl: '',
    imageDataUrls: []
  });

  const instituteTypes = [
    "Engineering", "Medical", "Management", "Design", "University", 
    "Arts & Science", "Law", "Pharmacy", "Agriculture", "Architecture"
  ];

  const states = [
    "Kerala", "Karnataka", "Tamil Nadu", "Maharashtra", "Delhi", "Gujarat",
    "Rajasthan", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Other"
  ];

  const accreditationOptions = [
    "NAAC A++", "NAAC A+", "NAAC A", "NBA", "AICTE", "UGC", "NIRF", "ISO Certified"
  ];

  const addCourse = () => {
    setCourses([...courses, { name: '', duration: '', fees: '', seats: '', cutoff: '', viewDetailsLink: '', applyNowLink: '' }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const updated = courses.map((course, i) => 
      i === index ? { ...course, [field]: value } : course
    );
    setCourses(updated);
  };

  const addFaculty = () => {
    setFaculty([...faculty, { name: '', position: '', specialization: '', experience: '', publications: '', avatarDataUrl: '' }]);
  };

  const removeFaculty = (index: number) => {
    setFaculty(faculty.filter((_, i) => i !== index));
  };

  const updateFaculty = (index: number, field: keyof FacultyMember, value: string) => {
    const updated = faculty.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setFaculty(updated);
  };

  const addFacility = () => {
    setFacilities([...facilities, '']);
  };

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const updateFacility = (index: number, value: string) => {
    const updated = facilities.map((facility, i) => 
      i === index ? value : facility
    );
    setFacilities(updated);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setFormData(prev => ({ ...prev, logoDataUrl: dataUrl }));
  };

  const handleCampusImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    const limited = files.slice(0, 5);
    const dataUrls = await Promise.all(limited.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    setFormData(prev => ({ ...prev, imageDataUrls: dataUrls }));
  };

  const addRecruiter = () => {
    setRecruiters([...recruiters, { name: '', logoDataUrl: '' }]);
  };

  const removeRecruiter = (index: number) => {
    setRecruiters(recruiters.filter((_, i) => i !== index));
  };

  const updateRecruiter = (index: number, field: keyof Recruiter, value: string) => {
    const updated = recruiters.map((recruiter, i) => 
      i === index ? { ...recruiter, [field]: value } : recruiter
    );
    setRecruiters(updated);
  };

  const addKeyword = () => {
    const candidate = keywordText.trim();
    if (!candidate) return;
    const exists = formData.keywords.some(k => k.toLowerCase() === candidate.toLowerCase());
    if (exists) {
      setKeywordText('');
      return;
    }
    setFormData(prev => ({ ...prev, keywords: [...prev.keywords, candidate] }));
    setKeywordText('');
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({ ...prev, keywords: prev.keywords.filter((_, i) => i !== index) }));
  };

  const handleAccreditationChange = (accreditation: string, checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        accreditations: [...prev.accreditations, accreditation]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        accreditations: prev.accreditations.filter(acc => acc !== accreditation)
      }));
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || email.length < 3) {
      setEmailError('');
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (!response.ok) {
        setEmailError(data.error || 'Email validation failed');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Email check error:', error);
      setEmailError('Failed to check email availability');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    setEmailError('');
    
    // Debounce email validation
    const timeoutId = setTimeout(() => {
      checkEmailAvailability(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    const validationErrors = [];

    // Check required fields
    if (!formData.name || formData.name.trim() === '') {
      validationErrors.push('Institution name is required');
    }
    if (!formData.type || formData.type.trim() === '') {
      validationErrors.push('Institution type is required');
    }
    if (!formData.city || formData.city.trim() === '') {
      validationErrors.push('City is required');
    }
    if (!formData.state || formData.state.trim() === '') {
      validationErrors.push('State is required');
    }
    if (!formData.description || formData.description.trim() === '') {
      validationErrors.push('Institution description is required');
    }
    if (!formData.established || formData.established.trim() === '') {
      validationErrors.push('Year established is required');
    }
    if (!formData.phone || formData.phone.trim() === '') {
      validationErrors.push('Phone number is required');
    }
    if (!formData.email || formData.email.trim() === '') {
      validationErrors.push('Email address is required');
    }
    if (!formData.password || formData.password.trim() === '') {
      validationErrors.push('Password is required');
    }
    if (!formData.address || formData.address.trim() === '') {
      validationErrors.push('Complete address is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      validationErrors.push('Invalid email format');
    }

    // Validate password strength
    if (formData.password && formData.password.length < 6) {
      validationErrors.push('Password must be at least 6 characters long');
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      validationErrors.push('Invalid phone number format');
    }

    // Validate year established
    const currentYear = new Date().getFullYear();
    const establishedYear = parseInt(formData.established);
    if (formData.established && (isNaN(establishedYear) || establishedYear < 1800 || establishedYear > currentYear)) {
      validationErrors.push('Invalid year established (must be between 1800 and current year)');
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(', '),
        variant: "destructive",
      });
      return;
    }

    // Start submission process
    setIsSubmitting(true);
    
    // Show loading toast
    setLoadingToastData({
      title: "Processing Registration",
      description: "Please wait while we process your institute registration..."
    });
    setShowLoadingToast(true);

    // Check if paid registration is enabled
    if (settings?.paidRegistration) {
      // Handle paid registration with payment
      await handlePaidRegistration();
    } else {
      // Handle free registration
      await handleFreeRegistration();
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const tabs = ["basic", "excellence", "contact", "courses", "faculty", "facilities", "placements"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const tabs = ["basic", "excellence", "contact", "courses", "faculty", "facilities", "placements"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handlePaidRegistration = async () => {
    setIsPaymentProcessing(true);
    try {
      const registrationData = {
        ...formData,
        courses,
        faculty,
        facilities,
        recruiters,
      };

      const paymentOptions: InstitutePaymentOptions = {
        amount: settings?.registrationFee || 50,
        currency: 'INR',
        receipt: `inst_reg_${Date.now()}`,
        notes: {
          registrationType: 'institute_registration',
        },
        instituteData: {
          ...registrationData,
        },
      };

      // Update loading toast
      setLoadingToastData({
        title: "Initializing Payment",
        description: `Setting up payment gateway for ₹${settings?.registrationFee || 50}...`
      });

      // Initialize payment
      const paymentInstance: InstitutePaymentInstance = await initiateInstitutePayment(paymentOptions);
      
      // Store the payment instance
      setPaymentInstance(paymentInstance);
      
      // Hide loading toast and show success message
      setShowLoadingToast(false);
      setIsSubmitting(false);
      setIsPaymentProcessing(false);
      
      toast({
        title: "Payment Ready",
        description: `Payment system is ready. Click 'Open Payment' to proceed with ₹${settings?.registrationFee || 50} payment.`,
        variant: "default",
      });
      
    } catch (error: any) {
      // Hide loading toast and show error
      setShowLoadingToast(false);
      setIsSubmitting(false);
      setIsPaymentProcessing(false);
      
      toast({
        title: "Registration Error",
        description: error.message || 'Something went wrong during registration. Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleManualPayment = async () => {
    if (!paymentInstance) {
      toast({
        title: "Payment Not Ready",
        description: "Please complete the form first and click 'Pay & Submit'.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentProcessing(true);
    
    // Show loading toast for payment processing
    setLoadingToastData({
      title: "Processing Payment",
      description: "Please complete the payment in the popup window..."
    });
    setShowLoadingToast(true);
    
    try {
      // Now open the payment modal manually
      const result = await paymentInstance.openPayment();
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        const paymentResult = result as any;
        
        // Update loading toast to success
        setLoadingToastData({
          title: "Registration Successful!",
          description: "Your institute has been registered successfully."
        });
        
        // Show success state briefly
        setTimeout(() => {
          setShowLoadingToast(false);
          setIsSuccess(true);
          setRegistrationId(paymentResult.registrationId || '');
          
          // Store success data before showing overlay
          setSuccessData({
            instituteName: formData.name,
            registrationId: paymentResult.registrationId || '',
            paymentId: paymentResult.paymentId || ''
          });
          
          // Show success overlay
          setShowSuccessOverlay(true);
          
          toast({
            title: "Registration Successful!",
            description: `Your institute registration has been completed successfully. Payment ID: ${paymentResult.paymentId}`,
            variant: "default",
          });

          // Automatically log in the user
          const storeUser = {
            id: paymentResult.registrationId || '',
            firstName: formData.name,
            lastName: '',
            email: formData.email,
            role: 'institute',
            type: 'institute',
            instituteName: formData.name,
            phone: formData.phone,
            address: formData.address,
            website: formData.website,
            city: formData.city,
            state: formData.state
          };
          loginStore(storeUser as any);

          // Persist minimal identity in localStorage
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('fp_user_email', storeUser.email || '');
              window.localStorage.setItem('fp_user_name', storeUser.instituteName || '');
            }
          } catch {}

          // Refresh the page immediately after successful payment
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      // Hide loading toast and show error
      setShowLoadingToast(false);
      
      if (error.message === 'Payment failed') {
        toast({
          title: "Payment Failed",
          description: 'Payment was cancelled or failed. Please try again.',
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Error",
          description: error.message || 'Something went wrong during registration. Please try again.',
          variant: "destructive",
        });
      }
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleRegisterAnother = () => {
    setShowSuccessOverlay(false);
    setActiveTab('basic');
    setPaymentInstance(null);
    setIsSuccess(false);
    setRegistrationId('');
    setSuccessData(null);
  };

  const handleFreeRegistration = async () => {
    // Update loading toast
    setLoadingToastData({
      title: "Submitting Registration",
      description: "Saving your institute information to our database..."
    });

    // Create registration data
    const registrationData = {
      ...formData,
      courses,
      faculty,
      facilities,
      recruiters,
      registrationId: "REG-INST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      registrationDate: new Date().toLocaleDateString(),
      submittedAt: new Date().toISOString()
    };

    // Persist to DB via API
    try {
      const res = await fetch('/api/institute-registration?status=submitted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      // Update loading toast to success
      setLoadingToastData({
        title: "Registration Successful!",
        description: "Your institute has been registered successfully."
      });

      // Show success state briefly
      setTimeout(() => {
        setShowLoadingToast(false);
        setIsSuccess(true);
        setRegistrationId(registrationData.registrationId);
        
        toast({
          title: "Registration Submitted Successfully!",
          description: `Your institute registration (ID: ${registrationData.registrationId}) has been submitted for review. Welcome to FuturePath!`,
          variant: "default",
        });

        // Automatically log in the user
        if (data?.user) {
          const u = data.user;
          const storeUser = {
            id: u.id || '',
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            role: u.role || 'institute',
            type: u.type || 'institute',
            instituteName: u.instituteName || '',
            phone: u.phone || '',
            address: u.address || '',
            website: u.website || '',
            city: u.city || '',
            state: u.state || ''
          };
          loginStore(storeUser as any);

          // Persist minimal identity in localStorage for quick detection
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('fp_user_email', storeUser.email || '');
              const fullName = storeUser.instituteName || storeUser.firstName || '';
              window.localStorage.setItem('fp_user_name', fullName);
            }
          } catch {}
        }
        
        // Redirect to home page as logged-in user
        router.push('/');

        // Reset all form data
        setFormData({
          // Basic Information
          name: '',
          type: '',
          city: '',
          state: '',
          description: '',
          established: '',
          website: '',
          
          // SEO/Discovery
          keywords: [],
          
          // Contact Information
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          
          // Institution Details
          totalStudents: '',
          accreditations: [],
          nirfRanking: '',
          qsRanking: '',
          timesRanking: '',
          
          // Excellence in Education
          excellenceInEducation: '',
          
          // Placement Information
          placementRate: '',
          averagePackage: '',
          highestPackage: '',
          
          // Media
          logoDataUrl: '',
          imageDataUrls: []
        });

        // Reset dynamic arrays
        setCourses([{ name: '', duration: '', fees: '', seats: '', cutoff: '', viewDetailsLink: '', applyNowLink: '' }]);
        setFaculty([{ name: '', position: '', specialization: '', experience: '', publications: '', avatarDataUrl: '' }]);
        setFacilities(['']);
        setRecruiters([{ name: '', logoDataUrl: '' }]);

        // Reset active tab to basic info
        setActiveTab("basic");
        // Clear file inputs
        setFileResetKey(prev => prev + 1);
      }, 2000);
      
    } catch (error) {
      // Hide loading toast and show error
      setShowLoadingToast(false);
      console.error('Error saving registration:', error);
      toast({
        title: "Error",
        description: 'Failed to save registration. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Register Your Institution
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Join Our 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Register your educational institution to reach thousands of prospective students 
              and showcase your programs, faculty, and achievements.
            </p>
            
            {settings?.paidRegistration && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Registration Fee: ₹{settings?.registrationFee || 50}</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  A one-time registration fee is required to complete your institute registration.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-1">
                <TabsTrigger value="basic" className="text-xs md:text-sm">Basic Info</TabsTrigger>
                <TabsTrigger value="excellence" className="text-xs md:text-sm">Excellence</TabsTrigger>
                <TabsTrigger value="contact" className="text-xs md:text-sm">Contact</TabsTrigger>
                <TabsTrigger value="courses" className="text-xs md:text-sm">Courses</TabsTrigger>
                <TabsTrigger value="faculty" className="text-xs md:text-sm">Faculty</TabsTrigger>
                <TabsTrigger value="facilities" className="text-xs md:text-sm">Facilities</TabsTrigger>
                <TabsTrigger value="placements" className="text-xs md:text-sm">Placements</TabsTrigger>
              </TabsList>

              <form id="instituteForm" onSubmit={handleSubmit} className="mt-8">
                {/* Basic Information */}
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Basic Institution Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Institution Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter institution name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="type">Institution Type *</Label>
                          <Select 
                            value={formData.type} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {instituteTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Enter city"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Select 
                            value={formData.state} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="established">Year Established *</Label>
                          <Input
                            id="established"
                            type="number"
                            value={formData.established}
                            onChange={(e) => setFormData(prev => ({ ...prev, established: e.target.value }))}
                            placeholder="e.g., 1995"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="totalStudents">Total Students</Label>
                          <Input
                            id="totalStudents"
                            value={formData.totalStudents}
                            onChange={(e) => setFormData(prev => ({ ...prev, totalStudents: e.target.value }))}
                            placeholder="e.g., 2500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Official Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://www.example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Institution Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your institution, its vision, mission, and unique features..."
                          rows={4}
                          required
                        />
                      </div>

                      {/* Keywords as Tags */}
                      <div className="space-y-2">
                        <Label htmlFor="keywordInput">Keywords</Label>
                        <div className="flex gap-2">
                          <Input
                            id="keywordInput"
                            value={keywordText}
                            onChange={(e) => setKeywordText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addKeyword();
                              }
                            }}
                            placeholder="Add a keyword and press Enter or +"
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" onClick={addKeyword} aria-label="Add keyword">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {formData.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.keywords.map((kw, idx) => (
                              <span key={`${kw}-${idx}`} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground border border-border/50">
                                {kw}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(idx)}
                                  className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-background/50"
                                  aria-label={`Remove ${kw}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">Used to improve search and discovery of your institute.</p>
                      </div>

                      {/* Accreditations */}
                      <div className="space-y-3">
                        <Label>Accreditations & Certifications</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {accreditationOptions.map(acc => (
                            <div key={acc} className="flex items-center space-x-2">
                              <Checkbox
                                id={acc}
                                checked={formData.accreditations.includes(acc)}
                                onCheckedChange={(checked) => handleAccreditationChange(acc, checked)}
                              />
                              <Label htmlFor={acc} className="text-sm">{acc}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rankings */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Rankings (Optional)</Label>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nirfRanking">NIRF Ranking</Label>
                            <Input
                              id="nirfRanking"
                              type="number"
                              value={formData.nirfRanking}
                              onChange={(e) => setFormData(prev => ({ ...prev, nirfRanking: e.target.value }))}
                              placeholder="e.g., 25"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qsRanking">QS World Ranking</Label>
                            <Input
                              id="qsRanking"
                              value={formData.qsRanking}
                              onChange={(e) => setFormData(prev => ({ ...prev, qsRanking: e.target.value }))}
                              placeholder="e.g., 401-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timesRanking">Times Ranking</Label>
                            <Input
                              id="timesRanking"
                              value={formData.timesRanking}
                              onChange={(e) => setFormData(prev => ({ ...prev, timesRanking: e.target.value }))}
                              placeholder="e.g., 501-600"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Excellence in Education */}
                <TabsContent value="excellence">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Excellence in Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="excellenceInEducation">Excellence Description</Label>
                        <Textarea
                          id="excellenceInEducation"
                          value={formData.excellenceInEducation}
                          onChange={(e) => setFormData(prev => ({ ...prev, excellenceInEducation: e.target.value }))}
                          placeholder="Describe your institution's excellence in education, achievements, awards, research contributions, and what makes you stand out..."
                          rows={6}
                        />
                        <p className="text-sm text-muted-foreground">
                          Highlight your institution's unique strengths, achievements, and what makes you exceptional in the field of education.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contact Information */}
                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+91-XXX-XXX-XXXX"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              placeholder="admissions@example.com"
                              className={emailError ? 'border-red-500' : ''}
                              required
                            />
                            {isCheckingEmail && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                          {emailError && (
                            <p className="text-sm text-red-500 mt-1">{emailError}</p>
                          )}
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Enter secure password"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm your password"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Complete Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter complete address with pincode"
                          rows={3}
                          required
                        />
                      </div>

                      {/* Logo and Images Files */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Institution Media</Label>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="logoFile">Institution Logo</Label>
                            <Input key={`logo-${fileResetKey}`} id="logoFile" type="file" accept="image/*" onChange={handleLogoFileChange} />
                            {formData.logoDataUrl && (
                              <img src={formData.logoDataUrl} alt="Logo preview" className="mt-2 h-14 w-14 object-cover rounded border border-border/50" />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="campusImages">Campus Images (max 5)</Label>
                            <Input key={`campus-${fileResetKey}`} id="campusImages" type="file" accept="image/*" multiple onChange={handleCampusImagesChange} />
                            {formData.imageDataUrls && formData.imageDataUrls.length > 0 && (
                              <div className="mt-2 grid grid-cols-5 gap-2">
                                {formData.imageDataUrls.map((src, i) => (
                                  <img key={i} src={src} alt={`Campus ${i+1}`} className="h-14 w-14 object-cover rounded border border-border/50" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Courses */}
                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Courses & Programs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {courses.map((course, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Course {index + 1}</h4>
                            {courses.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCourse(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                              <Label>Course Name *</Label>
                              <Input
                                value={course.name}
                                onChange={(e) => updateCourse(index, 'name', e.target.value)}
                                placeholder="e.g., B.Tech CSE"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration</Label>
                              <Input
                                value={course.duration}
                                onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                                placeholder="e.g., 4 years"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Annual Fees</Label>
                              <Input
                                value={course.fees}
                                onChange={(e) => updateCourse(index, 'fees', e.target.value)}
                                placeholder="e.g., ₹2.5L"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Total Seats</Label>
                              <Input
                                type="number"
                                value={course.seats}
                                onChange={(e) => updateCourse(index, 'seats', e.target.value)}
                                placeholder="e.g., 120"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Cutoff/Eligibility</Label>
                              <Input
                                value={course.cutoff}
                                onChange={(e) => updateCourse(index, 'cutoff', e.target.value)}
                                placeholder="e.g., JEE: 2000"
                              />
                            </div>
                          </div>

                          {/* Course Action Links */}
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                            <div className="space-y-2">
                              <Label>View Details Link</Label>
                              <Input
                                value={course.viewDetailsLink}
                                onChange={(e) => updateCourse(index, 'viewDetailsLink', e.target.value)}
                                placeholder="https://example.com/course-details"
                                type="url"
                              />
                              <p className="text-xs text-muted-foreground">
                                Link to detailed course information page
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Apply Now Link</Label>
                              <Input
                                value={course.applyNowLink}
                                onChange={(e) => updateCourse(index, 'applyNowLink', e.target.value)}
                                placeholder="https://example.com/apply-now"
                                type="url"
                              />
                              <p className="text-xs text-muted-foreground">
                                Direct application link for this course
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" onClick={addCourse} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Course
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Faculty */}
                <TabsContent value="faculty">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Faculty Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {faculty.map((member, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Faculty Member {index + 1}</h4>
                            {faculty.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFaculty(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                      {/* Faculty Avatar File */}
                          <div className="mb-4">
                            <Label>Profile Picture</Label>
                            <div key={`fac-${fileResetKey}-${index}`}>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const dataUrl = await new Promise<string>((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result as string);
                                  reader.onerror = reject;
                                  reader.readAsDataURL(file);
                                });
                                updateFaculty(index, 'avatarDataUrl', dataUrl);
                              }}
                            />
                            </div>
                            {member.avatarDataUrl && (
                              <img src={member.avatarDataUrl} alt="Faculty avatar" className="mt-2 h-14 w-14 object-cover rounded border border-border/50" />
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                              <Label>Full Name *</Label>
                              <Input
                                value={member.name}
                                onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                                placeholder="Dr. John Doe"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Position</Label>
                              <Input
                                value={member.position}
                                onChange={(e) => updateFaculty(index, 'position', e.target.value)}
                                placeholder="Professor, Head of Dept"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Specialization</Label>
                              <Input
                                value={member.specialization}
                                onChange={(e) => updateFaculty(index, 'specialization', e.target.value)}
                                placeholder="Machine Learning, AI"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Experience</Label>
                              <Input
                                value={member.experience}
                                onChange={(e) => updateFaculty(index, 'experience', e.target.value)}
                                placeholder="15+ years"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Publications</Label>
                              <Input
                                type="number"
                                value={member.publications}
                                onChange={(e) => updateFaculty(index, 'publications', e.target.value)}
                                placeholder="85"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" onClick={addFaculty} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Faculty Member
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Facilities */}
                <TabsContent value="facilities">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Campus Facilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Input
                            value={facility}
                            onChange={(e) => updateFacility(index, e.target.value)}
                            placeholder="e.g., State-of-the-art laboratories"
                            className="flex-1"
                          />
                          {facilities.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFacility(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button type="button" variant="outline" onClick={addFacility} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Facility
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Placements */}
                <TabsContent value="placements">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Placement Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="placementRate">Placement Rate (%)</Label>
                          <Input
                            id="placementRate"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.placementRate}
                            onChange={(e) => setFormData(prev => ({ ...prev, placementRate: e.target.value }))}
                            placeholder="95"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="averagePackage">Average Package</Label>
                          <Input
                            id="averagePackage"
                            value={formData.averagePackage}
                            onChange={(e) => setFormData(prev => ({ ...prev, averagePackage: e.target.value }))}
                            placeholder="₹12.5 LPA"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="highestPackage">Highest Package</Label>
                          <Input
                            id="highestPackage"
                            value={formData.highestPackage}
                            onChange={(e) => setFormData(prev => ({ ...prev, highestPackage: e.target.value }))}
                            placeholder="₹45 LPA"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Top Recruiting Companies</Label>
                        {recruiters.map((recruiter, index) => (
                          <div key={index} className="space-y-3 p-4 border border-border/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Input
                                value={recruiter.name}
                                onChange={(e) => updateRecruiter(index, 'name', e.target.value)}
                                placeholder="e.g., Google, Microsoft, Amazon"
                                className="flex-1"
                              />
                              {recruiters.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRecruiter(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            {/* Company Logo File */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Company Logo</Label>
                              <div key={`rec-${fileResetKey}-${index}`}>
                              <Input type="file" accept="image/*" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const dataUrl = await new Promise<string>((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result as string);
                                  reader.onerror = reject;
                                  reader.readAsDataURL(file);
                                });
                                updateRecruiter(index, 'logoDataUrl', dataUrl);
                              }} className="w-full max-w-xs" />
                              </div>
                              {recruiter.logoDataUrl && (
                                <img src={recruiter.logoDataUrl} alt="Company logo preview" className="mt-2 w-12 h-12 object-cover rounded-lg border border-border/50" />
                              )}
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addRecruiter} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Recruiting Company
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Navigation Section */}
                <div className="flex justify-between items-center pt-8 border-t border-border/50">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={activeTab === "basic"}
                  >
                    ← Previous
                  </Button>
                  
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>All information will be verified before going live</span>
                  </div>
                  
                  <div className="flex gap-4">
                    {activeTab !== "placements" ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        Next →
                      </Button>
                    ) : (
                      <>
                        {settings?.paidRegistration && !paymentInstance ? (
                          <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90" 
                            disabled={isSubmitting || isPaymentProcessing}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isPaymentProcessing ? 'Processing Payment...' : `Pay ₹${settings?.registrationFee} & Submit`}
                          </Button>
                        ) : settings?.paidRegistration && paymentInstance ? (
                          <Button 
                            type="button" 
                            onClick={handleManualPayment}
                            className="bg-green-600 hover:bg-green-700" 
                            disabled={isPaymentProcessing}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isPaymentProcessing ? 'Processing Payment...' : 'Open Payment'}
                          </Button>
                        ) : (
                          <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90" 
                            disabled={isSubmitting}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submit for Review
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </form>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />

      {/* Loading Toast */}
      {showLoadingToast && (
        <LoadingToast
          title={loadingToastData.title}
          description={loadingToastData.description}
          isLoading={!isSuccess}
          isSuccess={isSuccess}
        />
      )}

      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Successful! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your institute has been successfully registered. Welcome to FuturePath!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm text-gray-600">
                <p><strong>Institute:</strong> {successData?.instituteName || 'N/A'}</p>
                <p><strong>Registration ID:</strong> {successData?.registrationId || 'N/A'}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-medium">Submitted</span></p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setShowSuccessOverlay(false);
                  setSuccessData(null);
                  router.push('/');
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Go to Home
              </Button>
              
              <Button 
                onClick={handleRegisterAnother}
                variant="outline"
                className="flex-1"
              >
                Register Another
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterInstitute;