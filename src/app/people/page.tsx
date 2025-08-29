'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  MessageCircle, 
  Star, 
  Users, 
  GraduationCap,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Filter,
  Loader2
} from 'lucide-react';
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

const People = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [people, setPeople] = useState<PeopleRegistration[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<PeopleRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickConnectModal, setShowQuickConnectModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PeopleRegistration | null>(null);

  // Fetch people registrations from API
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/people-registration');
        if (!response.ok) {
          throw new Error('Failed to fetch people data');
        }
        
        const data = await response.json();
        console.log('Fetched people data:', data);
        if (data.registrations && Array.isArray(data.registrations)) {
          console.log('People registrations:', data.registrations);
          setPeople(data.registrations);
          setFilteredPeople(data.registrations);
        } else {
          setPeople([]);
          setFilteredPeople([]);
        }
      } catch (err) {
        console.error('Error fetching people:', err);
        setError('Failed to load people data. Please try again later.');
        setPeople([]);
        setFilteredPeople([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Filter people based on search and filters
  useEffect(() => {
    const filtered = people.filter(person => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                           person.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           person.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           person.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === '' || selectedRole === 'All Roles' || 
                          (selectedRole === 'Student Mentor' && person.interestedFields.includes('Student Mentoring')) ||
                          (selectedRole === 'Alumni Mentor' && person.interestedFields.includes('Alumni Mentoring')) ||
                          (selectedRole === 'Academic Counselor' && person.interestedFields.includes('Academic Counseling')) ||
                          (selectedRole === 'Career Counselor' && person.interestedFields.includes('Career Counseling')) ||
                          (selectedRole === 'Industry Expert' && person.interestedFields.includes('Industry Expert'));
      
      const matchesInstitute = selectedInstitute === '' || selectedInstitute === 'All Institutes' || 
                              person.location.toLowerCase().includes(selectedInstitute.toLowerCase());
      
      return matchesSearch && matchesRole && matchesInstitute;
    });
    
    setFilteredPeople(filtered);
  }, [people, searchQuery, selectedRole, selectedInstitute]);

  const roles = ["All Roles", "Student Mentor", "Alumni Mentor", "Academic Counselor", "Career Counselor", "Industry Expert"];
  const institutes = ["All Institutes", "IIT Kerala", "KIMS Kochi", "IIM Kozhikode", "NID Kerala", "CUSAT", "Multiple Institutions"];

  // Helper function to get role based on specializations and interests
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
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Loading people...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
              Connect with Mentors
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Learn from 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Real People</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed hidden md:block">
              Connect with students, alumni, and professionals who can guide you through your educational 
              journey with authentic insights and personalized advice.
            </p>
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
                  placeholder="Search mentors by name, skills, or location..."
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
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPeople.length} of {people.length} mentors
            </div>
          </div>
        </div>
      </section>

      {/* People Grid */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPeople.map((person, index) => (
              <Card 
                key={person._id}
                className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 space-y-4">
                  {/* Header */}
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      {person.profilePicture ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border/50">
                          <img 
                            src={person.profilePicture} 
                            alt={`${person.firstName} ${person.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to default icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
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
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {person.firstName} {person.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{getPersonRole(person)}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-xs text-muted-foreground">(New)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {person.bio || 'Passionate professional ready to help and mentor others in their journey.'}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin size={14} />
                      <span>{person.location || 'Location not specified'}</span>
                    </div>
                    {person.studiedInstitution && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <GraduationCap size={14} />
                        <span>{person.studiedInstitution}</span>
                      </div>
                    )}
                    {person.expectedSalary && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <BookOpen size={14} />
                        <span>Expected: {person.expectedSalary}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {person.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Specializations */}
                  {person.specializations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {person.specializations.slice(0, 2).map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {person.specializations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{person.specializations.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {person.skills.length + person.specializations.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Expertise Areas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {getResponseTimeDisplay(person.averageResponseTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">Response Time</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={() => {
                      window.location.href = `/people-profile/${person._id}`;
                    }}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Connect Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No mentors found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Connect Modal */}
      <QuickConnectModal
        isOpen={showQuickConnectModal}
        onClose={() => setShowQuickConnectModal(false)}
        person={selectedPerson}
      />

      <Footer />
    </div>
  );
};

export default People;