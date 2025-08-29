import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';

const BookMeeting = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(0 82% 53%) 0%, hsl(0 0% 95%) 100%)'
        }}
      />
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Schedule a 1:1 Chat with a Senior Student or Counselor
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Get personalized guidance from experienced mentors who understand your journey
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              {[
                {
                  icon: Users,
                  title: "Expert Mentors",
                  description: "Connect with senior students and professional counselors"
                },
                {
                  icon: Calendar,
                  title: "Flexible Scheduling",
                  description: "Book sessions that fit your schedule"
                },
                {
                  icon: Clock,
                  title: "30-Min Sessions",
                  description: "Focused conversations to address your specific needs"
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <feature.icon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="xl" 
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
              >
                Book Free Consultation
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                View Available Slots
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm">
                ✅ Free 30-minute session • ✅ No commitment required • ✅ 500+ successful meetings
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookMeeting;