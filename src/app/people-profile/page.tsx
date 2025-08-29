'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProfileLogoutSection } from '@/components/profile-logout-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  BookOpen,
  Heart,
  Star,
  Award,
  Briefcase,
  Save,
  Edit,
  Camera,
  School,
  Building2,
  Target,
  Trophy,
  Plus,
  X,
  LogOut
} from 'lucide-react';
import DeleteProfileButton from '@/components/deleteprofilebutton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth as useFirebaseAuth } from '@/hooks/useAuth';
import { useAuth as useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface PeopleRegistration {
  _id?: string;
  // Personal
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  // Academic / Extra
  studiedInstitution?: string;
  currentInstitute?: string;
  course?: string;
  year?: string;
  cgpa?: string;
  board10th?: string;
  percentage10th?: string;
  board12th?: string;
  percentage12th?: string;
  // Preferences
  interestedFields?: string[];
  preferredLocations?: string[];
  careerGoals?: string;
  // Skills / Achievements
  achievements?: string[];
  skills?: string[];
}

const StudentProfile = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { signOutUser } = useFirebaseAuth();
  const logoutStore = useAuthStore(state => state.logout);

  // Convert file to base64 (like user profile)
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle immediate image upload (like user profile)
  const handleImageUpload = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid image file (JPEG, PNG, GIF, etc.)',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File too large. Max size is 5MB.',
          variant: 'destructive',
        });
        return;
      }

      const base64 = await convertFileToBase64(file);
      setProfileData(prev => ({ ...prev, profilePicture: base64 }));
      
      // Save to database if we have registrationId
      if (registrationId) {
        try {
          await fetch(`/api/people-registration/${registrationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profilePicture: base64 })
          });
          toast({
            title: 'Success!',
            description: 'Profile picture updated successfully',
          });
        } catch (err) {
          console.error('Failed to save profile picture:', err);
          toast({
            title: 'Failed to save profile picture',
            description: 'Profile picture updated locally but failed to save to database',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Profile picture updated',
          description: 'Profile picture updated locally',
        });
      }
    } catch (error) {
      console.error('Profile image upload failed:', error);
      toast({
        title: 'Failed to upload profile picture',
        description: 'An error occurred while uploading the image',
        variant: 'destructive',
      });
    }
  };

  const [profileData, setProfileData] = useState({
    // Personal Information
    name: 'Arjun Menon',
    email: 'arjun.menon@gmail.com',
    phone: '+91-98765-43210',
    dateOfBirth: '1999-05-15',
    gender: 'Male',
    location: 'Kochi, Kerala',
    bio: 'Passionate computer science student interested in machine learning and software development. Currently pursuing B.Tech in Computer Science.',
    
    // Academic Information
    currentInstitute: 'Indian Institute of Technology Kerala',
    course: 'B.Tech Computer Science & Engineering',
    year: '3rd Year',
    cgpa: '8.5',
    board10th: 'CBSE',
    percentage10th: '95.2',
    board12th: 'CBSE',
    percentage12th: '92.8',
    
    // Preferences
    interestedFields: ['Software Development', 'Machine Learning', 'Data Science'],
    preferredLocations: ['Bangalore', 'Hyderabad', 'Mumbai', 'Chennai'],
    careerGoals: 'To become a skilled software engineer and contribute to innovative technology solutions.',
    
    // Additional
    achievements: ['Winner - State Level Programming Contest', 'Dean\'s List - Semester 5', 'Volunteer - Tech Fest 2023'],
    skills: ['Python', 'Java', 'React', 'Node.js', 'Machine Learning'],
    
    profilePicture: '/student-1.jpg'
  });

  const [savedInstitutes, setSavedInstitutes] = useState([
    {
      name: 'Indian Institute of Technology Bombay',
      type: 'Engineering',
      location: 'Mumbai, Maharashtra',
      rating: 4.9,
      savedDate: '2024-01-15'
    },
    {
      name: 'Indian Institute of Science',
      type: 'Research',
      location: 'Bangalore, Karnataka',
      rating: 4.8,
      savedDate: '2024-01-10'
    }
  ]);

  const [reviewsGiven, setReviewsGiven] = useState([
    {
      id: 1,
      instituteName: 'Indian Institute of Technology Kerala',
      rating: 5,
      review: 'Excellent faculty and infrastructure. Great learning environment with world-class facilities.',
      date: '2024-01-20'
    },
    {
      id: 2,
      instituteName: 'National Institute of Technology Calicut',
      rating: 4,
      review: 'Good academic programs but hostel facilities could be improved.',
      date: '2023-12-15'
    }
  ]);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
  const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'];

  // Fetch the logged-in user's people registration and hydrate the UI
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
        if (!email) {
          setError('Please log in to view your people profile.');
          return;
        }
        
        const res = await fetch(`/api/people-registration`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('No people profile found. Please create one.');
            return;
          }
          const err = await res.json().catch(() => ({}));
          setError(err.error || 'Failed to load people profile');
          return;
        }
        const data = await res.json();
        const registrations: PeopleRegistration[] = Array.isArray(data?.registrations) ? data.registrations : [];
        const reg: PeopleRegistration = registrations.find((r: any) => r?.email === email) || (registrations.length ? registrations[0] : {} as any);
        setRegistrationId(reg._id || null);

        // Map DB fields into UI model
        const fullName = `${reg.firstName ?? ''} ${reg.lastName ?? ''}`.trim() || '';
        setProfileData(prev => ({
          ...prev,
          name: fullName || prev.name,
          email: reg.email || prev.email,
          phone: reg.phone || prev.phone,
          dateOfBirth: reg.dateOfBirth || prev.dateOfBirth,
          gender: reg.gender || prev.gender,
          location: reg.location || prev.location,
          bio: reg.bio || prev.bio,
          currentInstitute: reg.currentInstitute || reg.studiedInstitution || prev.currentInstitute,
          course: reg.course || prev.course,
          year: reg.year || prev.year,
          cgpa: reg.cgpa || prev.cgpa,
          board10th: reg.board10th || prev.board10th,
          percentage10th: reg.percentage10th || prev.percentage10th,
          board12th: reg.board12th || prev.board12th,
          percentage12th: reg.percentage12th || prev.percentage12th,
          interestedFields: (reg.interestedFields && reg.interestedFields.length ? reg.interestedFields : prev.interestedFields),
          preferredLocations: (reg.preferredLocations && reg.preferredLocations.length ? reg.preferredLocations : prev.preferredLocations),
          careerGoals: reg.careerGoals || prev.careerGoals,
          achievements: (reg.achievements && reg.achievements.length ? reg.achievements : prev.achievements),
          skills: (reg.skills && reg.skills.length ? reg.skills : prev.skills),
          profilePicture: reg.profilePicture || prev.profilePicture
        }));

        // Fetch saved institutes and reviews
        await fetchSavedInstitutes(email);
        await fetchUserReviews(email);
      } catch (e) {
        setError('Unexpected error while loading people profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email]);

  // Function to fetch saved institutes from user data
  const fetchSavedInstitutes = async (userEmail: string) => {
    try {
      console.log('Fetching saved institutes for user:', userEmail);
      const response = await fetch(`/api/auth/get-user?email=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User data response:', data);
        
        if (data.user && data.user.savedInstitutes && Array.isArray(data.user.savedInstitutes)) {
          const institutes = data.user.savedInstitutes.map((inst: any) => ({
            name: inst.name || 'Unknown Institute',
            type: inst.type || 'Unknown Type',
            location: `${inst.city || ''}, ${inst.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Location not specified',
            rating: 4.5, // Default rating since we don't store this
            savedDate: inst.savedAt || new Date().toISOString()
          }));
          console.log('Mapped saved institutes:', institutes);
          setSavedInstitutes(institutes);
        } else {
          console.log('No saved institutes found for user');
          setSavedInstitutes([]);
        }
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        setSavedInstitutes([]);
      }
    } catch (error) {
      console.error('Error fetching saved institutes:', error);
      setSavedInstitutes([]);
    }
  };

  // Function to fetch user's reviews from reviews database
  const fetchUserReviews = async (userEmail: string) => {
    try {
      console.log('Fetching reviews for user:', userEmail);
      const response = await fetch(`/api/reviews?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews API response:', data);
        
        if (data.success && data.reviews) {
          // Map reviews data to the expected format
          const userReviews = data.reviews.map((review: any) => ({
            id: review._id || review.id || Math.random().toString(),
            instituteName: review.institute || 'Unknown Institute',
            rating: review.rating || 0,
            review: review.content || review.title || 'No review content',
            date: review.createdAt || review.date || new Date().toISOString(),
            course: review.course || '',
            year: review.year || '',
            title: review.title || ''
          }));
          console.log('Mapped reviews:', userReviews);
          setReviewsGiven(userReviews);
        } else {
          console.log('No reviews found for user');
          setReviewsGiven([]);
        }
      } else {
        console.error('Failed to fetch user reviews:', response.status, response.statusText);
        setReviewsGiven([]);
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setReviewsGiven([]);
    }
  };

  const handleSave = async () => {
    if (!registrationId) {
      toast({
        title: 'Cannot save: profile not found.',
        description: 'Cannot save: profile not found.',
        variant: 'destructive',
      });
      return;
    }

    // Split full name into first and last name heuristically
    const name = (profileData as any).name as string;
    const [firstName = '', ...rest] = (name || '').trim().split(' ');
    const lastName = rest.join(' ').trim();

    const payload: Record<string, unknown> = {
      firstName,
      lastName,
      email: profileData.email,
      phone: profileData.phone,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      location: profileData.location,
      bio: profileData.bio,
      profilePicture: profileData.profilePicture,
      currentInstitute: profileData.currentInstitute,
      course: profileData.course,
      year: profileData.year,
      cgpa: profileData.cgpa,
      board10th: profileData.board10th,
      percentage10th: profileData.percentage10th,
      board12th: profileData.board12th,
      percentage12th: profileData.percentage12th,
      careerGoals: profileData.careerGoals,
      interestedFields: profileData.interestedFields,
      preferredLocations: profileData.preferredLocations,
      skills: profileData.skills,
      achievements: profileData.achievements
    };

    try {
      // Save the profile data
      const res = await fetch(`/api/people-registration/${registrationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({
          title: err.error || 'Failed to update profile',
          description: err.error || 'Failed to update profile',
          variant: 'destructive',
        });
        return;
      }
      
      setIsEditing(false);
      toast({
        title: 'Success!',
        description: 'Student profile updated successfully',
      });
      
    } catch (e) {
      toast({
        title: 'Unexpected error while saving profile',
        description: 'Unexpected error while saving profile',
        variant: 'destructive',
      });
    }
  };

  type ArrayFieldKeys = 'skills' | 'achievements' | 'interestedFields' | 'preferredLocations';

  const handleArrayFieldUpdate = (
    field: ArrayFieldKeys,
    index: number,
    value: string
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: ArrayFieldKeys, defaultValue = '') => {
    setProfileData(prev => ({
      ...prev,
      [field]: ([...(prev[field] as string[]), defaultValue])
    }));
  };

  const removeArrayField = (field: ArrayFieldKeys, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: string, i: number) => i !== index)
    }));
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your people profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={profileData.profilePicture || '/student-1.jpg'} 
                    alt="Profile Picture" 
                  />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera button - triggers file input */}
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <Label htmlFor="profile-image-upload" className="cursor-pointer">
                      <Button size="sm" className="rounded-full w-8 h-8 p-0" asChild>
                        <div>
                          <Camera className="w-4 h-4" />
                        </div>
                      </Button>
                      <Input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </Label>
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Student
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    {profileData.year}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                  {profileData.name}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5" />
                    <span>{profileData.currentInstitute}</span>
                  </div>
                      <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{profileData.location}</span>
                      </div>
                </div>
                
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  {profileData.bio}
                </p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button 
                      onClick={handleSave} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="saved">Saved Institutes</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                      Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.name}</div>
                        )}
                      </div>
                      
                          <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.email}</div>
                        )}
                          </div>

                          <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.phone}</div>
                        )}
                          </div>

                          <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your city, state"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.location}</div>
                        )}
                          </div>

                          <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">
                            {new Date(profileData.dateOfBirth).toLocaleDateString()}
                          </div>
                        )}
                            </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditing ? (
                          <Select 
                            value={profileData.gender} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.gender}</div>
                        )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-lg text-foreground min-h-[100px]">
                          {profileData.bio}
                          </div>
                      )}
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>

              {/* Academic Information */}
              <TabsContent value="academic">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Academic Information
                      </CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentInstitute">Current Institute</Label>
                        {isEditing ? (
                          <Input
                            id="currentInstitute"
                            value={profileData.currentInstitute}
                            onChange={(e) => setProfileData(prev => ({ ...prev, currentInstitute: e.target.value }))}
                            placeholder="Enter your current institute"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.currentInstitute}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        {isEditing ? (
                          <Input
                            id="course"
                            value={profileData.course}
                            onChange={(e) => setProfileData(prev => ({ ...prev, course: e.target.value }))}
                            placeholder="Enter your course"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.course}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Current Year</Label>
                        {isEditing ? (
                          <Select 
                            value={profileData.year} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, year: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {yearOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.year}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cgpa">CGPA</Label>
                        {isEditing ? (
                          <Input
                            id="cgpa"
                            type="number"
                            step="0.01"
                            max="10"
                            value={profileData.cgpa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, cgpa: e.target.value }))}
                            placeholder="Enter your CGPA"
                          />
                        ) : (
                          <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.cgpa}/10</div>
                        )}
                          </div>
                        </div>
                        
                    {/* Skills Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Skills</Label>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addArrayField('skills', '')}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {profileData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Input
                                  value={skill}
                                  onChange={(e) => handleArrayFieldUpdate('skills', index, e.target.value)}
                                  placeholder="Enter skill"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeArrayField('skills', index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Badge variant="secondary" className="text-sm">
                                {skill}
                              </Badge>
                            )}
                          </div>
                        ))}
                          </div>
                        </div>
                        
                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Achievements</Label>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addArrayField('achievements', '')}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {profileData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Input
                                  value={achievement}
                                  onChange={(e) => handleArrayFieldUpdate('achievements', index, e.target.value)}
                                  placeholder="Enter achievement"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeArrayField('achievements', index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <div className="p-2 bg-muted/30 rounded-lg text-foreground text-sm flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" />
                                {achievement}
                              </div>
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                      Career Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    {/* Career Goals */}
                    <div className="space-y-2">
                      <Label htmlFor="careerGoals">Career Goals</Label>
                      {isEditing ? (
                        <Textarea
                          id="careerGoals"
                          value={profileData.careerGoals}
                          onChange={(e) => setProfileData(prev => ({ ...prev, careerGoals: e.target.value }))}
                          placeholder="Describe your career goals..."
                          rows={3}
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-lg text-foreground">{profileData.careerGoals}</div>
                      )}
                        </div>
                        
                    {/* Interested Fields */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Interested Fields</Label>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addArrayField('interestedFields', '')}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {profileData.interestedFields.map((field, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Input
                                  value={field}
                                  onChange={(e) => handleArrayFieldUpdate('interestedFields', index, e.target.value)}
                                  placeholder="Enter field of interest"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeArrayField('interestedFields', index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {field}
                              </Badge>
                            )}
                          </div>
                            ))}
                          </div>
                        </div>
                        
                    {/* Preferred Locations */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Preferred Work Locations</Label>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addArrayField('preferredLocations', '')}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                          </div>
                      <div className="space-y-2">
                        {profileData.preferredLocations.map((location, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Input
                                  value={location}
                                  onChange={(e) => handleArrayFieldUpdate('preferredLocations', index, e.target.value)}
                                  placeholder="Enter preferred location"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeArrayField('preferredLocations', index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {location}
                              </Badge>
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>

              {/* Saved Institutes */}
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Saved Institutes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {savedInstitutes.map((institute, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-foreground">{institute.name}</h4>
                              <p className="text-muted-foreground text-sm">{institute.type}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{institute.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-medium">{institute.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Saved on {new Date(institute.savedDate).toLocaleDateString()}
                              </p>
                            </div>
                            </div>
                          </div>
                        ))}
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      My Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviewsGiven.map((review) => (
                        <div key={review.id} className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-foreground">{review.instituteName}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                              </div>
                            </div>
                          <p className="text-muted-foreground mb-2">{review.review}</p>
                          <p className="text-xs text-muted-foreground">
                            Reviewed on {new Date(review.date).toLocaleDateString()}
                          </p>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Delete Profile + Logout Section */}
            <div className="mt-12 pt-8 border-t border-destructive/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2">
                  <Card className="border-destructive/20">
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Once you delete your student profile, there is no going back. Please be certain.
                      </p>
                      <DeleteProfileButton />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <ProfileLogoutSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentProfile;