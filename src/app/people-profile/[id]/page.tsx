'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Star,
  Award,
  Briefcase,
  Target,
  Trophy,
  MessageCircle,
  ExternalLink,
  Loader2,
  Building,
  Clock
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import QuickConnectModal from '@/components/QuickConnectModal';


interface PeopleRegistration {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  bio: string;
  studiedInstitution: string;
  profilePicture: string;
  careerGoals: string;
  expectedSalary: string;
  averageResponseTime: string;
  interestedFields: string[];
  preferredLocations: string[];
  skills: string[];
  specializations: string[];
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

const PeopleProfileDetail = () => {
  const params = useParams();
  const id = params.id as string;
  
  const [person, setPerson] = useState<PeopleRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickConnectModal, setShowQuickConnectModal] = useState(false);

  // Fetch person data
  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching person data for ID:', id);
        
        if (!id) {
          console.log('No ID provided');
          setError('No profile ID provided');
          setLoading(false);
          return;
        }
        
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`/api/people-registration/${id}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log('Error response:', errorData);
          
          if (response.status === 404) {
            setError('Profile not found');
          } else {
            setError(`Failed to fetch profile data: ${errorData.error || response.statusText}`);
          }
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Person data:', data);
        
        if (!data || !data._id) {
          console.log('Invalid data received:', data);
          setError('Invalid profile data received');
          setLoading(false);
          return;
        }
        
        setPerson(data);
      } catch (err) {
        console.error('Error fetching person data:', err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Failed to fetch profile data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonData();
    } else {
      setLoading(false);
      setError('No profile ID provided');
    }
  }, [id]);

  // Helper function to get person role
  const getPersonRole = (person: PeopleRegistration): string => {
    if (person.specializations.some(spec => spec.toLowerCase().includes('mentor'))) {
      return 'Student Mentor';
    } else if (person.specializations.some(spec => spec.toLowerCase().includes('counsel'))) {
      return 'Career Counselor';
    } else if (person.specializations.some(spec => spec.toLowerCase().includes('academic'))) {
      return 'Academic Counselor';
    } else if (person.specializations.some(spec => spec.toLowerCase().includes('industry'))) {
      return 'Industry Expert';
    } else {
      return 'Professional';
    }
  };

  // Helper function to get response time display
  const getResponseTimeDisplay = (responseTime: string): string => {
    if (!responseTime) return 'Flexible';
    if (responseTime.includes('1 hour')) return '< 1 hour';
    if (responseTime.includes('4 hours')) return '< 4 hours';
    if (responseTime.includes('24 hours')) return '< 24 hours';
    if (responseTime.includes('48 hours')) return '< 48 hours';
    return responseTime;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !person) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The requested profile could not be found.'}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
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
                {person.profilePicture ? (
                  <Avatar className="w-32 h-32 border-4 border-card shadow-glass">
                    <AvatarImage src={person.profilePicture} alt={`${person.firstName} ${person.lastName}`} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl">
                      {person.firstName[0]}{person.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-4 border-card shadow-glass">
                    <GraduationCap className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                    <User className="w-4 h-4 mr-2" />
                    {getPersonRole(person)}
                  </Badge>
                  <div className="flex items-center space-x-1 bg-background/90 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                  {person.firstName} {person.lastName}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{person.location}</span>
                  </div>
                  {person.studiedInstitution && (
                    <>
                      <div className="hidden md:block w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        <span>{person.studiedInstitution}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  {person.bio || 'Passionate professional ready to help and mentor others in their journey.'}
                </p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-button"
                    onClick={() => setShowQuickConnectModal(true)}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    Connect
                  </Button>
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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Full Name</Label>
                            <div className="font-semibold">{person.firstName} {person.lastName}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Gender</Label>
                            <div className="font-semibold">{person.gender || 'Not specified'}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Location</Label>
                            <div className="font-semibold">{person.location || 'Not specified'}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                            <div className="font-semibold">
                              {person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Bio</Label>
                          <div className="text-foreground leading-relaxed">
                            {person.bio || 'No bio available.'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Quick Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Response Time</div>
                            <div className="font-semibold">{getResponseTimeDisplay(person.averageResponseTime)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Target className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Expected Salary</div>
                            <div className="font-semibold">{person.expectedSalary || 'Not specified'}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Award className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Experience Areas</div>
                            <div className="font-semibold">{person.skills.length + person.specializations.length}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Expertise */}
              <TabsContent value="expertise">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Skills & Specializations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {person.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            {person.specializations.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Interested Fields</h4>
                          <div className="flex flex-wrap gap-2">
                            {person.interestedFields.map((field, index) => (
                              <Badge key={index} variant="outline">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Preferred Locations</h4>
                          <div className="flex flex-wrap gap-2">
                            {person.preferredLocations.map((location, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Career Goals</h4>
                          <div className="text-foreground leading-relaxed">
                            {person.careerGoals || 'No career goals specified.'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Achievements & Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {person.achievements && person.achievements.length > 0 ? (
                      <div className="space-y-4">
                        {person.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Trophy className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground">{achievement}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No Achievements Listed</p>
                        <p className="text-sm">This person hasn't added any achievements yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact */}
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {person.email && (
                          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground mb-1">Email</div>
                              <div className="font-semibold text-foreground">
                                <a href={`mailto:${person.email}`} className="hover:text-primary transition-colors duration-300">
                                  {person.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {person.phone && (
                          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300">
                            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground mb-1">Phone</div>
                              <div className="font-semibold text-foreground">
                                <a href={`tel:${person.phone}`} className="hover:text-primary transition-colors duration-300">
                                  {person.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                            <div className="font-semibold text-foreground">
                              {getResponseTimeDisplay(person.averageResponseTime)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">Location</div>
                            <div className="font-semibold text-foreground">
                              {person.location || 'Not specified'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-button"
                        onClick={() => setShowQuickConnectModal(true)}
                      >
                        <MessageCircle className="mr-2 w-5 h-5" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Quick Connect Modal */}
      <QuickConnectModal
        isOpen={showQuickConnectModal}
        onClose={() => setShowQuickConnectModal(false)}
        person={person}
      />

      <Footer />
    </div>
  );
};

export default PeopleProfileDetail;
