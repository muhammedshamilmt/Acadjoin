import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Building2, 
  UserCheck, 
  Trophy,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Register = () => {
  const instituteFeatures = [
    "Comprehensive institute profile",
    "Faculty management system", 
    "Course catalog management",
    "Placement cell integration",
    "Student enrollment tracking",
    "Academic program showcase"
  ];

  const peopleFeatures = [
    "Personal profile creation",
    "Skills and achievements showcase",
    "Educational background",
    "Professional experience",
    "Document uploads",
    "Career opportunities access"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-hero-gradient bg-clip-text text-transparent">
            Join Our Educational Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your registration type to become part of our growing network of educational institutions and learners
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Institute Registration */}
          <Card className="relative overflow-hidden group hover:shadow-glass transition-all duration-300 border-2 hover:border-primary/20">
            <div className="absolute inset-0 bg-hero-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-sm">
                  Institutions
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">Register Your Institute</CardTitle>
              <CardDescription className="text-base">
                Showcase your educational institution, manage faculty, courses, and connect with students
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm">Academic Programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Faculty Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm">Course Catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-sm">Placement Cell</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What you'll get:</h4>
                <ul className="space-y-1">
                  {instituteFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register-institute" className="block">
                <Button className="w-full group">
                  Register Institute
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* People Registration */}
          <Card className="relative overflow-hidden group hover:shadow-glass transition-all duration-300 border-2 hover:border-primary/20">
            <div className="absolute inset-0 bg-hero-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-sm">
                  Individuals
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">Register as Individual</CardTitle>
              <CardDescription className="text-base">
                Create your professional profile, showcase skills, and explore educational opportunities
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Personal Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-sm">Skills Showcase</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm">Education History</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm">Career Growth</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What you'll get:</h4>
                <ul className="space-y-1">
                  {peopleFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register-people" className="block">
                <Button className="w-full group">
                  Register Individual
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Why Join Our Platform?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Comprehensive Platform</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete solution for educational institutions and individuals
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Growing Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with thousands of educators, students, and institutions
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Success Focused</h4>
                  <p className="text-sm text-muted-foreground">
                    Tools and features designed to help you achieve your goals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;