'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  MapPin, 
  Star, 
  Users, 
  Building,
  User,
  Award,
  ExternalLink,
  MessageCircle,
  Calendar,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { useOptimizedFetch, useSearchSuggestions } from '@/hooks/useOptimizedFetch';

interface InstituteRegistration {
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
  excellenceInEducation: string;
  placementRate: string;
  averagePackage: string;
  highestPackage: string;
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
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

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

const Courses = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Use optimized fetch hooks for better performance
  const [institutesState] = useOptimizedFetch<InstituteRegistration[]>('/api/institute-registration', {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const [peopleState] = useOptimizedFetch<PeopleRegistration[]>('/api/people-registration', {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mark as loaded after first fetch resolve
  useEffect(() => {
    if (!hasLoadedOnce && (Array.isArray(institutesState.data) || Array.isArray(peopleState.data) || institutesState.error || peopleState.error)) {
      setHasLoadedOnce(true);
    }
  }, [hasLoadedOnce, institutesState.data, peopleState.data, institutesState.error, peopleState.error]);

  // Use optimized search suggestions
  const { suggestions } = useSearchSuggestions(
    '/api/institute-registration',
    searchQuery
  );

  const institutes = institutesState.data || [];
  const people = peopleState.data || [];
  const isLoading = (institutesState.loading || peopleState.loading) && !hasLoadedOnce;
  const error = institutesState.error || peopleState.error;

  // Get all available courses from institutes
  const getAllCourses = () => {
    const allCourses: string[] = [];
    institutes.forEach(institute => {
      institute.courses.forEach(course => {
        if (!allCourses.includes(course.name)) {
          allCourses.push(course.name);
        }
      });
    });
    return allCourses;
  };

  // Filter institutes based on search query (includes keywords)
  const getFilteredInstitutes = () => {
    if (!searchQuery.trim()) return [];
    
    return institutes.filter(institute =>
      institute.courses.some(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institute.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(institute.keywords) && institute.keywords.some(k => (k || '').toLowerCase().includes(searchQuery.toLowerCase())))
    );
  };

  // Filter people based on search query
  const getFilteredPeople = () => {
    if (!searchQuery.trim()) return [];
    
    return people.filter(person =>
      person.skills.some(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      person.specializations.some(spec =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      person.interestedFields.some(field =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredInstitutes = getFilteredInstitutes();
  const filteredPeople = getFilteredPeople();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLoader text="Loading courses and mentors..." />
        <Footer />
      </div>
    );
  }

  if (error && !hasLoadedOnce) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-12 pb-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <BookOpen size={16} className="mr-2" />
              Find Your Course
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Search 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Courses</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed hidden md:block">
              Search for any course and discover institutes that offer it, plus connect with experienced 
              professionals who can guide your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-card border-b border-border/50">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search for courses (e.g., Computer Science, Data Science, MBA, MBBS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-popover border border-border/50 rounded-md shadow-md max-h-64 overflow-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setSearchQuery(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {searchQuery && (
              <div className="mt-4 text-sm text-muted-foreground">
                Found {filteredInstitutes.length} institutes and {filteredPeople.length} mentors for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchQuery && (filteredInstitutes.length > 0 || filteredPeople.length > 0) ? (
        <section className="py-16">
          <div className="container mx-auto px-8">
            <Tabs defaultValue="institutes" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="institutes" className="flex items-center space-x-2">
                  <Building size={16} />
                  <span>Institutes ({filteredInstitutes.length})</span>
                </TabsTrigger>
                <TabsTrigger value="mentors" className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Mentors ({filteredPeople.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="institutes">
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredInstitutes.map((institute, index) => (
                    <Card 
                      key={institute._id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        {institute.imageDataUrls && institute.imageDataUrls.length > 0 ? (
                          <img 
                            src={institute.imageDataUrls[0]} 
                            alt={institute.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Building className="w-16 h-16 text-primary/50" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-background/90 rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                            {institute.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {institute.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <MapPin size={14} />
                            <span>{institute.city}, {institute.state}</span>
                          </div>
                          <Badge variant="secondary">{institute.type}</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-3 border-t border-border/50">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                              <Users size={12} />
                              <span>Students</span>
                            </div>
                            <div className="font-semibold text-sm">{institute.totalStudents || 'N/A'}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                              <Calendar size={12} />
                              <span>Est.</span>
                            </div>
                            <div className="font-semibold text-sm">{institute.established || 'N/A'}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                              <Award size={12} />
                              <span>Placement</span>
                            </div>
                            <div className="font-semibold text-sm">{institute.placementRate || 'N/A'}</div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Courses matching your search: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {institute.courses
                              .filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map((course, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {course.name}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm text-muted-foreground">
                            {institute.courses.length} courses
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            onClick={() => router.push(`/institutes/${institute._id}`)}
                          >
                            View Details
                            <ExternalLink size={14} className="ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredInstitutes.length === 0 && (
                  <div className="text-center py-16">
                    <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No institutes found</h3>
                    <p className="text-muted-foreground">No institutes offer courses matching "{searchQuery}"</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mentors">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPeople.map((person, index) => (
                    <Card 
                      key={person._id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-4">
                          {person.profilePicture ? (
                            <div className="relative">
                          <img 
                                src={person.profilePicture} 
                                alt={`${person.firstName} ${person.lastName}`}
                            className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                                loading="lazy"
                              />
                              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center hidden">
                                <GraduationCap className="w-8 h-8 text-primary" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                              <GraduationCap className="w-8 h-8 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                              {person.firstName} {person.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">{getPersonRole(person)}</p>
                            {person.studiedInstitution && (
                              <p className="text-sm text-muted-foreground">{person.studiedInstitution}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">4.8</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {person.bio || 'Passionate professional ready to help and mentor others in their journey.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-3 border-t border-border/50">
                          <div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                              <Briefcase size={12} />
                              <span>Experience</span>
                            </div>
                            <div className="font-semibold text-sm">{person.skills.length + person.specializations.length} areas</div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                              <MessageCircle size={12} />
                              <span>Response</span>
                            </div>
                            <div className="font-semibold text-sm">{getResponseTimeDisplay(person.averageResponseTime)}</div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Expertise matching your search: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {[...person.skills, ...person.specializations, ...person.interestedFields]
                              .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
                              .slice(0, 3)
                              .map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            {[...person.skills, ...person.specializations, ...person.interestedFields]
                              .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{[...person.skills, ...person.specializations, ...person.interestedFields]
                                  .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())).length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm font-medium text-foreground">
                            {person.expectedSalary || 'Rate not specified'}
                          </div>
                          <Button 
                            size="sm" 
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            onClick={() => router.push(`/people-profile/${person._id}`)}
                          >
                            Connect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPeople.length === 0 && (
                  <div className="text-center py-16">
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No mentors found</h3>
                    <p className="text-muted-foreground">No mentors have experience with "{searchQuery}"</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      ) : (
        /* No Search Results or Empty State */
        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="max-w-2xl mx-auto text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {searchQuery ? "No Results Found" : "Start Your Course Search"}
              </h3>
              <p className="text-muted-foreground mb-8">
                {searchQuery 
                  ? `We couldn't find any institutes or mentors for "${searchQuery}". Try searching for a different course.`
                  : "Enter a course name in the search bar above to find institutes that offer it and mentors with expertise in that field."
                }
              </p>
              
              {!searchQuery && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {getAllCourses().slice(0, 5).map((course, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        onClick={() => setSearchQuery(course)}
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Courses;