import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  ArrowRight,
  Building,
  Heart,
  Zap,
  Target,
  Mail
} from 'lucide-react';

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Zap,
      title: "Growth Opportunities",
      description: "Continuous learning and career advancement paths"
    },
    {
      icon: Target,
      title: "Impact Work",
      description: "Help students find their perfect educational journey"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented individuals"
    }
  ];

  const departments = [
    "Engineering",
    "Product",
    "Design", 
    "Marketing",
    "Sales",
    "Operations",
    "Data Science",
    "Customer Success"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Join Our Team
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Shape the Future of 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Education</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Help millions of students discover their perfect educational path. Join our mission to make 
              quality education accessible and transparent for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                <Mail className="mr-2" size={20} />
                Get Notified When We're Hiring
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn About Our Culture
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Opportunities Coming Soon
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're building an amazing team to revolutionize how students discover educational opportunities. 
              While we don't have open positions right now, exciting opportunities are on the horizon.
            </p>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Be the First to Know
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join our talent pipeline and we'll reach out when positions that match your skills become available.
                </p>
                <Button className="w-full sm:w-auto">
                  <Mail className="mr-2" size={18} />
                  Join Talent Pipeline
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why You'll Love Working Here
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join a team that's passionate about making education accessible and transparent for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card 
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 border-border/50"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Future Departments */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Departments We're Building
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              We're planning to build world-class teams across these key areas.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <Card 
                  key={index}
                  className="hover:bg-primary/5 transition-all duration-300 cursor-pointer border-border/50"
                >
                  <CardContent className="p-4 text-center">
                    <Building className="w-6 h-6 text-primary mx-auto mb-2" />
                    <span className="font-medium text-foreground">{dept}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
              <CardContent className="p-12 space-y-6">
                <Star className="w-12 h-12 text-primary mx-auto" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Ready to Make an Impact?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Even though we're not hiring yet, we'd love to hear from passionate individuals 
                  who share our vision of transforming education.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Mail className="mr-2" size={20} />
                  Stay in Touch
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;