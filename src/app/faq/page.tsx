"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail,
  BookOpen,
  Users,
  Settings,
  Shield,
  CreditCard,
  Phone
} from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      icon: <BookOpen className="w-4 h-4" />,
      faqs: [
        {
          question: "What is EduPath?",
          answer: "EduPath is a comprehensive platform that connects students with educational institutions across India. We provide verified reviews, detailed institution information, and facilitate connections between prospective students and current students/alumni."
        },
        {
          question: "Is EduPath free to use?",
          answer: "Yes, EduPath is completely free for students. You can search institutions, read reviews, connect with mentors, and access all our resources at no cost."
        },
        {
          question: "How do I get started on EduPath?",
          answer: "Simply visit our homepage and start exploring! You can search for institutions, browse by location or course type, read reviews, and create an account to save your favorite institutions and connect with mentors."
        },
        {
          question: "What makes EduPath different from other platforms?",
          answer: "EduPath focuses specifically on the Indian education system with verified reviews, authentic student experiences, and a community-driven approach. We prioritize transparency and genuine connections between students."
        }
      ]
    },
    {
      id: 'account',
      name: 'Account',
      icon: <Users className="w-4 h-4" />,
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' in the top right corner of our website. You can register using your email address or sign up with Google for quick access."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "On the login page, click 'Forgot Password' and enter your email address. We'll send you a secure link to reset your password."
        },
        {
          question: "Can I change my profile information?",
          answer: "Yes, once logged in, go to your profile settings where you can update your personal information, contact details, and preferences."
        },
        {
          question: "How do I delete my account?",
          answer: "To delete your account, go to Profile Settings > Account Settings > Delete Account. Please note that this action is irreversible."
        }
      ]
    },
    {
      id: 'search',
      name: 'Search & Discovery',
      icon: <Search className="w-4 h-4" />,
      faqs: [
        {
          question: "How do I search for institutions?",
          answer: "Use our search bar on the homepage or institutions page. You can search by institution name, location, course type, or use our advanced filters for more specific results."
        },
        {
          question: "What filters are available?",
          answer: "You can filter by location (state/city), course type, fees range, ratings, institution type (government/private), and establishment year."
        },
        {
          question: "How do I find courses offered by institutions?",
          answer: "Visit our Courses page where you can search for specific courses and see which institutions offer them, along with fees, duration, and other details."
        },
        {
          question: "Can I save institutions for later?",
          answer: "Yes, create an account and use the 'Save' or 'Bookmark' feature on any institution page to add it to your favorites list."
        }
      ]
    },
    {
      id: 'reviews',
      name: 'Reviews & Ratings',
      icon: <MessageCircle className="w-4 h-4" />,
      faqs: [
        {
          question: "Are the reviews on EduPath authentic?",
          answer: "Yes, all reviews are verified. Reviewers must provide proof of enrollment or attendance. We have a strict moderation process to ensure authenticity."
        },
        {
          question: "How can I write a review?",
          answer: "Create an account, find the institution you want to review, and click 'Write Review'. You'll need to verify your connection to the institution."
        },
        {
          question: "Can I edit or delete my review?",
          answer: "Yes, you can edit or delete your reviews from your profile page. However, we encourage honest, constructive feedback that helps other students."
        },
        {
          question: "How do you handle fake reviews?",
          answer: "We use advanced verification systems and manual moderation. Fake reviews are removed, and accounts posting them may be banned."
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: <Settings className="w-4 h-4" />,
      faqs: [
        {
          question: "The website is loading slowly. What should I do?",
          answer: "Try refreshing the page, clearing your browser cache, or switching to a different browser. If the problem persists, contact our technical support."
        },
        {
          question: "I'm having trouble logging in. What's wrong?",
          answer: "Ensure you're using the correct email and password. Try resetting your password if needed. Clear your browser cookies and try again."
        },
        {
          question: "Can I use EduPath on my mobile device?",
          answer: "Yes, EduPath is fully responsive and works on all devices including smartphones and tablets. We also have mobile apps coming soon."
        },
        {
          question: "Why can't I see certain features?",
          answer: "Some features may require account creation or verification. Ensure you're logged in and have completed your profile setup."
        }
      ]
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      icon: <Shield className="w-4 h-4" />,
      faqs: [
        {
          question: "How is my personal information protected?",
          answer: "We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without consent."
        },
        {
          question: "What information do you collect?",
          answer: "We collect basic profile information, usage data to improve our services, and information you voluntarily provide in reviews and interactions."
        },
        {
          question: "Can I control who sees my profile?",
          answer: "Yes, you can adjust your privacy settings to control what information is visible to other users and institutions."
        },
        {
          question: "Do you use cookies?",
          answer: "Yes, we use cookies to improve your browsing experience and analyze site usage. You can manage cookie preferences in your browser settings."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

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
              Frequently Asked Questions
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Got 
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Questions?</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions about EduPath. Can't find what you're looking for? Contact our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
                {faqCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {faqCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="space-y-4">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{category.name} Questions</h2>
                      <p className="text-muted-foreground">
                        {category.faqs.length} questions in this category
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                      {(searchQuery ? filteredFAQs.find(cat => cat.id === category.id)?.faqs || [] : category.faqs).map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${category.id}-${index}`}
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

                    {searchQuery && filteredFAQs.find(cat => cat.id === category.id)?.faqs.length === 0 && (
                      <div className="text-center py-8">
                        <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-foreground">Still Need Help?</h2>
            <p className="text-muted-foreground">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button size="lg" className="h-16">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="h-16">
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Average response time: 2-4 hours</p>
              <p>Support available: Monday - Friday, 9 AM - 6 PM IST</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;