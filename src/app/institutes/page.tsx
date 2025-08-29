'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  MapPin, 
  Star, 
  Users, 
  GraduationCap,
  Filter,
  ExternalLink,
  Calendar,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import institute1 from '../../../public/institute-1.jpg';

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

interface PaginationData {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

const InstitutesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalCount: 0
  });

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentLimit = parseInt(searchParams.get('limit') || '12');

  // Track initial load and last page/limit to avoid loading during keyword search
  const initialLoadRef = useRef(true);
  const prevPageRef = useRef<number>(currentPage);
  const prevLimitRef = useRef<number>(currentLimit);

  // Fetch institutes data with pagination and optional search
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const isPageOrLimitChange = prevPageRef.current !== currentPage || prevLimitRef.current !== currentLimit;
        if (initialLoadRef.current || isPageOrLimitChange) {
          setLoading(true);
        }
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', currentLimit.toString());
        if (searchQuery.trim()) {
          params.append('q', searchQuery.trim());
        }
        
        const response = await fetch(`/api/institute-registration?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch institutes');
        }
        
        const data = await response.json();
        
        setInstitutes(data.registrations || []);
        setPagination({
          page: data.pagination?.page || currentPage,
          limit: data.pagination?.limit || currentLimit,
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0
        });
      } catch (err) {
        console.error('Error fetching institutes:', err);
        setError('Failed to fetch institutes data');
      } finally {
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
          setLoading(false);
        } else if (prevPageRef.current !== currentPage || prevLimitRef.current !== currentLimit) {
          setLoading(false);
        }
        prevPageRef.current = currentPage;
        prevLimitRef.current = currentLimit;
      }
    };

    fetchInstitutes();
  }, [currentPage, currentLimit, searchQuery]);

  // Fetch keyword suggestions
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const q = searchQuery.trim();
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/institute-registration?suggest=1&q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch (_) {}
    };
    const t = setTimeout(run, 200);
    return () => { clearTimeout(t); controller.abort(); };
  }, [searchQuery]);

  // Update URL when page changes
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/institutes?${params.toString()}`);
  };

  // Update limit when changed
  const updateLimit = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reset to first page when changing limit
    router.push(`/institutes?${params.toString()}`);
  };

  const cities = [
    "All Cities", 
    "Thiruvananthapuram", 
    "Kollam", 
    "Pathanamthitta", 
    "Alappuzha", 
    "Kottayam", 
    "Idukki", 
    "Ernakulam", 
    "Thrissur", 
    "Palakkad", 
    "Malappuram", 
    "Kozhikode", 
    "Wayanad", 
    "Kannur", 
    "Kasaragod"
  ];
  const types = ["All Types", "Engineering", "Medical", "Management", "Design", "University"];

  const isServerSearchActive = searchQuery.trim().length > 0;
  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = isServerSearchActive
      ? true // server already applied keyword/name/type filtering
      : (
          institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          institute.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray((institute as any).keywords) && (institute as any).keywords.some((k: string) => (k || '').toLowerCase().includes(searchQuery.toLowerCase())))
        );
    const matchesCity = selectedCity === '' || selectedCity === 'All Cities' || institute.city === selectedCity;
    const matchesType = selectedType === '' || selectedType === 'All Types' || institute.type === selectedType;
    
    return matchesSearch && matchesCity && matchesType;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading institutes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Failed to Load Institutes</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
      <section className="pt-12 pb-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Discover Institutions
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Find Your Perfect 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Institution</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed hidden md:block">
              Explore verified institutions across India with authentic reviews, detailed information, 
              and insights from current students and alumni.
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
                  placeholder="Search institutes, courses, or locations..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="pl-12 h-12 text-base"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-popover border border-border/50 rounded-md shadow-md max-h-64 overflow-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-4 w-full md:w-auto">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full md:w-40 h-12">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <SelectValue placeholder="City" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-40 h-12">
                    <div className="flex items-center space-x-2">
                      <Filter size={16} />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredInstitutes.length} of {pagination.totalCount} institutions
                {pagination.totalCount === 0 && ' - No institutes available yet'}
              </div>
              
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={currentLimit.toString()} onValueChange={(value) => updateLimit(parseInt(value))}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstitutes.map((institute, index) => (
              <Card 
                key={institute._id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={institute.imageDataUrls?.[0] || institute1.src} 
                    alt={institute.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {institute.status && (
                    <Badge className={`absolute top-3 left-3 ${
                      institute.status === 'approved' 
                        ? 'bg-green-600 text-white' 
                        : institute.status === 'submitted' 
                        ? 'bg-blue-600 text-white'
                        : institute.status === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : institute.status === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {institute.status.charAt(0).toUpperCase() + institute.status.slice(1)}
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-background/90 rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{institute.placementRate || 'N/A'}</span>
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
                      <div className="font-semibold text-sm">{institute.established}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                        <Award size={12} />
                        <span>Placement</span>
                      </div>
                      <div className="font-semibold text-sm">{institute.placementRate || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      {institute.courses?.length || 0} courses
                    </div>
                    <Link href={`/institutes/${institute._id}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        View Details
                        <ExternalLink size={14} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInstitutes.length === 0 && pagination.totalCount > 0 && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No institutions found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {pagination.totalCount === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No institutions available</h3>
              <p className="text-muted-foreground">
                There are currently no institutions in our database. 
                Check back later or contact us for more information.
              </p>
            </div>
          )}

          {/* Pagination Summary */}
          {pagination.totalCount > 0 && (
            <div className="text-center py-6 border-t border-border/50">
              <div className="text-sm text-muted-foreground mb-2">
                Showing page {currentPage} of {pagination.totalPages} 
                ({Math.min((currentPage - 1) * currentLimit + 1, pagination.totalCount)} - {Math.min(currentPage * currentLimit, pagination.totalCount)} of {pagination.totalCount} institutes)
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2 py-8">
              {/* First and Previous */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => updatePage(1)}
                  disabled={currentPage === 1}
                  className="flex items-center"
                  size="sm"
                >
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updatePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center"
                  size="sm"
                >
                  <ChevronLeft size={16} />
                </Button>
              </div>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => updatePage(pageNum)}
                      className="w-10 h-10"
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              {/* Next and Last */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => updatePage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center"
                  size="sm"
                >
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updatePage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center"
                  size="sm"
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Institutes = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <InstitutesContent />
    </Suspense>
  );
};

export default Institutes;