import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface FacilitiesSectionProps {
  facilities: string[];
}

const FacilitiesSection = ({ facilities }: FacilitiesSectionProps) => {
  if (!facilities || facilities.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">World-Class Facilities</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              State-of-the-art infrastructure designed for academic excellence and holistic development
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No facilities information available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">World-Class Facilities</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            State-of-the-art infrastructure designed for academic excellence and holistic development
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border border-border/30 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">{facility}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FacilitiesSection;