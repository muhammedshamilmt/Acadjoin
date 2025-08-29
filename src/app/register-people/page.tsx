'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth as useAuthStore } from '@/lib/auth';
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
import { 
  User,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Upload,
  Plus,
  X,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  School,
  Trophy,
  Target
} from 'lucide-react';

const RegisterPeople = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loginStore = useAuthStore(state => state.login);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [skills, setSkills] = useState<string[]>(['']);
  const [specializations, setSpecializations] = useState<string[]>(['']);
  const [interestedFields, setInterestedFields] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    bio: '',
    studiedInstitution: '',
    profilePicture: null as File | null,
    profilePictureDataUrl: '', // Store the data URL for preview and submission
    
    // Career Preferences
    careerGoals: '',
    expectedSalary: '',
    averageResponseTime: '',
    
    // Documents removed from submission
  });

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const responseTimeOptions = ['Within 1 hour', 'Within 4 hours', 'Within 24 hours', 'Within 48 hours', 'Flexible'];
  const fieldOptions = ['Software Development', 'Machine Learning', 'Data Science', 'Web Development', 'Mobile Development', 'Cybersecurity', 'DevOps', 'UI/UX Design'];
  const locationOptions = ['Bangalore', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Kolkata', 'Kochi', 'Any'];

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Convert file to data URL (same approach as register-institute)
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        setFormData(prev => ({ 
          ...prev, 
          profilePicture: file,
          profilePictureDataUrl: dataUrl 
        }));
        setProfilePicturePreview(dataUrl);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "File Error",
          description: "Error reading the selected file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({ 
      ...prev, 
      profilePicture: null,
      profilePictureDataUrl: '' 
    }));
    setProfilePicturePreview(null);
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const updateAchievement = (index: number, value: string) => {
    const updated = achievements.map((achievement, i) => 
      i === index ? value : achievement
    );
    setAchievements(updated);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const updated = skills.map((skill, i) => 
      i === index ? value : skill
    );
    setSkills(updated);
  };

  const addSpecialization = () => {
    setSpecializations([...specializations, '']);
  };

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const updateSpecialization = (index: number, value: string) => {
    const updated = specializations.map((specialization, i) => 
      i === index ? value : specialization
    );
    setSpecializations(updated);
  };

  const handleFieldChange = (field: string, checked: boolean) => {
    if (checked) {
      setInterestedFields([...interestedFields, field]);
    } else {
      setInterestedFields(interestedFields.filter(f => f !== field));
    }
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setPreferredLocations([...preferredLocations, location]);
    } else {
      setPreferredLocations(preferredLocations.filter(l => l !== location));
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

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      location: '',
      bio: '',
      studiedInstitution: '',
      profilePicture: null,
      profilePictureDataUrl: '',
      careerGoals: '',
      expectedSalary: '',
      averageResponseTime: '',
    });
    
    setAchievements(['']);
    setSkills(['']);
    setSpecializations(['']);
    setInterestedFields([]);
    setPreferredLocations([]);
    setActiveTab("personal");
    setProfilePicturePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (First Name, Last Name, Email, Password)",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create payload with data URL (same approach as register-institute)
      const payload = {
        type: 'individual',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        location: formData.location,
        bio: formData.bio,
        studiedInstitution: formData.studiedInstitution,
        profilePicture: formData.profilePictureDataUrl, // Send the data URL
        // preferences
        careerGoals: formData.careerGoals,
        expectedSalary: formData.expectedSalary,
        averageResponseTime: formData.averageResponseTime,
        interestedFields,
        preferredLocations,
        skills: skills.filter(s=>s.trim()),
        specializations: specializations.filter(s=>s.trim()),
        achievements: achievements.filter(a=>a.trim()),
        // auth
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      console.log('Sending payload:', { ...payload, password: '[HIDDEN]' });

      const res = await fetch('/api/people-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || 'Failed to submit registration',
          variant: "destructive",
        });
        return;
      }

      // Clear form after successful submission
      resetForm();
      
      // Show success message
      toast({
        title: "Success!",
        description: "Profile created successfully! Welcome to EduPath!",
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
          role: u.role || 'individual',
          type: u.type || 'people',
          phone: u.phone || '',
          location: u.location || '',
          bio: u.bio || '',
          studiedInstitution: u.studiedInstitution || ''
        };
        loginStore(storeUser as any);

        // Persist minimal identity in localStorage for quick detection
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('fp_user_email', storeUser.email || '');
            const fullName = `${storeUser.firstName} ${storeUser.lastName}`.trim();
            window.localStorage.setItem('fp_user_name', fullName);
          }
        } catch {}
      }
      
      // Redirect to home page as logged-in user
      router.push('/');

    } catch (err) {
      console.error('Submission error:', err);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
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
              <User className="w-4 h-4 mr-2" />
              Create Your Profile
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Join Our 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Community</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create your student profile to discover the best institutions and connect with 
              educational opportunities that match your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-8">
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
                      {/* Profile Picture Upload */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
                            {profilePicturePreview ? (
                              <img 
                                src={profilePicturePreview} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="text-center">
                                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">Upload Photo</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Upload Button */}
                          <Label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 cursor-pointer">
                            <Button size="sm" className="rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90" asChild>
                              <div>
                                <Upload className="w-4 h-4" />
                              </div>
                            </Button>
                            <Input
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfilePictureChange}
                            />
                          </Label>
                          
                          {/* Remove Button */}
                          {formData.profilePicture && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeProfilePicture}
                              className="absolute -top-2 -left-2 rounded-full bg-red-500 hover:bg-red-600 text-white w-8 h-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {/* File Info */}
                          {formData.profilePicture && (
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                              <p className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                                {formData.profilePicture.name.length > 20 
                                  ? formData.profilePicture.name.substring(0, 20) + '...' 
                                  : formData.profilePicture.name
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Profile Picture Requirements */}
                      <div className="text-center mb-6">
                        <p className="text-sm text-muted-foreground">
                          Upload a professional photo (JPG, PNG, GIF). Max size: 5MB.
                        </p>
                        {formData.profilePicture && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                              ✓ Photo uploaded successfully
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Enter your last name"
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
                              placeholder="your.email@example.com"
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

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+91-XXXXX-XXXXX"
                          />
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

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select 
                            value={formData.gender} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself, your interests, and goals..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studiedInstitution">Studied Institution</Label>
                        <Input
                          id="studiedInstitution"
                          value={formData.studiedInstitution}
                          onChange={(e) => setFormData(prev => ({ ...prev, studiedInstitution: e.target.value }))}
                          placeholder="e.g., University of Technology, College of Engineering"
                        />
                      </div>

                      {/* Skills */}
                      <div className="space-y-3">
                        <Label>Technical Skills</Label>
                        {skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              value={skill}
                              onChange={(e) => updateSkill(index, e.target.value)}
                              placeholder="e.g., Python, Java, React"
                              className="flex-1"
                            />
                            {skills.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSkill(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addSkill} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skill
                        </Button>
                      </div>

                      {/* Specializations */}
                      <div className="space-y-3">
                        <Label>Specializations</Label>
                        {specializations.map((specialization, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              value={specialization}
                              onChange={(e) => updateSpecialization(index, e.target.value)}
                              placeholder="e.g., Frontend Development, Machine Learning, DevOps"
                              className="flex-1"
                            />
                            {specializations.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSpecialization(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addSpecialization} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Specialization
                        </Button>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-3">
                        <Label>Achievements & Awards</Label>
                        {achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              value={achievement}
                              onChange={(e) => updateAchievement(index, e.target.value)}
                              placeholder="e.g., Winner - State Level Programming Contest"
                              className="flex-1"
                            />
                            {achievements.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAchievement(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addAchievement} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </Button>
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
                      <div className="space-y-2">
                        <Label htmlFor="careerGoals">Career Goals</Label>
                        <Textarea
                          id="careerGoals"
                          value={formData.careerGoals}
                          onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                          placeholder="Describe your career aspirations and goals..."
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="expectedSalary">Expected Salary (per annum)</Label>
                          <Input
                            id="expectedSalary"
                            value={formData.expectedSalary}
                            onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                            placeholder="e.g., ₹6-8 LPA"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="averageResponseTime">Average Response Time</Label>
                          <Select 
                            value={formData.averageResponseTime} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, averageResponseTime: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select response time" />
                            </SelectTrigger>
                            <SelectContent>
                              {responseTimeOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Interested Fields */}
                      <div className="space-y-3">
                        <Label>Interested Fields</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {fieldOptions.map(field => (
                            <div key={field} className="flex items-center space-x-2">
                              <Checkbox
                                id={field}
                                checked={interestedFields.includes(field)}
                                onCheckedChange={(checked: boolean) => handleFieldChange(field, checked)}
                              />
                              <Label htmlFor={field} className="text-sm">{field}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Locations */}
                      <div className="space-y-3">
                        <Label>Preferred Work Locations</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {locationOptions.map(location => (
                            <div key={location} className="flex items-center space-x-2">
                              <Checkbox
                                id={location}
                                checked={preferredLocations.includes(location)}
                                onCheckedChange={(checked: boolean) => handleLocationChange(location, checked)}
                              />
                              <Label htmlFor={location} className="text-sm">{location}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Navigation Section */}
                <div className="flex justify-between items-center pt-8 border-t border-border/50">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const tabs = ["personal", "preferences"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                    }}
                    disabled={activeTab === "personal"}
                  >
                    ← Previous
                  </Button>
                  
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>Your profile will be reviewed before going live</span>
                  </div>
                  
                  <div className="flex gap-4">
                    {activeTab !== "preferences" ? (
                      <Button 
                        type="button"
                        onClick={() => {
                          const tabs = ["personal", "preferences"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                        }}
                      >
                        Next →
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
                              resetForm();
                            }
                          }}
                        >
                          Clear Form
                        </Button>
                        <Button type="button" variant="outline">
                          Save as Draft
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Creating Profile...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Create Profile
                            </>
                          )}
                        </Button>
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
    </div>
  );
};

export default RegisterPeople;