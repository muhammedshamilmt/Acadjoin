import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  MapPin,
  Star,
  Users,
  GraduationCap,
  Award,
  Phone,
  Mail,
  Globe,
  Building,
  TrendingUp,
  BookOpen,
  Heart,
  Share2,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  IndianRupee
} from 'lucide-react';

export const QuickInfoBox = () => {
  const institute = {
    name: "Indian Institute of Technology Kerala",
    type: "Engineering",
    established: 2016,
    rating: 4.8,
    reviews: 324,
    students: "2.5k+",
    nirfRank: 28,
    accreditation: ["NAAC A++", "NBA", "AICTE"],
    placementRate: "95%"
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="w-5 h-5 text-primary" />
          Quick Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold">{institute.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="text-center p-3 bg-secondary/5 rounded-lg">
            <Users className="w-6 h-6 text-secondary mx-auto mb-1" />
            <div className="text-lg font-bold">{institute.students}</div>
            <div className="text-xs text-muted-foreground">Students</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">NIRF Rank</span>
            <Badge variant="secondary">#{institute.nirfRank}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Established</span>
            <span className="text-sm font-medium">{institute.established}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Placement</span>
            <span className="text-sm font-medium text-green-600">{institute.placementRate}</span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-2">Accreditations</div>
          <div className="flex flex-wrap gap-1">
            {institute.accreditation.map((acc) => (
              <Badge key={acc} variant="outline" className="text-xs">
                {acc}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContactInfoBox = () => {
  const contact = {
    phone: "+91-491-256-2999",
    email: "admissions@iitpkd.ac.in",
    website: "https://iitpkd.ac.in",
    address: "IIT Palakkad Campus, Ahalia Integrated Campus, Kozhippara, Palakkad - 678557"
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 sticky top-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Phone className="w-5 h-5 text-primary" />
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm font-medium">{contact.phone}</div>
              <div className="text-xs text-muted-foreground">Admissions Office</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm font-medium">{contact.email}</div>
              <div className="text-xs text-muted-foreground">Email</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <a href={contact.website} target="_blank" rel="noopener noreferrer" 
                 className="text-sm font-medium text-primary hover:underline">
                Official Website
              </a>
              <div className="text-xs text-muted-foreground">Visit for more info</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm leading-relaxed">{contact.address}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <Button size="sm" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Institute
          </Button>
          <Button size="sm" variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdmissionDeadlineBox = () => {
  const deadlines = [
    { exam: "JEE Advanced", date: "June 15, 2024", status: "Open" },
    { exam: "GATE", date: "March 30, 2024", status: "Closed" },
    { exam: "Direct Admission", date: "July 20, 2024", status: "Open" }
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-orange-600" />
          Admission Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div>
              <div className="text-sm font-medium">{deadline.exam}</div>
              <div className="text-xs text-muted-foreground">{deadline.date}</div>
            </div>
            <Badge 
              variant={deadline.status === 'Open' ? 'default' : 'secondary'}
              className={deadline.status === 'Open' ? 'bg-green-100 text-green-700' : ''}
            >
              {deadline.status}
            </Badge>
          </div>
        ))}
        
        <Button size="sm" className="w-full mt-3">
          <BookOpen className="w-4 h-4 mr-2" />
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};

export const FeesBreakdownBox = () => {
  const fees = [
    { category: "Tuition Fee", amount: "₹2,50,000", period: "per year" },
    { category: "Hostel Fee", amount: "₹45,000", period: "per year" },
    { category: "Mess Fee", amount: "₹35,000", period: "per year" },
    { category: "Other Charges", amount: "₹15,000", period: "per year" }
  ];

  const totalFee = "₹3,45,000";

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 sticky top-[450px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IndianRupee className="w-5 h-5 text-blue-600" />
          Fee Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fees.map((fee, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{fee.category}</div>
              <div className="text-xs text-muted-foreground">{fee.period}</div>
            </div>
            <div className="text-sm font-semibold">{fee.amount}</div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Annual Fee</span>
            <span className="font-bold text-blue-600">{totalFee}</span>
          </div>
        </div>
        
        <Button size="sm" variant="outline" className="w-full mt-3">
          <BookOpen className="w-4 h-4 mr-2" />
          Download Brochure
        </Button>
      </CardContent>
    </Card>
  );
};

export const SimilarInstitutesBox = () => {
  const similarInstitutes = [
    { name: "IIT Bombay", location: "Mumbai", rating: 4.9, rank: "#1" },
    { name: "IIT Delhi", location: "Delhi", rating: 4.8, rank: "#2" },
    { name: "IIT Madras", location: "Chennai", rating: 4.7, rank: "#3" }
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Similar Institutes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {similarInstitutes.map((institute, index) => (
          <div key={index} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg hover:bg-white/70 dark:hover:bg-black/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{institute.name}</span>
              <Badge variant="secondary" className="text-xs">{institute.rank}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{institute.location}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs">{institute.rating}</span>
              </div>
            </div>
          </div>
        ))}
        
        <Button size="sm" variant="outline" className="w-full mt-3">
          <Eye className="w-4 h-4 mr-2" />
          Compare Institutes
        </Button>
      </CardContent>
    </Card>
  );
};

export const QuickActionsBox = () => {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 sticky top-[700px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button size="sm" variant="outline" className="w-full justify-start">
          <Heart className="w-4 h-4 mr-2" />
          Save Institute
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <Share2 className="w-4 h-4 mr-2" />
          Share Institute
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <BookOpen className="w-4 h-4 mr-2" />
          Virtual Tour
        </Button>
      </CardContent>
    </Card>
  );
};