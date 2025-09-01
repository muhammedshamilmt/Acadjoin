'use client'

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Map as MapIcon,
  Building2,
  GraduationCap,
  Users,
  Star,
  BookOpen,
  Info,
  HelpCircle,
  FileText,
  Mail,
  ShieldCheck,
  Scale,
  Home,
  Link as LinkIcon,
  ChevronRight,
  Search
} from 'lucide-react';

const sections = [
  {
    title: 'Core Pages',
    icon: Home,
    links: [
      { label: 'Home', href: '/' },
      { label: 'Institutes', href: '/institutes' },
      { label: 'Courses', href: '/courses' },
      { label: 'People', href: '/people' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
  {
    title: 'Profiles',
    icon: Users,
    links: [
      { label: 'User Profile (Test)', href: '/test-user-profile' },
      { label: 'User Profile', href: '/user-profile' },
      { label: 'People Profile (Sample)', href: '/people-profile/preview' },
      { label: 'Institute Profile (Sample)', href: '/institute-profile' },
    ],
  },
  {
    title: 'Registration',
    icon: GraduationCap,
    links: [
      { label: 'Register (Overview)', href: '/registration' },
      { label: 'Register as Institute', href: '/register-institute' },
      { label: 'Register as Individual', href: '/register-people' },
      { label: 'Login', href: '/login' },
      { label: 'Signup', href: '/signup' },
    ],
  },
  {
    title: 'Company',
    icon: Info,
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Help Center', href: '/helpcenter' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Community Guidelines', href: '/communityguidelines' },
    ],
  },
  {
    title: 'Legal',
    icon: Scale,
    links: [
      { label: 'Privacy Policy', href: '/privacypolicy' },
      { label: 'Terms of Service', href: '/termsofservice' },
    ],
  },
  {
    title: 'Admin',
    icon: ShieldCheck,
    links: [
      { label: 'Admin', href: '/admin' },
    ],
  },
];

const quickLinks = [
  { label: 'Top Institutes', href: '/institutes', icon: Building2 },
  { label: 'Popular Courses', href: '/courses', icon: BookOpen },
  { label: 'Find Mentors', href: '/people', icon: Users },
  { label: 'Read Reviews', href: '/reviews', icon: Star },
  { label: 'Get Help', href: '/helpcenter', icon: HelpCircle },
  { label: 'Contact Us', href: '/contact', icon: Mail },
];

export default function SiteMapPage() {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map(section => ({
        ...section,
        links: section.links.filter(l =>
          l.label.toLowerCase().includes(q) || l.href.toLowerCase().includes(q)
        )
      }))
      .filter(section => section.links.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-12 pb-10 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 inline-flex items-center gap-2">
              <MapIcon size={16} />
              Site Map
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Explore the <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Acadjoin</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Quickly find pages and destinations across the platform. Use the search or browse by category.
            </p>

            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages (e.g., institutes, privacy, register)..."
                className="pl-10 h-12"
              />
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}>
                  <Badge variant="outline" className="px-3 py-1.5 flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Icon size={14} /> {label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredSections.map(({ title, icon: Icon, links }) => (
              <Card key={title} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={18} className="text-primary" />
                    <h2 className="text-lg font-semibold">{title}</h2>
                  </div>

                  <nav className="space-y-1">
                    {links.map(link => (
                      <Link key={link.href} href={link.href} className="group block">
                        <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent/50 border border-transparent hover:border-border transition-colors">
                          <div className="flex items-center gap-2">
                            <LinkIcon size={14} className="text-muted-foreground group-hover:text-primary" />
                            <span className="text-sm text-foreground">{link.label}</span>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" />
                        </div>
                      </Link>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Extra Section: Helpful Docs */}
          <div className="mt-10">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold">Helpful Documentation</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Admin Setup', href: '/ADMIN_SETUP.md' },
                    { label: 'Firebase Setup', href: '/FIREBASE_SETUP.md' },
                    { label: 'Email Validation Rules', href: '/EMAIL_VALIDATION.md' },
                    { label: 'Login Troubleshooting', href: '/LOGIN_TROUBLESHOOTING.md' },
                    { label: 'Readme', href: '/README.md' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} className="group">
                      <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent/50 border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
