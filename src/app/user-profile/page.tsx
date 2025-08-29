'use client'

import React, { useEffect, useRef, useState } from 'react';
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
  Mail,
  Heart,
  Star,
  Save,
  Edit,
  Camera
} from 'lucide-react';
import DeleteProfileButton from '@/components/deleteprofilebutton';
import { useAuth } from '@/lib/auth';
import { uploadFileToStorage, generateUniqueFileName } from '@/lib/utils';
import { toast } from 'sonner';
import { ProfileLogoutSection } from '@/components/profile-logout-section';


interface User {
  _id?: string;
  email?: string;
  name?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  role?: string;
  agreeToTerms?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  savedInstitutes?: Array<{
    instituteId: string;
    name: string;
    type: string;
    city: string;
    state: string;
    logoDataUrl?: string;
    imageDataUrls?: string[];
    nirfRanking?: string;
    qsRanking?: string;
    timesRanking?: string;
    placementRate?: string;
    averagePackage?: string;
    highestPackage?: string;
    savedAt: string;
  }>;
}

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [userDoc, setUserDoc] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    bio: '',
    profilePicture: ''
  });

  const [savedInstitutes, setSavedInstitutes] = useState<Array<{ name: string; type: string; location: string; rating: number; savedDate: string }>>([]);

  const [reviewsGiven, setReviewsGiven] = useState<Array<{ 
    id: string | number; 
    instituteName: string; 
    rating: number; 
    review: string; 
    date: string;
    title?: string;
    course?: string;
    year?: string;
  }>>([]);
  
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    course: '',
    year: '',
    institute: ''
  });

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Fetch the logged-in user's data from users database
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
        if (!email) {
          setError('Please log in to view your profile.');
          return;
        }
        
        const res = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('No user profile found. Please create one.');
            return;
          }
          const err = await res.json().catch(() => ({}));
          setError(err.error || 'Failed to load user profile');
          return;
        }
        const data = await res.json();
        const userData: User = data.user || {};
        setUserId(userData._id || null);
        setUserDoc(userData);

        // Map DB fields into UI model
        setProfileData(prev => {
          const fullName = `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim();
          return ({
          ...prev,
          name: fullName || userData.displayName || userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          location: userData.location || '',
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || ''
        });
        });

        // Set saved institutes from user data
        if (userData.savedInstitutes && Array.isArray(userData.savedInstitutes)) {
          setSavedInstitutes(userData.savedInstitutes.map((inst: any) => ({
            name: inst.name || 'Unknown Institute',
            type: inst.type || 'Unknown Type',
            location: `${inst.city || ''}, ${inst.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Location not specified',
            rating: 4.5, // Default rating since we don't store this
            savedDate: inst.savedAt || new Date().toISOString()
          })));
        }

        // Fetch user's reviews from reviews database
        await fetchUserReviews(email);
      } catch (e) {
        setError('Unexpected error while loading user profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email]);

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

  // Function to start editing a review
  const startEditReview = (review: any) => {
    setEditingReview(review.id as string);
    setEditFormData({
      rating: review.rating,
      title: review.title || '',
      content: review.review,
      course: review.course || '',
      year: review.year || '',
      institute: review.instituteName
    });
  };

  // Function to cancel editing
  const cancelEditReview = () => {
    setEditingReview(null);
    setEditFormData({
      rating: 0,
      title: '',
      content: '',
      course: '',
      year: '',
      institute: ''
    });
  };

  // Function to save edited review
  const saveEditReview = async (reviewId: string) => {
    try {
      const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
      if (!email) {
        toast.error('Please log in to edit reviews');
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          rating: editFormData.rating,
          title: editFormData.title,
          content: editFormData.content,
          course: editFormData.course,
          year: editFormData.year,
          institute: editFormData.institute,
          userEmail: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review updated successfully!');
        // Refresh reviews
        await fetchUserReviews(email);
        setEditingReview(null);
        setEditFormData({
          rating: 0,
          title: '',
          content: '',
          course: '',
          year: '',
          institute: ''
        });
      } else {
        toast.error(data.error || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max size is 5MB.');
        return;
      }

      const ownerKey = userId || profileData.email || 'unknown-user';
      const uniqueName = generateUniqueFileName(file.name);
      const storagePath = `users/${ownerKey}/profile/${uniqueName}`;

      setIsUploadingImage(true);
      const downloadUrl = await uploadFileToStorage(file as File, storagePath);
      setProfileData(prev => ({ ...prev, profilePicture: downloadUrl }));

      // Persist immediately if we have userId
      if (userId) {
        try {
          await fetch(`/api/auth/update-user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profilePicture: downloadUrl })
          });
        } catch (err) {
          console.error('Failed to persist profile picture:', err);
        }
      }
    } catch (err) {
      console.error('Profile image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert('Cannot save: profile not found.');
      return;
    }

    const payload: Record<string, unknown> = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      location: profileData.location,
      bio: profileData.bio,
      profilePicture: profileData.profilePicture
    };

    try {
      const res = await fetch(`/api/auth/update-user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to update profile');
        return;
      }
      setIsEditing(false);
      alert('User profile updated successfully!');
    } catch (e) {
      alert('Unexpected error while saving profile');
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

    const handleLogoUpload = async (file: File) => {
      try {
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error('File too large. Max size is 5MB.');
          return;
        }

        const base64 = await convertFileToBase64(file);
        setProfileData(prev => ({ ...prev, profilePicture: base64 }));
        
        // Save to database if we have userId
        if (userId) {
          try {
            await fetch(`/api/auth/update-user/${userId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profilePicture: base64 })
            });
            toast.success('Profile picture updated successfully');
          } catch (err) {
            console.error('Failed to save profile picture:', err);
            toast.error('Failed to save profile picture');
          }
        } else {
          toast.success('Profile picture updated');
        }
      } catch (error) {
        console.error('Profile image upload failed:', error);
        toast.error('Failed to upload profile picture');
      }
    };


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.profilePicture} alt={profileData.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-3xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
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
                    <User className="w-4 h-4 mr-2" />
                    User
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                  {profileData.name}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.location && (
                      <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{profileData.location}</span>
                      </div>
                  )}
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
                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-button">
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

      {/* Profile Content */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="order-2 md:order-1 md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
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
                    {reviewsGiven.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Found</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't written any reviews yet. Share your experience to help other students!
                        </p>
                        <Button onClick={() => window.location.href = '/reviews'}>
                          Write Your First Review
                        </Button>
                      </div>
                    ) : (
                    <div className="space-y-6">
                      {reviewsGiven.map((review) => (
                          <div key={review.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                            {editingReview === review.id ? (
                              // Edit Form
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold text-foreground text-lg">{review.instituteName}</h4>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => saveEditReview(review.id as string)}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={cancelEditReview}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                      id="edit-title"
                                      value={editFormData.title}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Review title"
                                    />
                                  </div>
                                  <div>
                                    <Label>Rating</Label>
                                    <div className="flex gap-1 mt-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-6 h-6 cursor-pointer transition-colors ${
                                            star <= editFormData.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                          }`}
                                          onClick={() => setEditFormData(prev => ({ ...prev, rating: star }))}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-course">Course</Label>
                                    <Input
                                      id="edit-course"
                                      value={editFormData.course}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, course: e.target.value }))}
                                      placeholder="Course name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-year">Year</Label>
                                    <Input
                                      id="edit-year"
                                      value={editFormData.year}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, year: e.target.value }))}
                                      placeholder="Year/Class"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-content">Review Content</Label>
                                  <Textarea
                                    id="edit-content"
                                    value={editFormData.content}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Write your review..."
                                    rows={4}
                                  />
                                </div>
                              </div>
                            ) : (
                              // Display Mode
                              <>
                          <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground text-lg mb-1">{review.instituteName}</h4>
                                    {review.title && (
                                      <h5 className="text-foreground font-medium mb-1">{review.title}</h5>
                                    )}
                                    {review.course && review.year && (
                                      <div className="text-sm text-muted-foreground mb-2">
                                        {review.course} • {review.year}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 ml-4">
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
                                <p className="text-muted-foreground mb-3 leading-relaxed">{review.review}</p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                  <span>Reviewed on {new Date(review.date).toLocaleDateString()}</span>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => startEditReview(review)}
                                    >
                                      Edit Review
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                      ))}
                    </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Delete Profile Section */}
            <div className="mt-12 pt-8 border-t border-destructive/20">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Once you delete your user profile, there is no going back. Please be certain.
                  </p>
                  <DeleteProfileButton />
                </CardContent>
              </Card>
            </div>
            </div>
            <div className="order-1 md:order-2">
              <ProfileLogoutSection />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default UserProfile;