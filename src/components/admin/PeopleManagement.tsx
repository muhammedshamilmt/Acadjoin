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
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Filter,
  Download,
  Clock,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: "active" | "inactive" | "pending" | "approved" | "rejected";
  createdAt: string;
  profilePicture?: string;
  type: string;
  location?: string;
  bio?: string;
  studiedInstitution?: string;
  careerGoals?: string;
  expectedSalary?: string;
  averageResponseTime?: string;
  interestedFields?: string[];
  preferredLocations?: string[];
  skills?: string[];
  specializations?: string[];
  achievements?: string[];
}

const PeopleManagement = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Calculate statistics
  const getStatistics = () => {
    const total = people.length;
    const active = people.filter(person => person.status === 'active').length;
    const inactive = people.filter(person => person.status === 'inactive').length;
    const pending = people.filter(person => person.status === 'pending').length;
    const approved = people.filter(person => person.status === 'approved').length;
    const rejected = people.filter(person => person.status === 'rejected').length;
    
    return { total, active, inactive, pending, approved, rejected };
  };

  const statistics = getStatistics();

  useEffect(() => {
    loadPeople();
  }, []);

  useEffect(() => {
    filterPeople();
  }, [people, searchTerm, statusFilter]);

  const loadPeople = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from the API
      const response = await fetch('/api/people-registration');
      if (!response.ok) {
        throw new Error('Failed to fetch people');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const peopleData = data.registrations || [];
        
        // Debug: Log the data to see what we're getting
        console.log('People data:', peopleData);
        console.log('Statistics from API:', data.statistics);
        
        setPeople(peopleData);
      } else {
        console.error('API Error Response:', data);
        throw new Error(data.error || data.details || 'Failed to fetch people');
      }
    } catch (error) {
      console.error("Error loading people:", error);
      toast.error("Failed to load people data");
      
      // Fallback to mock data if API fails
      const mockPeople: Person[] = [
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          status: "active",
          createdAt: "2024-01-15T00:00:00.000Z",
          type: "individual",
        },
        {
          _id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phone: "+1234567891",
          status: "pending",
          createdAt: "2024-01-20T00:00:00.000Z",
          type: "individual",
        },
        {
          _id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@example.com",
          phone: "+1234567892",
          status: "inactive",
          createdAt: "2024-01-10T00:00:00.000Z",
          type: "individual",
        },
        {
          _id: "4",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah.wilson@example.com",
          phone: "+1234567893",
          status: "active",
          createdAt: "2024-01-25T00:00:00.000Z",
          type: "individual",
        },
      ];

      setPeople(mockPeople);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPeople = () => {
    let filtered = people;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        person =>
          `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(person => person.status === statusFilter);
    }

    setFilteredPeople(filtered);
  };

  const handleStatusChange = async (personId: string, newStatus: string) => {
    try {
      // Here you would make an API call to update the status
      setPeople(prev =>
        prev.map(person =>
          person._id === personId ? { ...person, status: newStatus as any } : person
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeletePerson = async (personId: string) => {
    try {
      // Here you would make an API call to delete the person
      setPeople(prev => prev.filter(person => person._id !== personId));
      toast.success("Person deleted successfully");
    } catch (error) {
      console.error("Error deleting person:", error);
      toast.error("Failed to delete person");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-blue-100 text-blue-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    
    // Handle undefined status or unknown status values
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          {status || "Unknown"}
        </Badge>
      );
    }
    
    return (
      <Badge className={config.color}>
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
          <h2 className="text-2xl font-bold">People Management</h2>
          <p className="text-muted-foreground">
            Manage user registrations and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch('/api/people-registration');
                const data = await response.json();
                console.log('People API Test Response:', data);
                if (data.success) {
                  toast.success(`Found ${data.registrations?.length || 0} people`);
                } else {
                  toast.error(`API Error: ${data.error}`);
                }
              } catch (error) {
                toast.error('People API test failed');
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
            <UserCheck className="mr-2 h-4 w-4" />
            Add Person
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total People</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered people
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active People</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending People</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive People</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Deactivated accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* People Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered People</CardTitle>
          <CardDescription>
            {filteredPeople.length} people found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map((person) => (
                  <TableRow key={person._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={person.profilePicture} />
                          <AvatarFallback>
                            {getInitials(`${person.firstName} ${person.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{`${person.firstName} ${person.lastName}`}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{person.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {person.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{person.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(person.status || "pending")}
                    </TableCell>
                    <TableCell>
                      {new Date(person.createdAt).toLocaleDateString()}
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
                            onClick={() => setSelectedPerson(person)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(
                              person._id,
                              person.status === "active" ? "inactive" : "active"
                            )}
                          >
                            {person.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePerson(person._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      {/* Person Details Dialog */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Person Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedPerson ? `${selectedPerson.firstName} ${selectedPerson.lastName}` : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedPerson && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPerson.profilePicture} />
                  <AvatarFallback className="text-lg">
                    {getInitials(`${selectedPerson.firstName} ${selectedPerson.lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{`${selectedPerson.firstName} ${selectedPerson.lastName}`}</h3>
                  <p className="text-muted-foreground">{selectedPerson.type}</p>
                  {getStatusBadge(selectedPerson.status || "pending")}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedPerson.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{selectedPerson.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                  <p>{new Date(selectedPerson.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p>{selectedPerson.status || "pending"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeopleManagement;
