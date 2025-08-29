'use client'
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  Video,
  FileText,
  Users,
  Lightbulb
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      title: "Getting Started",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-500",
      articles: 12
    },
    {
      id: 2,
      title: "Account & Profile",
      icon: <Users className="w-6 h-6" />,
      color: "bg-green-500",
      articles: 8
    },
    {
      id: 3,
      title: "Institute Search",
      icon: <Search className="w-6 h-6" />,
      color: "bg-purple-500",
      articles: 15
    },
    {
      id: 4,
      title: "Reviews & Ratings",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "bg-orange-500",
      articles: 6
    },
    {
      id: 5,
      title: "Troubleshooting",
      icon: <HelpCircle className="w-6 h-6" />,
      color: "bg-red-500",
      articles: 10
    },
    {
      id: 6,
      title: "Tips & Best Practices",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "bg-yellow-500",
      articles: 7
    }
  ];

  const faqs = [
    {
      question: "How do I search for institutes on EduPath?",
      answer: "You can search for institutes using our search bar on the homepage or institutes page. Filter by location, course type, fees, and ratings to find the perfect match for your needs."
    },
    {
      question: "Are the reviews on EduPath authentic?",
      answer: "Yes, all reviews on EduPath are verified. We have a strict verification process where reviewers must provide proof of enrollment or attendance at the institution they're reviewing."
    },
    {
      question: "How can I add my institute to EduPath?",
      answer: "Institute administrators can register their institutions through our 'Add Institute' portal. We verify all institutional information before listing to ensure accuracy and authenticity."
    },
    {
      question: "Can I connect with current students or alumni?",
      answer: "Absolutely! EduPath facilitates connections between prospective students and current students/alumni through our mentorship program and community forums."
    },
    {
      question: "Is EduPath free to use?",
      answer: "Yes, EduPath is completely free for students. You can search institutes, read reviews, and connect with mentors at no cost. Some premium features may be available for institutions."
    },
    {
      question: "How do I report inappropriate content or reviews?",
      answer: "You can report any inappropriate content using the 'Report' button available on each review or post. Our moderation team reviews all reports within 24 hours."
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="w-6 h-6" />,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Email Support",
      description: "Send us detailed questions via email",
      icon: <Mail className="w-6 h-6" />,
      action: "Send Email",
      available: "Response in 4-6 hours"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: <Phone className="w-6 h-6" />,
      action: "Call Now",
      available: "Mon-Fri, 9 AM - 6 PM"
    },
    {
      title: "Video Call",
      description: "Schedule a video consultation",
      icon: <Video className="w-6 h-6" />,
      action: "Book Call",
      available: "By appointment"
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
              <HelpCircle size={16} className="mr-2" />
              Help Center
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              How Can We 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Help You?</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to your questions, browse helpful articles, or get in touch with our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find the help you need in these popular categories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${category.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.articles} articles available
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Articles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to common questions</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-background rounded-lg border border-border/50 px-6"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground">Choose the best way to get in touch with our support team</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <Card 
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-lg w-fit mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    <Badge variant="secondary" className="mb-4">{option.available}</Badge>
                  </div>
                  <Button className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Additional Resources</h2>
            <p className="text-muted-foreground mb-8">More ways to get the most out of EduPath</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">User Guide</h3>
                  <p className="text-sm text-muted-foreground mb-4">Complete guide to using EduPath</p>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground mb-4">Step-by-step video guides</p>
                  <Button variant="outline" size="sm">Watch Videos</Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Community Forum</h3>
                  <p className="text-sm text-muted-foreground mb-4">Connect with other users</p>
                  <Button variant="outline" size="sm">Join Forum</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;