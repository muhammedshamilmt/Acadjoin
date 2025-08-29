'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WriteReviewForm } from '@/components/ReviewComponents';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Search,
  Star, 
  ThumbsUp, 
  MessageSquare,
  GraduationCap,
  MapPin,
  Calendar,
  User,
  Filter,
  TrendingUp
} from 'lucide-react';

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const { user, isAuthenticated, initializeFromStorage } = useAuth();
  const { toast } = useToast();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  // Fallback sample data if no reviews are loaded
  const fallbackReviews = [
    {
      _id: 'fallback-1',
      userId: 'sample-user-1',
      userEmail: 'student1@example.com',
      userRole: 'user',
      rating: 5,
      title: 'Excellent faculty and research opportunities',
      content: 'IIT Kerala has exceeded my expectations in every way. The faculty is world-class, and the research opportunities are incredible. The campus infrastructure is top-notch, and the placement support is outstanding.',
      course: 'B.Tech Computer Science',
      year: '3rd Year',
      institute: 'IIT Kerala',
      likes: 45,
      helpful: 38,
      verified: true,
      tags: ['Faculty', 'Research', 'Placements', 'Infrastructure'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: 'fallback-2',
      userId: 'sample-user-2',
      userEmail: 'student2@example.com',
      userRole: 'individual',
      rating: 4,
      title: 'Great medical education with practical exposure',
      content: 'KIMS provided excellent clinical exposure and hands-on training. The hospital attached to the college gave us real-world experience. However, the hostel facilities could be improved.',
      course: 'MBBS',
      year: '2022 Graduate',
      institute: 'KIMS Kochi',
      likes: 32,
      helpful: 29,
      verified: true,
      tags: ['Clinical Training', 'Hospital', 'Curriculum', 'Hostel'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ];

  // Use fallback data if no reviews are loaded
  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log('Fetching reviews...');
        
        const response = await fetch('/api/reviews');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Reviews data:', data);
        
        if (data.success) {
          setReviews(data.reviews || []);
          console.log('Reviews set:', data.reviews?.length || 0);
        } else {
          console.error('Failed to fetch reviews:', data.error);
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Check like status for current user
  useEffect(() => {
    const checkLikeStatus = async () => {
      const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
      if (!email || displayReviews.length === 0) return;

      try {
        // Get user ID from the users collection
        const userResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
        if (!userResponse.ok) return;
        
        const userData = await userResponse.json();
        const userId = userData.user._id;
        
        if (!userId) return;

        const likePromises = displayReviews.map(review => 
          fetch(`/api/reviews/${review._id}/like?userId=${userId}`)
            .then(res => res.json())
            .then(data => ({ reviewId: review._id, liked: data.success && data.liked }))
            .catch(() => ({ reviewId: review._id, liked: false }))
        );

        const results = await Promise.all(likePromises);
        const likedReviewIds = results
          .filter(result => result.liked)
          .map(result => result.reviewId);

        setLikedReviews(new Set(likedReviewIds));
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [user?.email, displayReviews]);

  const handleReviewSubmit = async (reviewData: any) => {
    // Refresh the reviews list after a new review is submitted
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const handleLike = async (reviewId: string) => {
    const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
    if (!email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like reviews.",
        variant: "destructive"
      });
      return;
    }

    try {
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

      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail: email
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the reviews state
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review._id === reviewId 
              ? { 
                  ...review, 
                  likes: data.liked ? review.likes + 1 : review.likes - 1 
                }
              : review
          )
        );

        // Update liked reviews state
        setLikedReviews(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(reviewId);
          } else {
            newSet.delete(reviewId);
          }
          return newSet;
        });

        toast({
          title: data.liked ? "Review Liked" : "Review Unliked",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update like status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  // Check if user has liked a review
  const isReviewLiked = (reviewId: string) => {
    return likedReviews.has(reviewId);
  };

  // Check if user is authenticated
  const isUserAuthenticated = () => {
    const localStorageEmail = typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') : null;
    const localStorageName = typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_name') : null;
    
    console.log('Auth Debug:', {
      zustandUser: user,
      zustandAuthenticated: isAuthenticated,
      localStorageEmail,
      localStorageName,
      combinedAuth: isAuthenticated || !!localStorageEmail
    });
    
    return isAuthenticated || !!localStorageEmail;
  };

  const institutes = ["All Institutes", ...Array.from(new Set(displayReviews.map(review => review.institute).filter(Boolean)))];
  const ratings = ["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];

  const filteredReviews = displayReviews.filter(review => {
    const matchesSearch = review.institute.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstitute = selectedInstitute === '' || selectedInstitute === 'All Institutes' || review.institute === selectedInstitute;
    const matchesRating = selectedRating === '' || selectedRating === 'All Ratings' || 
                         selectedRating === `${review.rating} Star${review.rating > 1 ? 's' : ''}`;
    
    return matchesSearch && matchesInstitute && matchesRating;
  });

  const averageRating = displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length;

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
              Student Reviews
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Real Stories from 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Real Students</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Read authentic reviews and experiences from current students and alumni to make 
              informed decisions about your educational journey.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{displayReviews.length}+</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  <span className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-card border-b border-border/50">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search reviews by institution, course, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 w-full md:w-auto">
                <Select value={selectedInstitute} onValueChange={setSelectedInstitute}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <div className="flex items-center space-x-2">
                      <GraduationCap size={16} />
                      <SelectValue placeholder="Institute" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map(institute => (
                      <SelectItem key={institute} value={institute}>{institute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-full md:w-32 h-12">
                    <div className="flex items-center space-x-2">
                      <Star size={16} />
                      <SelectValue placeholder="Rating" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map(rating => (
                      <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredReviews.length} of {displayReviews.length} reviews
            </div>
            
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading reviews...</p>
              </div>
            ) : (
              filteredReviews.map((review, index) => (
              <Card 
                key={review._id || review.id || index}
                className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">{review.userEmail?.split('@')[0] || 'Anonymous'}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.userRole === 'individual' ? 'Individual' : 'User'} • {review.course} • {review.year}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <GraduationCap size={14} />
                          <span>{review.institute}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {review.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {review.tags && review.tags.map((tag: any, idx: number) => (
                      <Badge key={`${review._id}-tag-${idx}`} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => isUserAuthenticated() ? handleLike(review._id) : null}
                        className={`flex items-center space-x-2 text-sm transition-colors ${
                          isReviewLiked(review._id) 
                            ? 'text-primary hover:text-primary/80' 
                            : 'text-muted-foreground hover:text-foreground'
                        } ${!isUserAuthenticated() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        title={!isUserAuthenticated() ? 'Please log in to like reviews' : ''}
                      >
                        <ThumbsUp 
                          size={16} 
                          className={isReviewLiked(review._id) ? 'fill-current' : ''}
                        />
                        <span>{review.likes || 0} likes</span>
                      </button>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>

          {!loading && filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {/* Write Review CTA */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-0 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Share Your Experience
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Help other students by sharing your authentic experience at your institution. 
                  Your review can make a difference in someone's educational journey.
                </p>
                <WriteReviewForm onSubmit={handleReviewSubmit} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;