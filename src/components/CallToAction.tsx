import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA Block */}
          <div className="bg-gradient-to-br from-background to-card rounded-3xl p-12 md:p-16 shadow-glass relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  Ready to Discover Your{' '}
                  <span className="text-primary">Future?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of students who found their perfect institute and career path through our platform
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button variant="cta" size="xl" className="group">
                  Get Started
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="xl" className="border-2 hover:bg-primary hover:text-primary-foreground">
                  Explore Institutes
                </Button>
              </div>

              {/* Additional incentive */}
              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  🎉 <strong>Limited Time:</strong> Free consultation calls with senior students • No hidden fees • Get started in under 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;