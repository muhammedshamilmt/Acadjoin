import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Flag,
  Heart,
  Star,
  BookOpen,
  Eye,
  Lock
} from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Be Respectful",
      description: "Treat all community members with respect and kindness. We're all here to help each other succeed.",
      rules: [
        "Use respectful language in all interactions",
        "Avoid personal attacks or harassment",
        "Respect different opinions and experiences",
        "Be patient with newcomers to the platform"
      ],
      color: "bg-red-500"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Be Authentic",
      description: "Share genuine experiences and honest opinions to help others make informed decisions.",
      rules: [
        "Only review institutions you've actually attended",
        "Provide honest, balanced feedback",
        "Don't create fake accounts or reviews",
        "Verify your identity when required"
      ],
      color: "bg-green-500"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Be Helpful",
      description: "Contribute valuable content that helps other students in their educational journey.",
      rules: [
        "Share detailed, useful reviews",
        "Answer questions thoughtfully",
        "Provide specific examples when possible",
        "Update your information when circumstances change"
      ],
      color: "bg-blue-500"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Respect Privacy",
      description: "Protect personal information and respect the privacy of others in the community.",
      rules: [
        "Don't share personal contact information publicly",
        "Respect confidential institutional information",
        "Ask before sharing someone else's experiences",
        "Use privacy settings appropriately"
      ],
      color: "bg-purple-500"
    }
  ];

  const prohibitedContent = [
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Spam and Self-Promotion",
      description: "Excessive promotional content, irrelevant links, or repetitive posts"
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Fake Reviews",
      description: "Reviews for institutions you haven't attended or fake positive/negative reviews"
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Harassment",
      description: "Bullying, threatening, or discriminatory behavior towards any community member"
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Inappropriate Content",
      description: "Content that is offensive, illegal, or not suitable for an educational platform"
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Misinformation",
      description: "Deliberately sharing false information about institutions or the platform"
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Violation of Privacy",
      description: "Sharing personal information without consent or doxxing other users"
    }
  ];

  const reportingSteps = [
    {
      step: 1,
      title: "Identify the Issue",
      description: "Determine what guideline has been violated"
    },
    {
      step: 2,
      title: "Use Report Feature",
      description: "Click the report button on the problematic content"
    },
    {
      step: 3,
      title: "Provide Details",
      description: "Explain the issue clearly and provide context"
    },
    {
      step: 4,
      title: "Wait for Review",
      description: "Our team will review and take appropriate action"
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations result in a warning and guidance",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    {
      level: "Content Removal",
      description: "Violating content is removed and user is notified",
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    {
      level: "Temporary Suspension",
      description: "Account access is temporarily restricted",
      color: "bg-red-100 text-red-800 border-red-200"
    },
    {
      level: "Permanent Ban",
      description: "Severe or repeated violations result in permanent account removal",
      color: "bg-gray-100 text-gray-800 border-gray-200"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Shield size={16} className="mr-2" />
              Community Guidelines
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Building a 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Safe Community</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our community guidelines help create a positive, supportive environment where students can share authentic experiences and help each other succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Core Guidelines */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Guidelines</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide how we interact and support each other in the EduPath community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`${guideline.color} text-white p-3 rounded-lg`}>
                      {guideline.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{guideline.title}</CardTitle>
                      <p className="text-muted-foreground">{guideline.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guideline.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Content */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What's Not Allowed</h2>
              <p className="text-muted-foreground">
                To maintain a safe and helpful community, the following content is prohibited on EduPath.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prohibitedContent.map((item, index) => (
                <div 
                  key={index}
                  className="bg-background rounded-lg p-6 border border-border/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    {item.icon}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">How to Report Violations</h2>
              <p className="text-muted-foreground">
                Help us maintain community standards by reporting content that violates our guidelines.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {reportingSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button size="lg">
                <Flag className="w-4 h-4 mr-2" />
                Report Content
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Enforcement & Consequences</h2>
              <p className="text-muted-foreground">
                We take guideline violations seriously and apply consequences fairly and consistently.
              </p>
            </div>

            <div className="space-y-4">
              {consequences.map((consequence, index) => (
                <div 
                  key={index}
                  className={`rounded-lg p-6 border ${consequence.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{consequence.level}</h3>
                      <p className="text-sm opacity-90">{consequence.description}</p>
                    </div>
                    <AlertTriangle className="w-6 h-6 opacity-70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appeals Process */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Appeals Process</h2>
            <p className="text-muted-foreground mb-8">
              If you believe your content was removed or your account was suspended in error, you can appeal our decision.
            </p>
            
            <Card>
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Submit an Appeal</h3>
                <p className="text-muted-foreground mb-6">
                  Our review team will carefully reconsider your case and respond within 48 hours.
                </p>
                <Button size="lg">
                  Submit Appeal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions About Guidelines?</h2>
            <p className="text-muted-foreground mb-8">
              If you have questions about our community guidelines or need clarification on any policy, we're here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;