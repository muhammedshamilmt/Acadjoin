import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Users, AlertTriangle, Scale, Mail } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "January 2024";

  const sections = [
    {
      icon: Users,
      title: "User Accounts & Responsibilities",
      content: [
        "You must be at least 13 years old to use our services",
        "Provide accurate and complete information when creating your account",
        "Keep your account credentials secure and confidential",
        "You are responsible for all activities under your account",
        "Notify us immediately of any unauthorized use of your account"
      ]
    },
    {
      icon: Shield,
      title: "Acceptable Use Policy",
      content: [
        "Use our platform only for lawful purposes and in accordance with these terms",
        "Do not impersonate others or provide false information about institutions",
        "Respect the intellectual property rights of others",
        "Do not attempt to gain unauthorized access to our systems",
        "Report any violations of these terms to our support team"
      ]
    },
    {
      icon: FileText,
      title: "Content and Reviews",
      content: [
        "You retain ownership of content you post, but grant us license to use it",
        "Reviews and ratings must be honest and based on genuine experiences",
        "We reserve the right to remove content that violates our guidelines",
        "Do not post spam, offensive, or inappropriate content",
        "Respect privacy and do not share personal information of others"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Disclaimers & Limitations",
      content: [
        "Information provided is for general purposes and may not be complete",
        "We do not guarantee admission to any educational institution",
        "Institution information is provided by third parties and may change",
        "We are not responsible for decisions made based on our platform",
        "Use our services at your own risk and discretion"
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
              Legal Terms
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Terms of 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Service</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of our educational discovery platform. Please read them 
              carefully as they contain important information about your rights and obligations.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Scale className="w-4 h-4" />
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
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      Agreement to Terms
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing and using our educational discovery platform, you accept and agree to be 
                      bound by the terms and provision of this agreement. If you do not agree to abide by the 
                      above, please do not use this service. These terms apply to all users of the platform, 
                      including students, educators, and institutional representatives.
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

            {/* Additional Important Sections */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Termination</h3>
                  <p className="text-muted-foreground mb-3">
                    We may terminate or suspend your account and access to our services at any time, 
                    with or without cause, and with or without notice.
                  </p>
                  <p className="text-muted-foreground">
                    You may also terminate your account at any time through your account settings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Modifications</h3>
                  <p className="text-muted-foreground mb-3">
                    We reserve the right to modify these terms at any time. We will notify users 
                    of significant changes via email or platform notifications.
                  </p>
                  <p className="text-muted-foreground">
                    Continued use of our services after changes constitutes acceptance of the new terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Governing Law</h3>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the laws of India. 
                    Any disputes arising from these terms will be subject to the jurisdiction of Indian courts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Intellectual Property</h3>
                  <p className="text-muted-foreground">
                    Our platform and its content are protected by copyright, trademark, and other laws. 
                    You may not reproduce, distribute, or create derivative works without our permission.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 mt-12">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service, please contact our legal team. 
                  We're here to clarify any concerns you may have.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: legal@ourplatform.com</p>
                  <p>Address: Legal Department, [Your Company Address]</p>
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

export default TermsOfService;