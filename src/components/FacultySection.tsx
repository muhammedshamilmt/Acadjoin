import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen } from 'lucide-react';

interface FacultyMember {
  name: string;
  position: string;
  specialization: string;
  experience: string;
  publications: string;
  avatarDataUrl: string;
}

interface FacultySectionProps {
  faculty: FacultyMember[];
}

const FacultySection = ({ faculty }: FacultySectionProps) => {
  if (!faculty || faculty.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Distinguished Faculty</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Learn from industry experts and renowned academics who are leaders in their fields
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No faculty information available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Distinguished Faculty</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Learn from industry experts and renowned academics who are leaders in their fields
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {faculty.map((member, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                      <AvatarImage src={member.avatarDataUrl} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-primary font-semibold mb-3 text-lg">{member.position}</p>
                    <p className="text-muted-foreground mb-4">
                      <span className="font-medium">Specialization:</span> {member.specialization}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Experience</div>
                        <div className="font-semibold text-foreground">{member.experience}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Publications</div>
                        <div className="font-semibold text-primary">{member.publications}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;