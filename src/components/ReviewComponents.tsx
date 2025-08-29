import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Trash2, MessageCircle, ThumbsUp, Flag, Calendar } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useUserRole } from '@/hooks/useUserRole';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  course?: string;
  year?: string;
  institute?: string;
}

interface WriteReviewFormData {
  rating: number;
  title: string;
  content: string;
  course: string;
  year: string;
  institute: string;
}

interface WriteReviewFormProps {
  instituteName?: string;
  onSubmit: (data: WriteReviewFormData) => void;
}

export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({ instituteName, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<WriteReviewFormData>();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  
  // Get user email from Zustand store or localStorage
  const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');

  const institutes = [
    'IIT Kerala',
    'KIMS Kochi',
    'IIM Kozhikode',
    'NID Kerala',
    'CUSAT',
    'CET Trivandrum',
    'NIT Calicut',
    'Amrita University',
    'Christ University',
    'Other'
  ];

  const courses = [
    'Computer Science & Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Chemical Engineering',
    'Biotechnology',
    'MBA',
    'MBBS',
    'BDS',
    'B.Arch',
    'B.Des',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni'];

  const handleFormSubmit = async (data: WriteReviewFormData) => {
    const email = user?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') || '' : '');
    if (!email) {
      toast({
        title: "Authentication Required",
        description: "Please log in as user or people to write a review.",
        variant: "destructive"
      });
      return;
    }

    if (role === 'institute') {
      toast({
        title: "Access Denied",
        description: "Institutes cannot write reviews.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        ...data,
        rating,
        userEmail: email,
        userId: email, // Using email as userId for now, will be resolved in API
        userRole: role
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully.",
        });
        reset();
        setRating(0);
        setIsOpen(false);
        // Call the onSubmit callback to refresh the reviews list
        if (onSubmit) {
          onSubmit(reviewData);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ currentRating, onRatingChange, editable = true }: { 
    currentRating: number; 
    onRatingChange?: (rating: number) => void;
    editable?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            star <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          onClick={() => editable && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );

  // Show different button based on user role
  const renderWriteReviewButton = () => {
    if (roleLoading) {
      return (
        <Button className="w-full" disabled>
          <MessageCircle className="w-4 h-4 mr-2" />
          Loading...
        </Button>
      );
    }

    if (!email) {
      return (
        <Button className="w-full" onClick={() => {
          toast({
            title: "Authentication Required",
            description: "Please log in to write a review.",
            variant: "destructive"
          });
        }}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Login to Write Review
        </Button>
      );
    }

    if (role === 'institute') {
      return (
        <Button className="w-full" onClick={() => {
          toast({
            title: "Access Denied",
            description: "Institutes cannot write reviews.",
            variant: "destructive"
          });
        }}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Institutes Cannot Write Reviews
        </Button>
      );
    }

    return (
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <MessageCircle className="w-4 h-4 mr-2" />
        Write a Review
      </Button>
    );
  };

  // Only render the dialog if user can write reviews
  const canWriteReview = user && role !== 'institute' && !roleLoading;

  return (
    <>
      {canWriteReview ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div>
              {renderWriteReviewButton()}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Review {instituteName ? `for ${instituteName}` : ''}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label>Overall Rating *</Label>
                <StarRating currentRating={rating} onRatingChange={setRating} />
                {rating === 0 && <p className="text-destructive text-sm">Please select a rating</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="institute">Institution *</Label>
                <Controller
                  name="institute"
                  control={control}
                  rules={{ required: 'Institution is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutes.map(institute => (
                          <SelectItem key={institute} value={institute}>{institute}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.institute && <p className="text-destructive text-sm">{errors.institute.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Controller
                    name="course"
                    control={control}
                    rules={{ required: 'Course is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.course && <p className="text-destructive text-sm">{errors.course.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Controller
                    name="year"
                    control={control}
                    rules={{ required: 'Year is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && <p className="text-destructive text-sm">{errors.year.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Review Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
                  placeholder="Summarize your experience in a few words"
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <Textarea
                  id="content"
                  {...register('content', { required: 'Review content is required', minLength: { value: 50, message: 'Review must be at least 50 characters' } })}
                  placeholder="Share your detailed experience about the institute, faculty, facilities, placement, etc."
                  rows={6}
                />
                {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Review Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be honest and provide constructive feedback</li>
                  <li>• Focus on your personal experience</li>
                  <li>• Avoid using offensive language</li>
                  <li>• Provide specific details to help others</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={rating === 0 || isSubmitting} className="flex-1">
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        // Render just the button without dialog for institutes or non-authenticated users
        renderWriteReviewButton()
      )}
    </>
  );
};

interface EditReviewFormProps {
  review: Review;
  onEdit: (id: string, data: WriteReviewFormData) => void;
}

export const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<WriteReviewFormData>({
    defaultValues: {
      title: review.title,
      content: review.content,
      course: review.course || '',
      year: review.year || '',
      institute: ''
    }
  });
  const { toast } = useToast();

  const institutes = [
    'IIT Kerala',
    'KIMS Kochi',
    'IIM Kozhikode',
    'NID Kerala',
    'CUSAT',
    'CET Trivandrum',
    'NIT Calicut',
    'Amrita University',
    'Christ University',
    'Other'
  ];

  const courses = [
    'Computer Science & Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Chemical Engineering',
    'Biotechnology',
    'MBA',
    'MBBS',
    'BDS',
    'B.Arch',
    'B.Des',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni'];

  const handleFormSubmit = (data: WriteReviewFormData) => {
    onEdit(review.id, { ...data, rating });
    setIsOpen(false);
    toast({
      title: "Review Updated",
      description: "Your review has been updated successfully.",
    });
  };

  const StarRating = ({ currentRating, onRatingChange }: { 
    currentRating: number; 
    onRatingChange: (rating: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            star <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Your Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <StarRating currentRating={rating} onRatingChange={setRating} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institute">Institution *</Label>
            <Controller
              name="institute"
              control={control}
              rules={{ required: 'Institution is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map(institute => (
                      <SelectItem key={institute} value={institute}>{institute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.institute && <p className="text-destructive text-sm">{errors.institute.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Controller
                name="course"
                control={control}
                rules={{ required: 'Course is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course && <p className="text-destructive text-sm">{errors.course.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Controller
                name="year"
                control={control}
                rules={{ required: 'Year is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.year && <p className="text-destructive text-sm">{errors.year.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Summarize your experience"
            />
            {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Review content is required' })}
              placeholder="Share your experience..."
              rows={6}
            />
            {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ReviewsListProps {
  reviews: Review[];
  onEdit?: (id: string, data: WriteReviewFormData) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  const { toast } = useToast();

  const handleHelpful = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'anon-user', userEmail: 'anon@example.com' })
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Failed to update like', variant: 'destructive' });
        return;
      }
      toast({ title: data.liked ? 'Marked Helpful' : 'Removed Helpful', description: data.message });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update like', variant: 'destructive' });
    }
  };

  const handleReport = (reviewId: string) => {
    toast({
      title: "Review Reported",
      description: "We'll review this content. Thank you for your feedback.",
    });
  };

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {review.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(review.date).toLocaleDateString()}
                    {review.course && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">{review.course}</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarDisplay rating={review.rating} />
                <span className="text-sm font-medium">{review.rating}.0</span>
              </div>
            </div>

            <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{review.content}</p>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleHelpful(review.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
              </div>

              {showActions && onEdit && onDelete && (
                <div className="flex gap-2">
                  <EditReviewForm review={review} onEdit={onEdit} />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};