import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, Building2, Star, UserPlus  } from 'lucide-react';
import heroImage from '../../public/hero-students.jpg';
import Link from 'next/link';

const HeroSection = () => {
  const stats = [
    { icon: Users, value: '12K+', label: 'Students Guided' },
    { icon: Building2, value: '100+', label: 'Verified Institutes' },
    { icon: Star, value: '500+', label: 'Reviews Available' },
  ];

  return (
    <section className="min-h-screen pt-20 pb-16 bg-background relative overflow-hidden">
      {/* Background wave shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-1/4 left-10 text-wave opacity-20 animate-wave-float"
          width="100"
          height="60"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path
            d="M10 30 Q30 10, 50 30 T90 30"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
        </svg>
        <svg
          className="absolute bottom-1/3 right-16 text-wave opacity-30 animate-wave-float"
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          style={{ animationDelay: '1s' }}
        >
          <path
            d="M20 40 Q40 20, 60 40 T100 40"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <svg
          className="absolute top-2/3 left-1/4 text-wave opacity-25 animate-wave-float"
          width="80"
          height="50"
          viewBox="0 0 80 50"
          fill="none"
          style={{ animationDelay: '2s' }}
        >
          <path
            d="M10 25 Q25 10, 40 25 T70 25"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Your Future.{' '}
                <span className="text-primary">Discover</span> the Right
                Institute with{' '}
                <span className="text-primary">Real Student Stories</span>.
              </h1>
              
              <p className="text-subhero text-muted-foreground max-w-lg leading-relaxed">
                We help students in Kerala and beyond connect with experienced
                peers and institutions. Start your journey now.
              </p>
            </div>

            {/* CTA Button with Arrow */}
            <div className="flex items-center space-x-4">
              <Button variant="cta" size="xl" className="group">
                Explore
                <div className="ml-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </Button>
              <Link href="/registration">
              <Button variant="cta" size="xl" className="group">
              <div className="ml-2 p-1 bg-white/20 rounded-md group-hover:bg-white/30 transition-all duration-300">
                  <UserPlus size={18} />
                </div>
                Register Now
              </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex items-center space-x-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.2 + 0.5}s` }}
                >
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative animate-fade-in mt-8" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-glass">
                <img
                  src={heroImage.src}
                  alt="Students discovering their future with StudyConnect"
                  className="w-full h-auto object-cover"
                />
                
                {/* Glassmorphism Overlay */}
                <div 
                  className="absolute inset-0 bg-hero-gradient backdrop-blur-sm rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244,37,37,0.1), rgba(255,255,255,0.05))'
                  }}
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-glass animate-slide-in-right" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Success Stories</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-glass animate-slide-in-right" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;