import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  Target, 
  Heart, 
  Star, 
  Award, 
  Lightbulb,
  Shield,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '12,000+', label: 'Students Guided' },
    { icon: GraduationCap, value: '500+', label: 'Partner Institutions' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' },
    { icon: Award, value: '95%', label: 'Success Rate' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Student-Centric',
      description: 'Every decision we make puts students first, ensuring they find the perfect educational path.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We provide honest, unbiased information to help students make informed decisions.'
    },
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We believe in empowering students with knowledge and connections to achieve their dreams.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to make educational guidance more accessible and effective.'
    },
  ];

  const team = [
    {
      name: 'Muhammed Shamil MT',
      role: 'Founder & CEO',
      bio: 'Founder of  Acadjoin,A BCA student from kerala',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Arjun Menon',
      role: 'Head of Technology',
      bio: 'Tech enthusiast passionate about building platforms that make education more accessible to everyone.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Shreya Thomas',
      role: 'Student Success Lead',
      bio: 'Dedicated to ensuring every student gets personalized guidance and support throughout their journey.',
      image: '/api/placeholder/150/150'
    },
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
              About Acadjoin
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Connecting Dreams with 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Reality</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize educational guidance in India. Every student deserves 
              access to authentic information, peer insights, and expert guidance to make the best 
              educational choices for their future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/institute">
                <Button size="lg" className="group">
                  Explore Institutions
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </Button>
              </Link>
              <Link href="/reviews">
                <Button variant="outline" size="lg">
                  Read Student Stories
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Born from the real struggles of students navigating educational choices in India
              </p>
            </div>

            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
              <p>
                Acadjoin was founded in 2023 when our team realized that despite India having 
                world-class educational institutions, students often lacked access to authentic, 
                unbiased information about these institutions. Too many bright minds were making 
                suboptimal choices simply due to lack of proper guidance.
              </p>
              
              <p>
                What started as a small initiative in Kerala has now grown into a comprehensive 
                platform serving students across India. We believe that every student, regardless 
                of their background, should have access to the same quality of educational guidance 
                that was once available only to the privileged few.
              </p>
              
              <p>
                Today, we're proud to be the bridge between students' aspirations and their perfect 
                educational matches. Through peer reviews, institutional partnerships, and expert 
                guidance, we're helping thousands of students make informed decisions about their future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="p-8 hover:shadow-lg transition-all duration-300 border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate educators and technologists working to transform educational guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={member.name}
                className="p-8 text-center hover:shadow-lg transition-all duration-300 border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mx-auto flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Start Your Educational Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who have found their perfect educational match with Acadjoin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="group">
                  Get Started Today
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </Button>
              </Link>
              <Link href="/institute">
                <Button variant="outline" size="lg">
                  Browse Institutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;