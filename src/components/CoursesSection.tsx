import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ExternalLink } from 'lucide-react';

interface Course {
  name: string;
  duration: string;
  fees: string;
  seats: string;
  cutoff: string;
  viewDetailsLink: string;
  applyNowLink: string;
}

interface CoursesSectionProps {
  courses: Course[];
}

const CoursesSection = ({ courses }: CoursesSectionProps) => {
  if (!courses || courses.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Programs</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Comprehensive academic programs designed to shape future leaders and innovators
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses information available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Programs</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Comprehensive academic programs designed to shape future leaders and innovators
          </p>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold text-foreground">
                        {course.name}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">{course.duration}</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Fees</div>
                        <div className="font-semibold text-primary">{course.fees}</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Seats</div>
                        <div className="font-semibold text-foreground">{course.seats}</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Cutoff</div>
                        <div className="font-semibold text-xs text-foreground">{course.cutoff}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {course.viewDetailsLink ? (
                      <Button 
                        className="group-hover:scale-105 transition-transform duration-300"
                        onClick={() => window.open(course.viewDetailsLink, '_blank')}
                      >
                        View Details
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <Button className="group-hover:scale-105 transition-transform duration-300" disabled>
                        View Details
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    )}
                    {course.applyNowLink ? (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(course.applyNowLink, '_blank')}
                      >
                        Apply Now
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Apply Now
                      </Button>
                    )}
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

export default CoursesSection;