import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, GraduationCap, Star, Users } from 'lucide-react';
import institute1 from '../../public/institute-1.jpg';

const FeaturedInstitutes = () => {
  const institutes = [
    {
      id: 1,
      name: "Kerala Institute of Technology",
      logo: institute1,
      description: "Leading engineering college with excellent placement records and modern facilities.",
      city: "Kochi",
      isFreeRegistration: true,
    },
    {
      id: 2,
      name: "Malabar Medical College",
      logo: institute1,
      description: "Premier medical institution with state-of-the-art infrastructure and experienced faculty.",
      city: "Kozhikode",
      isFreeRegistration: true,
    },
    {
      id: 3,
      name: "Trivandrum Business School",
      logo: institute1,
      description: "Top-ranked business school offering MBA and management programs with industry connections.",
      city: "Thiruvananthapuram",
      isFreeRegistration: false,
    },
    {
      id: 4,
      name: "Kottayam Arts & Science",
      logo: institute1,
      description: "Renowned college for arts, science, and humanities with vibrant campus life.",
      city: "Kottayam",
      isFreeRegistration: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}></div>
      
      <div className="container mx-auto px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
            <GraduationCap size={16} />
            <span>Verified Institutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Explore Top 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Institutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover verified institutes with real student reviews, authentic insights, and comprehensive guidance to make the best educational choice for your future
          </p>
        </div>

        {/* Institutes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {institutes.map((institute, index) => (
            <div 
              key={institute.id}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-glass hover:shadow-2xl transition-all duration-500 relative group animate-fade-in border border-border/50 hover:border-primary/20"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Free Registration Badge */}
              {institute.isFreeRegistration && (
                <Badge 
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg border-0 px-3 py-1"
                  variant="default"
                >
                  ✨ Free Registration
                </Badge>
              )}

              {/* Institute Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={institute.logo.src} 
                    alt={`${institute.name} logo`}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Institute Info */}
              <div className="text-center mb-6">
                <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {institute.name}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {institute.description}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center justify-center space-x-6 mb-4 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Users size={14} />
                    <span>1.2k+ students</span>
                  </div>
                </div>
                
                {/* City */}
                <div className="flex items-center justify-center text-sm text-muted-foreground/80">
                  <MapPin size={14} className="mr-2 text-primary" />
                  <span className="font-medium">{institute.city}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 font-semibold py-3 rounded-xl"
              >
                View Profile
                <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInstitutes;