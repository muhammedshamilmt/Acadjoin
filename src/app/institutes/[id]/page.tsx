'use client'

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InstituteOverview from '@/components/InstituteOverview';
import CoursesSection from '@/components/CoursesSection';
import FacultySection from '@/components/FacultySection';
import PlacementsSection from '@/components/PlacementsSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import { WriteReviewForm, ReviewsList } from '@/components/ReviewComponents';
import { QuickInfoBox, ContactInfoBox, AdmissionDeadlineBox, FeesBreakdownBox, SimilarInstitutesBox, QuickActionsBox } from '@/components/SidebarBoxes';
import { 
  MapPin, 
  Star, 
  Users, 
  GraduationCap,
  Calendar,
  Award,
  Building,
  Phone,
  Mail,
  Globe,
  BookOpen,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

const institute1 = '/institute-1.jpg';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface InstituteData {
  _id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  description: string;
  established: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  totalStudents: string;
  accreditations: string[];
  nirfRanking: string;
  qsRanking: string;
  timesRanking: string;
  placementRate: string;
  averagePackage: string;
  highestPackage: string;
  excellenceInEducation: string;
  viewDetailsLink: string;
  applyNowLink: string;
  logoDataUrl: string;
  imageDataUrls: string[];
  courses: Array<{
    name: string;
    duration: string;
    fees: string;
    seats: string;
    cutoff: string;
    viewDetailsLink: string;
    applyNowLink: string;
  }>;
  faculty: Array<{
    name: string;
    position: string;
    specialization: string;
    experience: string;
    publications: string;
    avatarDataUrl: string;
  }>;
  facilities: string[];
  recruiters: Array<{
    name: string;
    logoDataUrl: string;
  }>;
  alumni: Array<{
    name: string;
    company: string;
    position: string;
    batch: string;
    image: string;
    package: string;
  }>;
  status: string;
  registrationId: string;
  createdAt: string;
  updatedAt: string;
}

const InstituteDetails = ({ params }: PageProps) => {
  // Unwrap Next.js 15 Promise-based params in a Client Component
  const { id } = React.use(params);
  
  // State for institute data
  const [institute, setInstitute] = useState<InstituteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch institute data
  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/institutes/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Institute not found');
          } else {
            setError('Failed to fetch institute data');
          }
          return;
        }
        
        const data = await response.json();
        setInstitute(data);
      } catch (err) {
        console.error('Error fetching institute:', err);
        setError('Failed to fetch institute data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstituteData();
    }
  }, [id]);
  
  // Reviews state (fetched from API)
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Save institute functionality
  const { user, loading: authLoading } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if institute is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user?.email && !window.localStorage.getItem('fp_user_email')) return;
      
      const email = user?.email || window.localStorage.getItem('fp_user_email') || '';
      if (!email || !institute) return;

      try {
        const userResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const savedInstitutes = userData.user.savedInstitutes || [];
          const isAlreadySaved = savedInstitutes.some((saved: any) => saved.instituteId === institute._id);
          setIsSaved(isAlreadySaved);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfSaved();
  }, [user?.email, institute]);

  // Fetch reviews for this institute by name
  useEffect(() => {
    const fetchReviews = async () => {
      if (!institute?.name) return;
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const resp = await fetch(`/api/reviews?institute=${encodeURIComponent(institute.name)}`);
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.error || 'Failed to fetch reviews');
        }
        // Map API reviews to UI format expected by ReviewsList
        const mapped = (data.reviews || []).map((r: any, idx: number) => ({
          id: ((): string => {
            const v = (r as any)._id;
            if (typeof v === 'string') return v;
            if (v && typeof v.toString === 'function') return v.toString();
            return String(idx);
          })(),
          userName: r.userEmail?.split('@')[0] || 'Anonymous',
          rating: r.rating || 0,
          title: r.title || '',
          content: r.content || '',
          date: r.createdAt || new Date().toISOString(),
          helpful: (typeof r?.likes === 'number' ? r.likes : (typeof r?.helpful === 'number' ? r.helpful : 0)),
          course: r.course || '',
          year: r.year || ''
        }));
        setReviews(mapped);
      } catch (e: any) {
        console.error('Failed to load reviews:', e);
        setReviewsError(e?.message || 'Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

    if (institute?.name) {
      fetchReviews();
    }
  }, [institute?.name]);

  const handleReviewSubmit = (reviewData: any) => {
    const newReview = {
      id: reviews.length + 1,
      userName: 'Current User', // This would come from auth context
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    setReviews([newReview, ...reviews]);
  };

  const handleSaveInstitute = async () => {
    const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
    if (!email) {
      alert('Please log in to save institutes');
      return;
    }

    if (!institute) {
      alert('Institute data not available');
      return;
    }

    try {
      setIsSaving(true);
      
      // Get user ID from the users collection
      const userResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }
      
      const userData = await userResponse.json();
      const userId = userData.user._id;
      
      if (!userId) {
        throw new Error('User not found');
      }

      const instituteData = {
        instituteId: institute._id,
        name: institute.name,
        type: institute.type,
        city: institute.city,
        state: institute.state,
        logoDataUrl: institute.logoDataUrl,
        imageDataUrls: institute.imageDataUrls,
        nirfRanking: institute.nirfRanking,
        qsRanking: institute.qsRanking,
        timesRanking: institute.timesRanking,
        placementRate: institute.placementRate,
        averagePackage: institute.averagePackage,
        highestPackage: institute.highestPackage
      };

      if (isSaved) {
        // Unsave the institute
        const response = await fetch('/api/auth/save-institute', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            instituteId: institute._id
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to unsave institute');
        }

        setIsSaved(false);
        // alert('Institute removed from saved list!');
      } else {
        // Save the institute
        const response = await fetch('/api/auth/save-institute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            instituteData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 409) {
            alert('This institute is already saved');
            return;
          }
          throw new Error(errorData.error || 'Failed to save institute');
        }

        setIsSaved(true);
        // alert('Institute saved successfully!');
      }
    } catch (error) {
      console.error('Error saving/unsaving institute:', error);
      // alert(error instanceof Error ? error.message : 'Failed to save/unsave institute');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading institute details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !institute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Institute Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The requested institute could not be found.'}</p>
            <Link href="/institutes">
              <Button>Browse All Institutes</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-8">
          {/* Hero Section */}
          <section className="pb-12 relative overflow-hidden">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
              
              <img 
                src={institute.imageDataUrls?.[0] || institute.logoDataUrl || institute1} 
                alt={institute.name}
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-3xl"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-8 right-8 hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-white text-center">
                    <div className="text-sm opacity-80">NIRF Ranking</div>
                    <div className="text-2xl font-bold">#{institute.nirfRanking || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              {/* Institute Info Overlay */}
              <div className="absolute bottom-12 left-8 right-8 text-white">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-sm font-semibold shadow-lg">
                        ⭐ Featured Institute
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2">
                        {institute.type}
                      </Badge>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text">
                      {institute.name}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/90 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{institute.city}, {institute.state}</span>
                      </div>
                      <div className="hidden md:block w-1 h-1 bg-white/50 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg">Est. {institute.established}</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                      {institute.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <span className="text-3xl font-bold">4.8</span>
                      </div>
                      <div className="text-sm text-white/80">324 reviews</div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        size="lg" 
                        variant="secondary" 
                        className={`backdrop-blur-sm border-white/30 transition-all duration-300 ${
                          isSaved 
                            ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        onClick={handleSaveInstitute}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                        )}
                        {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 relative rounded-3xl mb-16">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] rounded-3xl" />
            <div className="relative px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Institute at a Glance</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the key highlights that make this institution stand out in academic excellence
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-foreground mb-2">{institute.totalStudents || '2.5k+'}</div>
                    <div className="text-sm text-muted-foreground font-medium">Students</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 border border-secondary/10">
                    <Award className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-foreground mb-2">{institute.placementRate || '95%'}</div>
                    <div className="text-sm text-muted-foreground font-medium">Placement</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-foreground mb-2">#{institute.nirfRanking || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground font-medium">NIRF Ranking</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 border border-secondary/10">
                    <BookOpen className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-foreground mb-2">{institute.courses?.length || 0}+</div>
                    <div className="text-sm text-muted-foreground font-medium">Programs</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-foreground mb-2">{institute.accreditations?.length || 0}</div>
                    <div className="text-sm text-muted-foreground font-medium">Accreditations</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <InstituteOverview institute={institute} />

          {/* Courses Section */}
          <CoursesSection courses={institute.courses || []} />

          {/* Faculty Section */}
          <FacultySection faculty={institute.faculty || []} />

          {/* Placements Section */}
          <PlacementsSection recruiters={institute.recruiters || []} />

          {/* Facilities Section */}
          <FacilitiesSection facilities={institute.facilities || []} />

          {/* Contact Section */}
          <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 relative rounded-3xl mb-16">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] rounded-3xl" />
            <div className="relative px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                  Connect with us for admissions, inquiries, and more information about our programs
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Contact Information */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Contact Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {institute.phone && (
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">Phone</div>
                            <div className="font-semibold text-foreground">
                              <a href={`tel:${institute.phone}`} className="hover:text-primary transition-colors duration-300">
                                {institute.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {institute.email && (
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">Email</div>
                            <div className="font-semibold text-foreground">
                              <a href={`mailto:${institute.email}`} className="hover:text-primary transition-colors duration-300">
                                {institute.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {institute.website && (
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">Website</div>
                            <div className="font-semibold text-foreground">
                              <a 
                                href={institute.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors duration-300 text-primary"
                              >
                                Visit Website
                                <ExternalLink className="w-4 h-4 inline ml-2" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address & Location */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Location & Address</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Address</div>
                          <div className="font-semibold text-foreground leading-relaxed">
                            {institute.address || 'Address not specified'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">City & State</div>
                          <div className="font-semibold text-foreground">
                            {institute.city}, {institute.state}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Established</div>
                          <div className="font-semibold text-foreground">
                            {institute.established || 'Year not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="text-center mt-12 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {institute.viewDetailsLink && (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => window.open(institute.viewDetailsLink, '_blank')}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      View Details
                    </Button>
                  )}
                  
                  {institute.applyNowLink && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300"
                      onClick={() => window.open(institute.applyNowLink, '_blank')}
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Apply Now
                    </Button>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                  Ready to take the next step? Contact us directly or visit our website for more information about admissions, programs, and campus life.
                </p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Student Reviews</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Read authentic reviews from current students and alumni to get real insights
              </p>
            </div>
            
            <div className="grid gap-8">
              
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">All Reviews ({reviews.length})</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">(324 reviews)</span>
                  </div>
                </div>
                {reviewsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="text-center py-8 text-destructive">{reviewsError}</div>
                ) : (
                  <ReviewsList reviews={reviews} />
                )}
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InstituteDetails;