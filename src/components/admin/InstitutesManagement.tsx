"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Building2, 
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface Institute {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "pending" | "approved" | "rejected" | "draft" | "submitted";
  createdAt: string;
  logoDataUrl?: string;
  type: string;
  description: string;
  website?: string;
  city?: string;
  state?: string;
  established?: string;
  registrationId?: string;
}

const InstitutesManagement = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [instituteToDelete, setInstituteToDelete] = useState<Institute | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Calculate statistics
  const getStatistics = () => {
    const total = institutes.length;
    const pending = institutes.filter(inst => inst.status === 'pending').length;
    const rejected = institutes.filter(inst => inst.status === 'rejected').length;
    const approved = institutes.filter(inst => inst.status === 'approved').length;
    
    return { total, pending, rejected, approved };
  };

  const statistics = getStatistics();

  useEffect(() => {
    loadInstitutes();
  }, []);

  useEffect(() => {
    filterInstitutes();
  }, [institutes, searchTerm, statusFilter, typeFilter]);

  const loadInstitutes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from the API
      const response = await fetch('/api/institute-registration');
      if (!response.ok) {
        throw new Error('Failed to fetch institutes');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const institutesData = data.registrations || [];
        
        // Debug: Log the status values to see what we're getting
        console.log('Institutes data:', institutesData);
        console.log('Statistics from API:', data.statistics);
        const statuses = institutesData.map((inst: any) => inst.status);
        console.log('Status values found:', [...new Set(statuses)]);
        
        setInstitutes(institutesData);
      } else {
        console.error('API Error Response:', data);
        throw new Error(data.error || data.details || 'Failed to fetch institutes');
      }
    } catch (error) {
      console.error("Error loading institutes:", error);
      toast.error("Failed to load institutes data");
      
      // Fallback to mock data if API fails
      const mockInstitutes: Institute[] = [
        {
          _id: "1",
          name: "Tech Academy",
          email: "info@techacademy.com",
          phone: "+1234567890",
          address: "123 Tech Street, Silicon Valley, CA",
          status: "approved",
          createdAt: "2024-01-15T00:00:00.000Z",
          type: "Technology",
          description: "Leading technology education institute",
          website: "https://techacademy.com",
        },
        {
          _id: "2",
          name: "Business School Pro",
          email: "contact@businesschoolpro.com",
          phone: "+1234567891",
          address: "456 Business Ave, New York, NY",
          status: "submitted",
          createdAt: "2024-01-20T00:00:00.000Z",
          type: "Business",
          description: "Professional business education",
          website: "https://businesschoolpro.com",
        },
        {
          _id: "3",
          name: "Creative Arts Institute",
          email: "hello@creativearts.edu",
          phone: "+1234567892",
          address: "789 Arts Boulevard, Los Angeles, CA",
          status: "pending",
          createdAt: "2024-01-10T00:00:00.000Z",
          type: "Arts",
          description: "Creative arts and design education",
        },
        {
          _id: "4",
          name: "Medical Training Center",
          email: "info@medicaltraining.edu",
          phone: "+1234567893",
          address: "321 Health Drive, Boston, MA",
          status: "rejected",
          createdAt: "2024-01-25T00:00:00.000Z",
          type: "Healthcare",
          description: "Medical and healthcare training",
          website: "https://medicaltraining.edu",
        },
      ];

      setInstitutes(mockInstitutes);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInstitutes = () => {
    let filtered = institutes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        institute =>
          institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          institute.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          institute.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(institute => institute.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(institute => institute.type === typeFilter);
    }

    setFilteredInstitutes(filtered);
  };

  const handleStatusChange = async (instituteId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(instituteId);
      
      // Make API call to update the status
      const response = await fetch(`/api/institute-registration/${instituteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      // Update local state
      setInstitutes(prev =>
        prev.map(institute =>
          institute._id === instituteId ? { ...institute, status: newStatus as any } : institute
        )
      );
      
      toast.success(`Status updated to ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteInstitute = async (instituteId: string) => {
    try {
      setIsDeleting(instituteId);
      
      // Make API call to delete the institute
      const response = await fetch(`/api/institute-registration/${instituteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete institute');
      }

      // Update local state
      setInstitutes(prev => prev.filter(institute => institute._id !== instituteId));
      toast.success("Institute deleted successfully");
      setInstituteToDelete(null); // Close the dialog
    } catch (error) {
      console.error("Error deleting institute:", error);
      toast.error("Failed to delete institute");
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    // Safety check for undefined or null status
    if (!status || typeof status !== 'string') {
      console.warn(`Invalid status value:`, status);
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" />
          Unknown
        </Badge>
      );
    }

    const statusConfig = {
      approved: { color: "bg-green-100 text-green-800", label: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected", icon: XCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: Clock },
      submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted", icon: CheckCircle },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft", icon: Clock },
      active: { color: "bg-green-100 text-green-800", label: "Active", icon: CheckCircle },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive", icon: XCircle },
      verified: { color: "bg-blue-100 text-blue-800", label: "Verified", icon: CheckCircle },
      unverified: { color: "bg-yellow-100 text-yellow-800", label: "Unverified", icon: Clock },
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig];
    
    // Handle undefined status or unknown status values
    if (!config) {
      console.warn(`Unknown status value: "${status}"`);
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
    }
    
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInstituteTypes = () => {
    const types = institutes.map(institute => institute.type);
    return [...new Set(types)];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Institutes Management</h2>
          <p className="text-muted-foreground">
            Manage institute registrations and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch('/api/institute-registration');
                const data = await response.json();
                console.log('API Test Response:', data);
                if (data.success) {
                  toast.success(`Found ${data.registrations?.length || 0} institutes`);
                } else {
                  toast.error(`API Error: ${data.error}`);
                }
              } catch (error) {
                toast.error('API test failed');
              }
            }}
          >
            Test API
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Building2 className="mr-2 h-4 w-4" />
            Add Institute
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered institutes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Institutes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Institutes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Institutes</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Rejected applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search institutes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Types</option>
              {getInstituteTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Institutes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Institutes</CardTitle>
          <CardDescription>
            {filteredInstitutes.length} institutes found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institute</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstitutes.map((institute) => (
                  <TableRow key={institute._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={institute.logoDataUrl} />
                          <AvatarFallback>
                            {getInitials(institute.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{institute.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {institute.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{institute.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {institute.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{institute.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(institute.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(institute.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedInstitute(institute)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          
                          {institute.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(institute._id, "approved")}
                                disabled={isUpdatingStatus === institute._id}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isUpdatingStatus === institute._id ? "Approving..." : "Approve"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(institute._id, "rejected")}
                                disabled={isUpdatingStatus === institute._id}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {isUpdatingStatus === institute._id ? "Rejecting..." : "Reject"}
                              </DropdownMenuItem>
                            </>
                          )}
                          {institute.status === "submitted" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(institute._id, "approved")}
                                disabled={isUpdatingStatus === institute._id}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isUpdatingStatus === institute._id ? "Approving..." : "Approve"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(institute._id, "rejected")}
                                disabled={isUpdatingStatus === institute._id}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {isUpdatingStatus === institute._id ? "Rejecting..." : "Reject"}
                              </DropdownMenuItem>
                            </>
                          )}
                          {institute.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(institute._id, "rejected")}
                              disabled={isUpdatingStatus === institute._id}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {isUpdatingStatus === institute._id ? "Rejecting..." : "Reject"}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setInstituteToDelete(institute)}
                            className="text-red-600"
                            disabled={isDeleting === institute._id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting === institute._id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Institute Details Dialog */}
      <Dialog open={!!selectedInstitute} onOpenChange={() => setSelectedInstitute(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Institute Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedInstitute?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInstitute && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedInstitute.logoDataUrl} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedInstitute.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedInstitute.name}</h3>
                  <p className="text-muted-foreground">{selectedInstitute.type}</p>
                  {getStatusBadge(selectedInstitute.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </label>
                    <p>{selectedInstitute.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </label>
                    <p>{selectedInstitute.phone}</p>
                  </div>
                  {selectedInstitute.website && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Website</label>
                      <p>
                        <a 
                          href={selectedInstitute.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedInstitute.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Address
                    </label>
                    <p>{selectedInstitute.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p>{new Date(selectedInstitute.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm">{selectedInstitute.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!instituteToDelete} onOpenChange={() => setInstituteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this institute?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the institute registration
              for <strong>{instituteToDelete?.name}</strong> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => instituteToDelete && handleDeleteInstitute(instituteToDelete._id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting === instituteToDelete?._id}
            >
              {isDeleting === instituteToDelete?._id ? "Deleting..." : "Delete Institute"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstitutesManagement;
