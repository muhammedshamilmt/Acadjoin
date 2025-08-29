'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProfileLogoutSection } from '@/components/profile-logout-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Save,
  Edit,
  Camera,
  ImageIcon,
  Calendar,
  Eye,
  FileImage,
  Trash2,
  Loader2,
  Crown,
  Clock,
  Wrench,
  Image
} from 'lucide-react';
import institute1 from '../../../public/institute-1.jpg';
import { useAuth as useAuthStore } from '@/lib/auth';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
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
import { useAuth as useFirebaseAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { loadRazorpayScript } from '@/lib/razorpay';
import { MobileTabs } from '@/components/ui/mobile-tabs';
import { Megaphone } from 'lucide-react';

const InstituteProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [dbProfileData, setDbProfileData] = useState<any>(null);
  const [instituteId, setInstituteId] = useState<string>('');
  const [sequentialId, setSequentialId] = useState<number>(1);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [isProcessingFeature, setIsProcessingFeature] = useState(false);
  const [isLandingFeatureEnabled, setIsLandingFeatureEnabled] = useState(false);
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false);
  
  const { user: firebaseUser } = useAuthContext();
  const { user: storeUser } = useAuthStore();

  // Get user email from either Firebase or store
  const userEmail = firebaseUser?.email || storeUser?.email;

  const router = useRouter();
  const { signOutUser } = useFirebaseAuth();
  const logoutStore = useAuthStore(state => state.logout);

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

  // Fetch profile data from database
    const fetchProfileData = async () => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }
      
      try {
        setIsLoading(true);
      console.log('Fetching data for email:', userEmail);
      
      const response = await fetch(`/api/institute-registration?email=${encodeURIComponent(userEmail)}`);
      console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
        console.log('Fetched data:', data);
        
        const registrations = Array.isArray(data)
          ? data
          : (Array.isArray(data?.registrations) ? data.registrations : []);
        const profile = registrations.find((r: any) => r?.email === userEmail) || registrations[0];
        
        if (profile) {
          console.log('Profile data:', profile);
          
          setDbProfileData(profile);
          setInstituteId(profile._id);
          
          // Update local state with database data (instituteRegistrations)
          if (profile.name) setFormData(prev => ({ ...prev, name: profile.name }));
          if (profile.type) setFormData(prev => ({ ...prev, type: profile.type }));
          if (profile.city) setFormData(prev => ({ ...prev, city: profile.city }));
          if (profile.state) setFormData(prev => ({ ...prev, state: profile.state }));
          if (profile.description) setFormData(prev => ({ ...prev, description: profile.description }));
          if (profile.established) setFormData(prev => ({ ...prev, established: profile.established }));
          if (profile.website) setFormData(prev => ({ ...prev, website: profile.website }));
          if (profile.phone) setFormData(prev => ({ ...prev, phone: profile.phone }));
          if (profile.email) setFormData(prev => ({ ...prev, email: profile.email }));
          if (profile.address) setFormData(prev => ({ ...prev, address: profile.address }));
          if (profile.totalStudents) setFormData(prev => ({ ...prev, totalStudents: profile.totalStudents }));
          if (profile.accreditations) setFormData(prev => ({ ...prev, accreditations: profile.accreditations }));
          if (profile.nirfRanking) setFormData(prev => ({ ...prev, nirfRanking: profile.nirfRanking }));
          if (profile.qsRanking) setFormData(prev => ({ ...prev, qsRanking: profile.qsRanking }));
          if (profile.timesRanking) setFormData(prev => ({ ...prev, timesRanking: profile.timesRanking }));
          if (profile.placementRate) setFormData(prev => ({ ...prev, placementRate: profile.placementRate }));
          if (profile.averagePackage) setFormData(prev => ({ ...prev, averagePackage: profile.averagePackage }));
          if (profile.highestPackage) setFormData(prev => ({ ...prev, highestPackage: profile.highestPackage }));
          if (profile.excellenceInEducation) setFormData(prev => ({ ...prev, excellenceInEducation: profile.excellenceInEducation }));

          if (profile.keywords) {
            const kws = Array.isArray(profile.keywords)
              ? profile.keywords
              : String(profile.keywords)
                  .split(',')
                  .map((k: string) => k.trim())
                  .filter(Boolean);
            setFormData(prev => ({ ...prev, keywords: kws }));
          }
  
          if (profile.viewDetailsLink) setFormData(prev => ({ ...prev, viewDetailsLink: profile.viewDetailsLink }));
          if (profile.applyNowLink) setFormData(prev => ({ ...prev, applyNowLink: profile.applyNowLink }));
          
          // Update arrays with proper data handling
          if (profile.courses && Array.isArray(profile.courses)) {
            console.log('Setting courses:', profile.courses);
            setCourses(profile.courses.map((course: any) => ({
              name: course.name || '',
              duration: course.duration || '',
              fees: course.fees || '',
              seats: course.seats || '',
              cutoff: course.cutoff || '',
              viewDetailsLink: course.viewDetailsLink || '',
              applyNowLink: course.applyNowLink || ''
            })));
          }
          
          if (profile.faculty && Array.isArray(profile.faculty)) {
            console.log('Setting faculty:', profile.faculty);
            setFaculty(profile.faculty.map((member: any) => ({
              name: member.name || '',
              position: member.position || '',
              specialization: member.specialization || '',
              experience: member.experience || '',
              publications: member.publications || '',
              avatarDataUrl: member.avatarDataUrl || member.avatarUrl || ''
            })));
          }
          
          if (profile.facilities && Array.isArray(profile.facilities)) {
            console.log('Setting facilities:', profile.facilities);
            setFacilities(profile.facilities.map((facility: any) => facility || ''));
          }
          
          if (profile.recruiters && Array.isArray(profile.recruiters)) {
            console.log('Setting recruiters:', profile.recruiters);
            setRecruiters(profile.recruiters.map((recruiter: any) => ({
              name: recruiter.name || '',
              logoDataUrl: recruiter.logoDataUrl || recruiter.logoUrl || ''
            })));
          }
          
          // Handle placement data specifically
          if (profile.placementRecruiters && Array.isArray(profile.placementRecruiters)) {
            console.log('Setting placement recruiters:', profile.placementRecruiters);
            setRecruiters(profile.placementRecruiters.map((recruiter: any) => ({
              name: recruiter.name || '',
              logoDataUrl: recruiter.logoDataUrl || recruiter.logoUrl || ''
            })));
          } else if (profile.recruiters && Array.isArray(profile.recruiters)) {
            // Fallback to general recruiters if placementRecruiters doesn't exist
            console.log('Setting recruiters (fallback):', profile.recruiters);
            setRecruiters(profile.recruiters.map((recruiter: any) => ({
              name: recruiter.name || '',
              logoDataUrl: recruiter.logoDataUrl || recruiter.logoUrl || ''
            })));
          }
          
          if (profile.imageDataUrls && Array.isArray(profile.imageDataUrls)) {
            console.log('Setting gallery images:', profile.imageDataUrls);
            setGalleryImages(profile.imageDataUrls.map((img: any) => img || ''));
          }
          
          if (profile.ads && Array.isArray(profile.ads)) {
            console.log('Setting ads:', profile.ads);
            const fetchedAds = profile.ads.map((ad: any, index: number) => ({
              id: ad.id || index + 1,
              title: ad.title || '',
              description: ad.description || '',
              active: ad.active !== undefined ? ad.active : true
            }));
            setAds(fetchedAds);
          }
          
          // Handle logo
          if (profile.logoDataUrl) {
            console.log('Setting logo:', profile.logoDataUrl);
            setFormData(prev => ({ ...prev, logo: profile.logoDataUrl }));
          }
          
          if (profile.alumni && Array.isArray(profile.alumni)) {
            console.log('Setting alumni:', profile.alumni);
            setAlumni(profile.alumni.map((alum: any) => ({
              name: alum.name || '',
              company: alum.company || '',
              position: alum.position || '',
              batch: alum.batch || '',
              image: alum.image || '',
              package: alum.package || ''
            })));
          }
        } else {
          console.log('No data found for email:', userEmail);
        }
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      toast.error('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchProfileData();
  }, [userEmail]);

  const [courses, setCourses] = useState([
    { 
      name: 'Computer Science & Engineering', 
      duration: '4 years', 
      fees: '₹2.5L/year', 
      seats: '120', 
      cutoff: 'JEE Advanced: 2000',
      viewDetailsLink: 'https://iitpkd.ac.in/cse-details',
      applyNowLink: 'https://iitpkd.ac.in/apply-cse'
    },
    { 
      name: 'Electrical Engineering', 
      duration: '4 years', 
      fees: '₹2.5L/year', 
      seats: '80', 
      cutoff: 'JEE Advanced: 3500',
      viewDetailsLink: 'https://iitpkd.ac.in/ee-details',
      applyNowLink: 'https://iitpkd.ac.in/apply-ee'
    }
  ]);
  const [faculty, setFaculty] = useState([
    { name: 'Dr. Rajesh Kumar', position: 'Professor & Head, CSE', specialization: 'Machine Learning, AI', experience: '15+ years', publications: '85', avatarDataUrl: '' },
    { name: 'Dr. Priya Sharma', position: 'Associate Professor, EE', specialization: 'Power Systems, Renewable Energy', experience: '12+ years', publications: '62', avatarDataUrl: '' }
  ]);
  const [facilities, setFacilities] = useState([
    'State-of-the-art laboratories',
    '24/7 Library with 50,000+ books',
    'High-speed WiFi campus',
    'Modern hostels for 2000+ students'
  ]);
  const [recruiters, setRecruiters] = useState([
    { name: 'Google', logoDataUrl: '' },
    { name: 'Microsoft', logoDataUrl: '' },
    { name: 'Amazon', logoDataUrl: '' },
    { name: 'TCS', logoDataUrl: '' }
  ]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [ads, setAds] = useState([
    { id: 1, title: 'Summer Engineering Program', description: 'Join our intensive summer program for aspiring engineers', active: true },
    { id: 2, title: 'Research Opportunities', description: 'Undergraduate research positions available', active: true }
  ]);

  const [formData, setFormData] = useState({
    // Basic Information
    name: 'Indian la',
    type: 'Engineering',
    city: 'Palakkad',
    state: 'Kerala',
    description: 'Premier engineering institution with cutting-edge research facilities and excellent placement records. IIT Kerala is known for its innovation-driven curriculum and world-class faculty.',
    established: '2016',
    website: 'https://iitpkd.ac.in',
    
    // SEO/Discovery
    keywords: [] as string[],
    
    // Contact Information
    phone: '+91-491-256-2999',
    email: 'admissions@iitpkd.ac.in',
    address: 'IIT Palakkad Campus, Ahalia Integrated Campus, Kozhippara, Palakkad - 678557',
    
    // Institution Details
    totalStudents: '2500',
    accreditations: ['NAAC A++', 'NBA', 'AICTE'],
    nirfRanking: '28',
    qsRanking: '751-800',
    timesRanking: '401-500',
    
    // Placement Information
    placementRate: '95',
    averagePackage: '12.5',
    highestPackage: '45',
    
    // Excellence in Education
    excellenceInEducation: 'Our institution has been consistently ranked among the top engineering colleges in India. We focus on innovation, research, and practical learning to prepare students for global challenges.',
    

    
    // Action Links
    viewDetailsLink: 'https://iitpkd.ac.in/admissions',
    applyNowLink: 'https://iitpkd.ac.in/apply',
    
    // Media
    logo: null as string | null,
    images: [] as string[]
  });

  const [keywordText, setKeywordText] = useState('');

  // Institute ID (simulating it's 4)
  // const instituteId = 4; // This line is now managed by dbProfileData

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
    setCourses([...courses, { 
      name: '', 
      duration: '', 
      fees: '', 
      seats: '', 
      cutoff: '',
      viewDetailsLink: '',
      applyNowLink: ''
    }]);
  };

  const handleProceedFeaturePurchase = async () => {
    try {
      setIsProcessingFeature(true);
      await loadRazorpayScript();

      const instituteName = (dbProfileData?.name || formData.name || '').toString();
      const instituteEmail = (dbProfileData?.email || formData.email || '').toString();
      const institutePhone = (dbProfileData?.phone || formData.phone || '').toString();

      const amountInRupees = 1999; // Feature on landing page price (INR)

      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInRupees,
          currency: 'INR',
          notes: {
            paymentType: 'landing_page_feature',
            instituteName,
            instituteEmail,
          },
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderRes.json();
      if (!orderData?.success || !orderData?.order?.id) {
        throw new Error('Invalid order response');
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_uygrrtKtEWuv1x',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'FuturePath',
        description: 'Feature your institute on the landing page',
        order_id: orderData.order.id,
        prefill: {
          name: instituteName,
          email: instituteEmail,
          contact: institutePhone,
        },
        notes: {
          feature: 'landing_page',
          instituteName,
          instituteEmail,
        },
        theme: { color: '#3B82F6' },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', () => {
        setIsProcessingFeature(false);
        toast.error('Payment failed. Please try again.');
      });
      razorpay.on('payment.success', async (response: any) => {
        setIsProcessingFeature(false);
        setIsFeatureDialogOpen(false);
        setIsLandingFeatureEnabled(true);
        try {
          if (instituteId) {
            await fetch(`/api/institute-registration/${instituteId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                featuredOnLanding: true,
                featureStatus: 'active',
                featurePurchasedAt: new Date().toISOString(),
                featureOrderId: response?.razorpay_order_id || '',
                featurePaymentId: response?.razorpay_payment_id || '',
              }),
            });
          }
        } catch (_err) {
          // Non-blocking: UI is already updated
        }
        toast.success('Payment successful! Your institute will be featured.');
      });
      razorpay.open();
    } catch (error: any) {
      setIsProcessingFeature(false);
      toast.error(error?.message || 'Could not initiate payment');
    }
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

  const updateFaculty = (index: number, field: string, value: string) => {
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

  const addRecruiter = () => {
    setRecruiters([...recruiters, { name: '', logoDataUrl: '' }]);
  };

  const removeRecruiter = (index: number) => {
    setRecruiters(recruiters.filter((_, i) => i !== index));
  };

  const updateRecruiter = (index: number, field: string, value: string) => {
    const updated = recruiters.map((recruiter, i) => 
      i === index ? { ...recruiter, [field]: value } : recruiter
    );
    setRecruiters(updated);
  };

  const addKeyword = () => {
    const candidate = keywordText.trim();
    if (!candidate) return;
    const exists = (formData.keywords || []).some(k => k.toLowerCase() === candidate.toLowerCase());
    if (exists) {
      setKeywordText('');
      return;
    }
    setFormData(prev => ({ ...prev, keywords: [...(prev.keywords || []), candidate] }));
    setKeywordText('');
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({ ...prev, keywords: (prev.keywords || []).filter((_, i) => i !== index) }));
  };

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const addAd = () => {
    const newId = ads.length > 0 ? Math.max(...ads.map(ad => ad.id)) + 1 : 1;
    setAds([...ads, { id: newId, title: '', description: '', active: true }]);
  };

  const removeAd = (id: number) => {
    setAds(ads.filter(ad => ad.id !== id));
  };

  const updateAd = (id: number, field: string, value: string | boolean) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, [field]: value } : ad));
  };

  // Image handling functions
  const handleLogoUpload = async (file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      setFormData(prev => ({ ...prev, logo: base64 }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const handleFacultyPhotoUpload = async (index: number, file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      const updated = faculty.map((member, i) => 
        i === index ? { ...member, avatarDataUrl: base64 } : member
      );
      setFaculty(updated);
      toast.success('Faculty photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload faculty photo');
    }
  };

  const handleRecruiterLogoUpload = async (index: number, file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      const updated = recruiters.map((recruiter, i) => 
        i === index ? { ...recruiter, logoDataUrl: base64 } : recruiter
      );
      setRecruiters(updated);
      toast.success('Recruiter logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload recruiter logo');
    }
  };

  const handleGalleryImageUpload = async (index: number, file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      const updated = [...galleryImages];
      updated[index] = base64;
      setGalleryImages(updated);
      toast.success('Gallery image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload gallery image');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAccreditationChange = (accreditation: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
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

  const handleSave = async () => {
    if (!instituteId) {
      toast.error('No institute ID found');
      return;
    }

    try {
      // Prepare all data for saving
      const updateData = {
        ...formData,
        // Basic info
        name: formData.name || '',
        type: formData.type || '',
        city: formData.city || '',
        state: formData.state || '',
        description: formData.description || '',
        established: formData.established || '',
        website: formData.website || '',
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address || '',
        totalStudents: formData.totalStudents || '',
        
        // Rankings
        nirfRanking: formData.nirfRanking || '',
        qsRanking: formData.qsRanking || '',
        timesRanking: formData.timesRanking || '',
        
        // Placement data
        placementRate: formData.placementRate || '',
        averagePackage: formData.averagePackage || '',
        highestPackage: formData.highestPackage || '',
        
        // Excellence in Education
              excellenceInEducation: formData.excellenceInEducation || '',
        viewDetailsLink: formData.viewDetailsLink || '',
        applyNowLink: formData.applyNowLink || '',
        
        // Arrays and complex data
        courses: courses.filter(course => course.name.trim() !== '').map(course => ({
          name: course.name || '',
          duration: course.duration || '',
          fees: course.fees || '',
          seats: course.seats || '',
          cutoff: course.cutoff || '',
          viewDetailsLink: course.viewDetailsLink || '',
          applyNowLink: course.applyNowLink || ''
        })),
        faculty: faculty.filter(member => member.name.trim() !== '').map(member => ({
          name: member.name || '',
          position: member.position || '',
          specialization: member.specialization || '',
          experience: member.experience || '',
          publications: member.publications || '',
          avatarDataUrl: member.avatarDataUrl || ''
        })),
        facilities: facilities.filter(facility => facility.trim() !== ''),
        placementRecruiters: recruiters.filter(recruiter => recruiter.name.trim() !== '').map(recruiter => ({
          name: recruiter.name || '',
          logoDataUrl: recruiter.logoDataUrl || ''
        })),
        alumni: alumni.filter(alum => alum.name.trim() !== '').map(alum => ({
          name: alum.name || '',
          company: alum.company || '',
          position: alum.position || '',
          batch: alum.batch || '',
          image: alum.image || '',
          package: alum.package || ''
        })),
        imageDataUrls: galleryImages.filter(img => img && img.trim() !== ''),
        ads: ads.filter(ad => ad.title.trim() !== '').map(ad => ({
          id: ad.id,
          title: ad.title || '',
          description: ad.description || '',
          active: ad.active
        })),
        
        // Images
        logoDataUrl: formData.logo || '',
        
        // Timestamps
        updatedAt: new Date()
      };

      console.log('Saving data:', updateData);

      const response = await fetch(`/api/institute-registration/${instituteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success('Institute profile updated successfully!');
        setIsEditing(false);
        // Refresh data from database
        await fetchProfileData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const deleteInstitute = async () => {
    if (!instituteId) {
      toast.error('No institute ID found');
      return;
    }

    try {
      const response = await fetch(`/api/institute-registration/${instituteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Institute profile deleted successfully!');
        // Redirect to home page or logout
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const [alumni, setAlumni] = useState([
    {
      name: 'Arjun Menon',
      company: 'Google',
      position: 'Software Engineer',
      batch: '2022',
      image: '',
      package: '₹45 LPA'
    },
    {
      name: 'Sneha Krishnan',
      company: 'Microsoft',
      position: 'Product Manager',
      batch: '2021',
      image: '',
      package: '₹35 LPA'
    }
  ]);

  const addAlumni = () => {
    setAlumni([...alumni, { 
      name: '', 
      company: '', 
      position: '', 
      batch: '', 
      image: '',
      package: ''
    }]);
  };

  const removeAlumni = (index: number) => {
    setAlumni(alumni.filter((_, i) => i !== index));
  };

  const updateAlumni = (index: number, field: string, value: string) => {
    setAlumni(alumni.map((alum, i) => 
      i === index ? { ...alum, [field]: value } : alum
    ));
  };

  const handleAlumniImageUpload = async (index: number, file: File) => {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setAlumni(prev => prev.map((alum, i) => 
        i === index ? { ...alum, image: dataUrl } : alum
      ));
    } catch (error) {
      console.error('Error uploading alumni image:', error);
      toast.error('Failed to upload alumni image');
    }
  };

  // Mobile tabs configuration
  const mobileTabs = [
    { value: "basic", label: "Basic Info", icon: <Building2 className="h-4 w-4" /> },
    { value: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
    { value: "courses", label: "Courses", icon: <GraduationCap className="h-4 w-4" /> },
    { value: "faculty", label: "Faculty", icon: <Users className="h-4 w-4" /> },
    { value: "facilities", label: "Facilities", icon: <Building2 className="h-4 w-4" /> },
    { value: "placements", label: "Placements", icon: <Briefcase className="h-4 w-4" /> },
    { value: "excellence", label: "Excellence", icon: <Award className="h-4 w-4" /> },
    { value: "alumni", label: "Alumni", icon: <Users className="h-4 w-4" /> },
    { value: "gallery", label: "Gallery", icon: <Image className="h-4 w-4" /> },
    { value: "ads", label: "Ads", icon: <Megaphone className="h-4 w-4" /> },
  ];

  return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
      {isLoading ? (
        <div className="pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading institute profile...</p>
          </div>
        </div>
      ) : (
        <>
        {/* Hero Section */}
          <section className="pt-24 pb-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
          
          <div className="container mx-auto px-8 relative">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={formData.logo || institute1.src} alt={formData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-3xl">
                        {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                      <div className="absolute -bottom-2 -right-2">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <Button size="sm" className="rounded-full w-8 h-8 p-0" asChild>
                            <div>
                      <Camera className="w-4 h-4" />
                            </div>
                    </Button>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file);
                            }}
                          />
                        </Label>
                      </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                        {formData.type} Institution
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                        Est. {formData.established}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                      {formData.name}
                  </h1>
                  
                    <div className="flex items-center gap-4 text-muted-foreground mb-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                        <span>{formData.city}, {formData.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>NIRF Rank #{formData.nirfRanking}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center md:justify-start">
                    <Button 
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                    >
                      <Edit className="mr-2 w-4 h-4" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* Profile Form */}
        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto">
                {/* Institute ID Display */}
                <div className="mb-6 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Institute ID: <span className="font-mono text-primary">#{sequentialId}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Profile Management</Badge>
                </div>
                
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Mobile tabs - visible on small screens */}
                <div className="md:hidden mb-4">
                  <MobileTabs
                    tabs={mobileTabs}
                    value={activeTab}
                    onValueChange={setActiveTab}
                  />
                </div>
                
                {/* Desktop tabs - visible on medium screens and up */}
                <div className="hidden md:block">
                  <TabsList className="grid w-full grid-cols-10">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="faculty">Faculty</TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    <TabsTrigger value="placements">Placements</TabsTrigger>
                    <TabsTrigger value="excellence">Excellence</TabsTrigger>
                    <TabsTrigger value="alumni">Alumni</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
                  </TabsList>
                </div>



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
                          {isEditing ? (
                            <Input
                              id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter institution name"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.name}</div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="type">Institution Type *</Label>
                            {isEditing ? (
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
                            ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.type}</div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                          {isEditing ? (
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="Enter city"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.city}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                          {isEditing ? (
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
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.state}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="established">Year Established *</Label>
                          {isEditing ? (
                            <Input
                              id="established"
                                 type="number"
                                 value={formData.established}
                                 onChange={(e) => setFormData(prev => ({ ...prev, established: e.target.value }))}
                                 placeholder="e.g., 1995"
                                 min="1800"
                                 max={new Date().getFullYear()}
                            />
                          ) : (
                               <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.established}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalStudents">Total Students</Label>
                          {isEditing ? (
                            <Input
                                id="totalStudents"
                                value={formData.totalStudents}
                                onChange={(e) => setFormData(prev => ({ ...prev, totalStudents: e.target.value }))}
                                placeholder="e.g., 2500"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.totalStudents}</div>
                          )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Official Website</Label>
                          {isEditing ? (
                            <Input
                              id="website"
                              type="url"
                              value={formData.website}
                              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://www.example.com"
                            />
                          ) : (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <a href={formData.website} target="_blank" rel="noopener noreferrer" 
                                 className="text-primary hover:underline">
                                {formData.website}
                              </a>
                            </div>
                          )}
                      </div>

                      <div className="space-y-2">
                          <Label htmlFor="description">Institution Description *</Label>
                        {isEditing ? (
                          <Textarea
                            id="description"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe your institution, its vision, mission, and unique features..."
                            rows={4}
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground min-h-[100px]">
                              {formData.description}
                          </div>
                        )}
                      </div>

                      {/* Keywords */}
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        {isEditing ? (
                          <>
                            <div className="flex gap-2">
                              <Input
                                id="keywords"
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
                            {(formData.keywords || []).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(formData.keywords || []).map((kw: string, idx: number) => (
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
                          </>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {(formData.keywords || []).length > 0 ? (
                              (formData.keywords || []).map((kw: string, idx: number) => (
                                <Badge key={`${kw}-${idx}`} variant="secondary" className="px-3 py-1">{kw}</Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">No keywords added</span>
                            )}
                          </div>
                        )}
                      </div>

                        {/* Accreditations */}
                        <div className="space-y-3">
                          <Label>Accreditations & Certifications</Label>
                          {isEditing ? (
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
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {formData.accreditations.map((acc, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                  {acc}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Rankings */}
                        <div className="space-y-4">
                          <Label className="text-base font-semibold">Rankings (Optional)</Label>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nirfRanking">NIRF Ranking</Label>
                              {isEditing ? (
                                <Input
                                  id="nirfRanking"
                                  type="number"
                                  value={formData.nirfRanking}
                                  onChange={(e) => setFormData(prev => ({ ...prev, nirfRanking: e.target.value }))}
                                  placeholder="e.g., 25"
                                />
                              ) : (
                                <div className="p-3 bg-muted/30 rounded-lg text-foreground">#{formData.nirfRanking}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="qsRanking">QS World Ranking</Label>
                              {isEditing ? (
                                <Input
                                  id="qsRanking"
                                  value={formData.qsRanking}
                                  onChange={(e) => setFormData(prev => ({ ...prev, qsRanking: e.target.value }))}
                                  placeholder="e.g., 401-500"
                                />
                              ) : (
                                <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.qsRanking}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timesRanking">Times Ranking</Label>
                              {isEditing ? (
                                <Input
                                  id="timesRanking"
                                  value={formData.timesRanking}
                                  onChange={(e) => setFormData(prev => ({ ...prev, timesRanking: e.target.value }))}
                                  placeholder="e.g., 501-600"
                                />
                              ) : (
                                <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.timesRanking}</div>
                              )}
                            </div>
                          </div>
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
                          {isEditing ? (
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91-XXX-XXX-XXXX"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.phone}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                          {isEditing ? (
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="admissions@example.com"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.email}</div>
                          )}
                        </div>
                      </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Complete Address *</Label>
                          {isEditing ? (
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="Enter complete address with pincode"
                              rows={3}
                            />
                          ) : (
                            <div className="p-3 bg-muted/30 rounded-lg text-foreground min-h-[80px]">
                              {formData.address}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Courses Tab */}
                  <TabsContent value="courses">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Courses & Programs
                          </div>
                          {isEditing && (
                            <Button onClick={addCourse} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Course
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {courses.map((course, index) => (
                          <div key={index} className="border border-border/30 rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-foreground">Course {index + 1}</h4>
                              {isEditing && courses.length > 1 && (
                                <Button onClick={() => removeCourse(index)} variant="destructive" size="sm">
                                  <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                            <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                                <Label>Course Name</Label>
                              {isEditing ? (
                                  <Input
                                    value={course.name}
                                    onChange={(e) => updateCourse(index, 'name', e.target.value)}
                                    placeholder="e.g., Computer Science & Engineering"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{course.name}</div>
                              )}
                            </div>
                              <div className="space-y-2">
                                <Label>Duration</Label>
                                {isEditing ? (
                                  <Input
                                    value={course.duration}
                                    onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                                    placeholder="e.g., 4 years"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{course.duration}</div>
                                )}
                        </div>
                              <div className="space-y-2">
                                <Label>Fees</Label>
                                {isEditing ? (
                                  <Input
                                    value={course.fees}
                                    onChange={(e) => updateCourse(index, 'fees', e.target.value)}
                                    placeholder="e.g., ₹2.5L/year"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{course.fees}</div>
                          )}
                      </div>
                        <div className="space-y-2">
                                <Label>Total Seats</Label>
                              {isEditing ? (
                                  <Input
                                    value={course.seats}
                                    onChange={(e) => updateCourse(index, 'seats', e.target.value)}
                                    placeholder="e.g., 120"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{course.seats}</div>
                              )}
                            </div>
                        </div>
                            <div className="space-y-2">
                              <Label>Admission Cutoff</Label>
                              {isEditing ? (
                                <Input
                                  value={course.cutoff}
                                  onChange={(e) => updateCourse(index, 'cutoff', e.target.value)}
                                  placeholder="e.g., JEE Advanced: 2000"
                                />
                              ) : (
                                <div className="p-3 bg-muted/30 rounded-lg text-foreground">{course.cutoff}</div>
                              )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>View Details Link</Label>
                                {isEditing ? (
                                  <Input
                                    value={course.viewDetailsLink}
                                    onChange={(e) => updateCourse(index, 'viewDetailsLink', e.target.value)}
                                    placeholder="https://your-institute.com/course-details"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">
                                    {course.viewDetailsLink ? (
                                      <a href={course.viewDetailsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {course.viewDetailsLink}
                                      </a>
                                    ) : (
                                      'Not specified'
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label>Apply Now Link</Label>
                                {isEditing ? (
                                  <Input
                                    value={course.applyNowLink}
                                    onChange={(e) => updateCourse(index, 'applyNowLink', e.target.value)}
                                    placeholder="https://your-institute.com/apply-course"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">
                                    {course.applyNowLink ? (
                                      <a href={course.applyNowLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {course.applyNowLink}
                                      </a>
                                    ) : (
                                      'Not specified'
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                  {/* Faculty Tab */}
                  <TabsContent value="faculty">
                  <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Faculty & Staff
                          </div>
                          {isEditing && (
                            <Button onClick={addFaculty} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Faculty
                            </Button>
                          )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {faculty.map((member, index) => (
                          <div key={index} className="border border-border/30 rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-foreground">Faculty Member {index + 1}</h4>
                              {isEditing && faculty.length > 1 && (
                                <Button onClick={() => removeFaculty(index)} variant="destructive" size="sm">
                                    <X className="w-4 h-4" />
                                  </Button>
                          )}
                        </div>
                            <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                                <Label>Name</Label>
                              {isEditing ? (
                                  <Input
                                    value={member.name}
                                    onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                                    placeholder="e.g., Dr. John Smith"
                            />
                          ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{member.name}</div>
                              )}
                            </div>
                        <div className="space-y-2">
                                <Label>Position</Label>
                          {isEditing ? (
                                  <Input
                                    value={member.position}
                                    onChange={(e) => updateFaculty(index, 'position', e.target.value)}
                                    placeholder="e.g., Professor & Head, CSE"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{member.position}</div>
                          )}
                        </div>
                              <div className="space-y-2">
                                <Label>Specialization</Label>
                                {isEditing ? (
                                  <Input
                                    value={member.specialization}
                                    onChange={(e) => updateFaculty(index, 'specialization', e.target.value)}
                                    placeholder="e.g., Machine Learning, AI"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{member.specialization}</div>
                                )}
                      </div>
                              <div className="space-y-2">
                                <Label>Experience</Label>
                                {isEditing ? (
                                  <Input
                                    value={member.experience}
                                    onChange={(e) => updateFaculty(index, 'experience', e.target.value)}
                                    placeholder="e.g., 15+ years"
                                  />
                                ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground">{member.experience}</div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Publications</Label>
                              {isEditing ? (
                                <Input
                                  value={member.publications}
                                  onChange={(e) => updateFaculty(index, 'publications', e.target.value)}
                                  placeholder="e.g., 85"
                                />
                              ) : (
                                <div className="p-3 bg-muted/30 rounded-lg text-foreground">{member.publications}</div>
                              )}
                      </div>

                            {/* Faculty Image Upload */}
                            {isEditing && (
                              <div className="space-y-2">
                                <Label>Faculty Photo</Label>
                                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground mb-2">Upload faculty photo</p>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="max-w-xs mx-auto"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFacultyPhotoUpload(index, file);
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {/* Display Faculty Photo */}
                            {member.avatarDataUrl && (
                              <div className="space-y-2">
                                <Label>Current Photo</Label>
                                <div className="w-24 h-24 rounded-lg overflow-hidden border">
                                  <img 
                                    src={member.avatarDataUrl} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                  {/* Facilities Tab */}
                <TabsContent value="facilities">
                  <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                        Facilities & Infrastructure
                          </div>
                          {isEditing && (
                            <Button onClick={addFacility} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Facility
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {facilities.length > 0 ? (
                          facilities.map((facility, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border border-border/30 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                              <div className="flex-1">
                              {isEditing ? (
                                  <Input
                                    value={facility}
                                    onChange={(e) => updateFacility(index, e.target.value)}
                                    placeholder="e.g., State-of-the-art laboratories"
                                  />
                                ) : (
                                  <span className="text-foreground">{facility || 'No description'}</span>
                          )}
                        </div>
                              {isEditing && facilities.length > 1 && (
                                <Button onClick={() => removeFacility(index)} variant="destructive" size="sm">
                                    <X className="w-4 h-4" />
                                  </Button>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No facilities listed yet</p>
                            {isEditing && (
                              <Button onClick={addFacility} className="mt-4">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Facility
                              </Button>
                              )}
                            </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>

                  {/* Placements Tab */}
                  <TabsContent value="placements">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          Placement Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="placementRate">Placement Rate (%)</Label>
                              {isEditing ? (
                                  <Input
                                id="placementRate"
                                type="number"
                                value={formData.placementRate}
                                onChange={(e) => setFormData(prev => ({ ...prev, placementRate: e.target.value }))}
                                placeholder="e.g., 95"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">{formData.placementRate}%</div>
                          )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="averagePackage">Average Package (LPA)</Label>
                          {isEditing ? (
                            <Input
                                id="averagePackage"
                                value={formData.averagePackage}
                                onChange={(e) => setFormData(prev => ({ ...prev, averagePackage: e.target.value }))}
                                placeholder="e.g., 12.5"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">₹{formData.averagePackage} LPA</div>
                          )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="highestPackage">Highest Package (LPA)</Label>
                          {isEditing ? (
                            <Input
                                id="highestPackage"
                                value={formData.highestPackage}
                                onChange={(e) => setFormData(prev => ({ ...prev, highestPackage: e.target.value }))}
                                placeholder="e.g., 45"
                            />
                          ) : (
                              <div className="p-3 bg-muted/30 rounded-lg text-foreground">₹{formData.highestPackage} LPA</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Top Recruiters</Label>
                          {isEditing && (
                              <Button onClick={addRecruiter} size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Recruiter
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {recruiters.map((recruiter, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 border border-border/30 rounded-lg">
                                <div className="flex-1">
                          {isEditing ? (
                            <Input
                                      value={recruiter.name}
                                      onChange={(e) => updateRecruiter(index, 'name', e.target.value)}
                                      placeholder="e.g., Google"
                            />
                          ) : (
                                    <span className="text-foreground font-medium">{recruiter.name}</span>
                          )}
                        </div>
                                {isEditing && recruiters.length > 1 && (
                                  <Button onClick={() => removeRecruiter(index)} variant="destructive" size="sm">
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Recruiter Logo Uploads */}
                        {isEditing && (
                          <div className="space-y-4">
                            <Label className="text-base font-semibold">Recruiter Logos</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {recruiters.map((recruiter, index) => (
                                <div key={index} className="space-y-2">
                                  <Label className="text-sm">{recruiter.name || `Recruiter ${index + 1}`}</Label>
                                  <div className="border-2 border-dashed border-border/50 rounded-lg p-3 text-center">
                                    {recruiter.logoDataUrl ? (
                                      <div className="space-y-2">
                                        <img 
                                          src={recruiter.logoDataUrl} 
                                          alt={recruiter.name} 
                                          className="w-16 h-16 mx-auto object-contain rounded"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e) => {
                                              const file = (e.target as HTMLInputElement).files?.[0];
                                              if (file) handleRecruiterLogoUpload(index, file);
                                            };
                                            input.click();
                                          }}
                                        >
                                          Change Logo
                                  </Button>
                        </div>
                                    ) : (
                        <div className="space-y-2">
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                                        <p className="text-xs text-muted-foreground">No logo</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e) => {
                                              const file = (e.target as HTMLInputElement).files?.[0];
                                              if (file) handleRecruiterLogoUpload(index, file);
                                            };
                                            input.click();
                                          }}
                                        >
                                          Upload Logo
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                            </div>
                          ))}
                        </div>
                      </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>

                  {/* Excellence in Education Tab */}
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
                          <Label htmlFor="excellenceInEducation">Excellence in Education</Label>
                          {isEditing ? (
                            <Textarea
                              id="excellenceInEducation"
                              value={formData.excellenceInEducation}
                              onChange={(e) => setFormData(prev => ({ ...prev, excellenceInEducation: e.target.value }))}
                              placeholder="Describe your institution's excellence in education, achievements, and unique offerings..."
                              rows={6}
                            />
                          ) : (
                            <div className="p-4 bg-muted/30 rounded-lg text-foreground min-h-[120px] whitespace-pre-wrap">
                              {formData.excellenceInEducation}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Alumni Success Stories Tab */}
                  <TabsContent value="alumni">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Alumni Success Stories
                          </div>
                          {isEditing && (
                            <Button onClick={addAlumni} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Alumni
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Notable Alumni</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alumni.map((alum, index) => (
                              <div key={index} className="border border-border/30 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">Alumni {index + 1}</h4>
                                  {isEditing && alumni.length > 1 && (
                                    <Button onClick={() => removeAlumni(index)} variant="destructive" size="sm">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Name</Label>
                          {isEditing ? (
                            <Input
                                        value={alum.name}
                                        onChange={(e) => updateAlumni(index, 'name', e.target.value)}
                                        placeholder="e.g., Arjun Menon"
                                        className="text-sm"
                            />
                          ) : (
                                      <div className="text-sm text-foreground">{alum.name}</div>
                          )}
                        </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">Company</Label>
                                    {isEditing ? (
                                      <Input
                                        value={alum.company}
                                        onChange={(e) => updateAlumni(index, 'company', e.target.value)}
                                        placeholder="e.g., Google"
                                        className="text-sm"
                                      />
                                    ) : (
                                      <div className="text-sm text-foreground">{alum.company}</div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs">Position</Label>
                                    {isEditing ? (
                                      <Input
                                        value={alum.position}
                                        onChange={(e) => updateAlumni(index, 'position', e.target.value)}
                                        placeholder="e.g., Software Engineer"
                                        className="text-sm"
                                      />
                                    ) : (
                                      <div className="text-sm text-foreground">{alum.position}</div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs">Batch</Label>
                                    {isEditing ? (
                                      <Input
                                        value={alum.batch}
                                        onChange={(e) => updateAlumni(index, 'batch', e.target.value)}
                                        placeholder="e.g., 2022"
                                        className="text-sm"
                                      />
                                    ) : (
                                      <div className="text-sm text-foreground">{alum.batch}</div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs">Package</Label>
                                    {isEditing ? (
                                      <Input
                                        value={alum.package}
                                        onChange={(e) => updateAlumni(index, 'package', e.target.value)}
                                        placeholder="e.g., ₹45 LPA"
                                        className="text-sm"
                                      />
                                    ) : (
                                      <div className="text-sm text-foreground font-medium text-primary">{alum.package}</div>
                                    )}
                                  </div>
                                </div>

                                {/* Alumni Image Upload */}
                        <div className="space-y-2">
                                  <Label className="text-xs">Profile Image</Label>
                          {isEditing ? (
                                    <div className="space-y-2">
                                      {alum.image ? (
                                        <div className="flex items-center gap-3">
                                          <Avatar className="w-12 h-12">
                                            <AvatarImage src={alum.image} alt={alum.name} />
                                            <AvatarFallback>{alum.name?.charAt(0) || 'A'}</AvatarFallback>
                                          </Avatar>
                                          <Button
                                            onClick={() => updateAlumni(index, 'image', '')}
                                            variant="outline"
                                            size="sm"
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                                          <FileImage className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                          <p className="text-xs text-muted-foreground mb-2">Upload alumni photo</p>
                                          <Input
                                            type="file"
                                            accept="image/*"
                                            className="max-w-xs mx-auto"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleAlumniImageUpload(index, file);
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-12 h-12">
                                        <AvatarImage src={alum.image} alt={alum.name} />
                                        <AvatarFallback>{alum.name?.charAt(0) || 'A'}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-muted-foreground">
                                        {alum.image ? 'Image uploaded' : 'No image uploaded'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>


                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Gallery Tab */}
                  <TabsContent value="gallery">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Institute Gallery
                          </div>
                          {isEditing && (
                            <Button onClick={addGalleryImage} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Image
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {galleryImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square border border-border/30 rounded-lg overflow-hidden bg-muted/30">
                                {image ? (
                                  <img 
                                    src={image} 
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileImage className="w-8 h-8 text-muted-foreground" />
                        </div>
                                )}
                              </div>
                              {isEditing && (
                                <>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    {!image && (
                                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                        <Upload className="w-4 h-4" />
                                      </Button>
                                    )}
                                    {galleryImages.length > 1 && (
                                  <Button
                                    size="sm"
                                        variant="destructive" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => removeGalleryImage(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                    )}
                                  </div>
                                  {!image && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleGalleryImageUpload(index, file);
                                        }}
                                      />
                                      <div className="text-center text-white">
                                        <Upload className="w-6 h-6 mx-auto mb-1" />
                                        <p className="text-xs">Upload Image</p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {!isEditing && galleryImages.length > 0 && (
                          <div className="flex justify-center">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View All Photos
                            </Button>
                      </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>

                  {/* Ads Tab */}
                  <TabsContent value="ads">
                  <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Advertisements & Announcements
                          </div>
                          {isEditing && (
                            <Button onClick={addAd} size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Advertisement
                            </Button>
                          )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {ads.length > 0 ? (
                          ads.map((ad, index) => (
                            <div key={ad.id} className="border border-border/30 rounded-lg p-6 space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Badge variant={ad.active ? "default" : "secondary"}>
                                    {ad.active ? "Active" : "Inactive"}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">Ad ID: #{index + 1}</span>
                                </div>
                                {isEditing && ads.length > 1 && (
                                  <Button onClick={() => removeAd(ad.id)} variant="destructive" size="sm">
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                                  <Label>Advertisement Title</Label>
                          {isEditing ? (
                            <Input
                                      value={ad.title}
                                      onChange={(e) => updateAd(ad.id, 'title', e.target.value)}
                                      placeholder="e.g., Summer Program 2024"
                            />
                          ) : (
                                    <div className="p-3 bg-muted/30 rounded-lg text-foreground font-medium">{ad.title}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                                  <Label>Status</Label>
                          {isEditing ? (
                                    <Select 
                                      value={ad.active ? "active" : "inactive"} 
                                      onValueChange={(value) => updateAd(ad.id, 'active', value === "active")}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="p-3 bg-muted/30 rounded-lg text-foreground">
                                      {ad.active ? "Active" : "Inactive"}
                                    </div>
                                  )}
                                </div>
                        </div>

                        <div className="space-y-2">
                                <Label>Description</Label>
                          {isEditing ? (
                                  <Textarea
                                    value={ad.description}
                                    onChange={(e) => updateAd(ad.id, 'description', e.target.value)}
                                    placeholder="Describe your advertisement..."
                                    rows={3}
                            />
                          ) : (
                                  <div className="p-3 bg-muted/30 rounded-lg text-foreground min-h-[80px]">
                                    {ad.description}
                                  </div>
                          )}
                        </div>

                              {isEditing && (
                        <div className="space-y-2">
                                  <Label>Advertisement Image</Label>
                                  <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">Upload advertisement banner</p>
                            <Input
                                      type="file"
                                      accept="image/*"
                                      className="max-w-xs mx-auto"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No advertisements to display</p>
                            {isEditing && (
                              <Button onClick={addAd} className="mt-4">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Advertisement
                              </Button>
                          )}
                        </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              </div>
            </div>
          </section>

          {/* Sidebar - Institute ID display in small view */}
          <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-10 hidden lg:block">
            <Card className="p-4 bg-background/95 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Institute</p>
                <p className="text-2xl font-bold text-primary">#{sequentialId}</p>
                <p className="text-xs text-muted-foreground mt-1">Profile</p>
              </div>
            </Card>
          </div>

          {/* Delete Account Section */}
          <section className="py-8">
            <div className="container mx-auto px-8">
              <div className="max-w-6xl mx-auto">


              {/* Database Institute Data Section */}
              <div className="mt-12 pt-8 border-t border-border/50">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Database Institute Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dbProfileData ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">Institute Details</h4>
                          <div className="space-y-2 text-sm">
                                                            <p><span className="font-medium">Institute ID:</span> #{sequentialId}</p>
                            <p><span className="font-medium">Email:</span> {String(dbProfileData.email || 'Not specified')}</p>
                            <p><span className="font-medium">Name:</span> {String(dbProfileData.name || 'Not specified')}</p>
                            <p><span className="font-medium">Type:</span> {String(dbProfileData.type || 'Not specified')}</p>
                            <p><span className="font-medium">Status:</span> {String(dbProfileData.status || 'Not specified')}</p>
                            <p><span className="font-medium">Created:</span> {dbProfileData.createdAt ? new Date(dbProfileData.createdAt).toLocaleDateString('en-GB') : 'Not specified'}</p>
                            <p><span className="font-medium">Updated:</span> {dbProfileData.updatedAt ? new Date(dbProfileData.updatedAt).toLocaleDateString('en-GB') : 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">Raw Data</h4>
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <pre className="text-xs overflow-auto max-h-40">
                              {JSON.stringify(dbProfileData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground mb-4">
                          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No Institute Data Found</p>
                          <p className="text-sm">This profile doesn't have any institute data in the database yet.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Premium Features Section */}
              <div className="mt-12 pt-8 border-t border-border/50">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Premium Features
                    </CardTitle>
                    <CardDescription>
                      Unlock premium features to enhance your institute's visibility and reach
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Show Ads Toggle */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <div>
                              <h4 className="font-semibold text-foreground">Show Ads</h4>
                              <p className="text-sm text-muted-foreground">Display your advertisements to potential students</p>
                            </div>
                          </div>
                          <div className="relative">
                            <Switch disabled />
                            <div className="absolute inset-0 bg-muted/50 rounded-md cursor-not-allowed"></div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Coming Soon</span>
                          </div>
                          <p className="text-xs text-yellow-700 mt-1">This feature will be available in the next update</p>
                        </div>
                      </div>

                      {/* Show in Landing Page Toggle */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <div>
                              <h4 className="font-semibold text-foreground">Show in Landing Page</h4>
                              <p className="text-sm text-muted-foreground">Feature your institute on the main landing page</p>
                            </div>
                          </div>
                          <div className="relative">
                            <Switch 
                              checked={isLandingFeatureEnabled}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setIsFeatureDialogOpen(true);
                                } else {
                                  setIsDisableConfirmOpen(true);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Pricing</div>
                              <div className="text-2xl font-bold">₹1,999 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span></div>
                              <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                                <li>✓ Featured on landing page</li>
                                <li>✓ Priority visibility</li>
                                <li>✓ Boosted impressions</li>
                              </ul>
                            </div>
                            <div className="hidden md:block w-full h-28 rounded-lg overflow-hidden">
                              <img src="/institute-1.jpg" alt="Feature Preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 pt-8 border-t border-destructive/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-2">
                    <Card className="border-destructive/20">
                      <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Once you delete your institute profile, there is no going back. Please be certain.
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete Institute Profile
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Your Institute Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete your institute profile? This action cannot be undone. 
                                All your data, including courses, faculty, facilities, and other information will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={deleteInstitute}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Profile
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    {/* Side logout section */}
                    <ProfileLogoutSection />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        {/* Feature Purchase Dialog */}
        <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
          <DialogContent className="max-w-3xl p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Details & Price */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>Feature on Landing Page</DialogTitle>
                  <DialogDescription>
                    Boost your institute's visibility by appearing on the main landing page
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-3">
                  <div className="text-3xl font-bold">₹1,999 <span className="text-base font-normal text-muted-foreground">/ 30 days</span></div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Priority placement on homepage</li>
                    <li>✓ Higher discovery by students</li>
                    <li>✓ Premium badge on listing</li>
                  </ul>
                  <div className="text-xs text-muted-foreground">Prefill contact: {dbProfileData?.phone || formData.phone || 'Not available'}</div>
                </div>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsFeatureDialogOpen(false)} disabled={isProcessingFeature}>Cancel</Button>
                  <Button onClick={handleProceedFeaturePurchase} disabled={isProcessingFeature}>
                    {isProcessingFeature ? 'Processing...' : 'Proceed to Pay'}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right: Image */}
              <div className="relative bg-muted/20 min-h-[280px] md:min-h-full rounded-br-lg rounded-tr-lg overflow-hidden">
                <img src="/institute-1.jpg" alt="Feature Preview" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Disable confirmation dialog */}
        <AlertDialog open={isDisableConfirmOpen} onOpenChange={setIsDisableConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Turn off landing page feature?</AlertDialogTitle>
              <AlertDialogDescription>
                Your institute will no longer appear on the landing page. You can enable it again anytime by purchasing the feature.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDisableConfirmOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsLandingFeatureEnabled(false);
                  setIsDisableConfirmOpen(false);
                  (async () => {
                    try {
                      if (instituteId) {
                        await fetch(`/api/institute-registration/${instituteId}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            featuredOnLanding: false,
                            featureStatus: 'inactive',
                            featureDisabledAt: new Date().toISOString(),
                          }),
                        });
                      }
                    } catch (_err) {
                      // non-blocking
                    }
                  })();
                  toast.success('Landing page feature disabled');
                }}
              >
                Turn Off
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
      )}
      </div>
  );
};

export default InstituteProfile;

