import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 2024";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, phone number)",
        "Educational preferences and institution interests",
        "Usage data and analytics to improve our services",
        "Device information and browser data for security purposes",
        "Feedback and communications you send to us"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our educational discovery services",
        "To send you relevant institution recommendations and updates",
        "To communicate with you about your account and our services",
        "To analyze usage patterns and enhance user experience",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We never sell your personal information to third parties",
        "We may share anonymized data with educational institutions for research",
        "We work with service providers who help us operate our platform",
        "We may disclose information if required by law or to protect our users",
        "You control what information is visible in your public profile"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We use industry-standard encryption to protect your data",
        "All sensitive information is stored on secure, encrypted servers",
        "We regularly audit our security practices and systems",
        "Access to personal data is restricted to authorized personnel only",
        "We implement multi-factor authentication and other security measures"
      ]
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
              Your Privacy Matters
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Privacy 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Policy</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and being transparent about how we collect, 
              use, and protect your personal information.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-primary/5 mb-12">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      Our Commitment to Your Privacy
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      At our educational discovery platform, we believe that privacy is a fundamental right. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                      when you use our services. We are committed to protecting your personal information and 
                      your right to privacy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {section.title}
                        </h3>
                      </div>
                      
                      <ul className="space-y-3 ml-16">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-muted-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Your Rights</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate data</li>
                    <li>• Delete your account and data</li>
                    <li>• Export your data</li>
                    <li>• Opt-out of marketing communications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Data Retention</h3>
                  <p className="text-muted-foreground mb-4">
                    We retain your information only as long as necessary to provide our services 
                    and fulfill the purposes outlined in this policy.
                  </p>
                  <p className="text-muted-foreground">
                    You can request deletion of your account at any time through your account settings.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 mt-12">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact our privacy team. We're here to help.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@ourplatform.com</p>
                  <p>Address: Privacy Officer, [Your Company Address]</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;