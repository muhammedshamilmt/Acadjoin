import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, Users } from 'lucide-react';

interface Recruiter {
  name: string;
  logoDataUrl: string;
}

interface PlacementsSectionProps {
  recruiters: Recruiter[];
}

const PlacementsSection = ({ recruiters }: PlacementsSectionProps) => {
  const placementStats = {
    averagePackage: "₹12.5 LPA",
    highestPackage: "₹45 LPA", 
    placementRate: "95%"
  };

  if (!recruiters || recruiters.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Placement Excellence</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Outstanding career opportunities with top industry leaders and exceptional placement records
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No placement information available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Placement Excellence</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Outstanding career opportunities with top industry leaders and exceptional placement records
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 max-w-6xl mx-auto">
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {placementStats.averagePackage}
                  </div>
                  <div className="text-muted-foreground font-medium">Average Package</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300 border border-secondary/10">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {placementStats.highestPackage}
                  </div>
                  <div className="text-muted-foreground font-medium">Highest Package</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {placementStats.placementRate}
                  </div>
                  <div className="text-muted-foreground font-medium">Placement Rate</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Top Recruiters
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recruiters.map((recruiter, index) => (
                    <div key={index} className="bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 rounded-xl p-4 text-center text-sm font-semibold hover:shadow-md transition-all duration-300 group">
                      {recruiter.logoDataUrl ? (
                        <div className="flex items-center justify-center mb-2">
                          <img 
                            src={recruiter.logoDataUrl} 
                            alt={recruiter.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      ) : null}
                      <div className="text-foreground group-hover:text-primary transition-colors duration-300">{recruiter.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PlacementsSection;