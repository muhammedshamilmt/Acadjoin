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
  Search, 
  MoreHorizontal, 
  Eye, 
  Reply, 
  Trash2, 
  Mail,
  MailOpen,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  User,
  Calendar,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  repliedAt?: string;
  repliedBy?: string;
  replyMessage?: string;
  location?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  // Calculate statistics
  const getStatistics = () => {
    const total = messages.length;
    const unread = messages.filter(msg => msg.status === 'unread').length;
    const read = messages.filter(msg => msg.status === 'read').length;
    const replied = messages.filter(msg => msg.status === 'replied').length;
    const highPriority = messages.filter(msg => msg.priority === 'high').length;
    const today = messages.filter(msg => {
      const msgDate = new Date(msg.createdAt);
      const today = new Date();
      return msgDate.toDateString() === today.toDateString();
    }).length;
    
    return { total, unread, read, replied, highPriority, today };
  };

  const statistics = getStatistics();

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter, priorityFilter]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from the API
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const messagesData = data.messages || [];
        console.log('Messages data:', messagesData);
        console.log('Statistics from API:', data.statistics);
        setMessages(messagesData);
      } else {
        console.error('API Error Response:', data);
        throw new Error(data.error || data.details || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages data");
      
      // Fallback to mock data if API fails
      const mockMessages: Message[] = [
        {
          _id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          subject: "General Inquiry",
          message: "I would like to know more about your services and how to get started.",
          status: "unread",
          createdAt: "2024-01-20T10:30:00.000Z",
          location: "New York, NY",
          category: "general",
          priority: "medium",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1234567891",
          subject: "Technical Support",
          message: "I'm having trouble accessing my account. Can you help me resolve this issue?",
          status: "read",
          createdAt: "2024-01-19T15:45:00.000Z",
          location: "Los Angeles, CA",
          category: "support",
          priority: "high",
        },
        {
          _id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          phone: "+1234567892",
          subject: "Partnership Request",
          message: "We would like to discuss potential partnership opportunities with your platform.",
          status: "replied",
          createdAt: "2024-01-18T09:15:00.000Z",
          repliedAt: "2024-01-19T14:20:00.000Z",
          repliedBy: "admin@example.com",
          replyMessage: "Thank you for your interest. We'll schedule a call to discuss this further.",
          location: "Chicago, IL",
          category: "business",
          priority: "high",
        },
        {
          _id: "4",
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          phone: "+1234567893",
          subject: "Feedback",
          message: "Great platform! I have some suggestions for improvement.",
          status: "archived",
          createdAt: "2024-01-17T12:20:00.000Z",
          location: "San Francisco, CA",
          category: "feedback",
          priority: "low",
        },
      ];

      setMessages(mockMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(msg => msg.priority === priorityFilter);
    }

    setFilteredMessages(filtered);
  };

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      // Here you would make an API call to update the status
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, status: newStatus as any } : msg
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    try {
      // Here you would make an API call to send the reply
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId 
            ? { 
                ...msg, 
                status: 'replied',
                repliedAt: new Date().toISOString(),
                repliedBy: 'admin@example.com',
                replyMessage: replyText
              } 
            : msg
        )
      );
      setReplyText("");
      setSelectedMessage(null);
      toast.success("Reply sent successfully");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Here you would make an API call to delete the message
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unread: { color: "bg-blue-100 text-blue-800", label: "Unread", icon: Mail },
      read: { color: "bg-gray-100 text-gray-800", label: "Read", icon: MailOpen },
      replied: { color: "bg-green-100 text-green-800", label: "Replied", icon: CheckCircle },
      archived: { color: "bg-yellow-100 text-yellow-800", label: "Archived", icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          {status || "Unknown"}
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: "bg-red-100 text-red-800", label: "High" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      low: { color: "bg-green-100 text-green-800", label: "Low" },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          {priority || "Unknown"}
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
          <h2 className="text-2xl font-bold">Messages Management</h2>
          <p className="text-muted-foreground">
            Manage contact messages and inquiries
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch('/api/messages');
                const data = await response.json();
                console.log('Messages API Test Response:', data);
                if (data.success) {
                  toast.success(`Found ${data.messages?.length || 0} messages`);
                } else {
                  toast.error(`API Error: ${data.error}`);
                }
              } catch (error) {
                toast.error('Messages API test failed');
              }
            }}
          >
            Test API
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              All messages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistics.unread}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              Urgent messages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.today}</div>
            <p className="text-xs text-muted-foreground">
              New today
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
                placeholder="Search messages..."
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            {filteredMessages.length} messages found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback>
                            {getInitials(message.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {message.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {message.message.length > 50 
                            ? `${message.message.substring(0, 50)}...` 
                            : message.message
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(message.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(message.priority || 'medium')}
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
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
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {message.status !== 'replied' && (
                            <DropdownMenuItem
                              onClick={() => setSelectedMessage(message)}
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(
                              message._id,
                              message.status === "unread" ? "read" : "unread"
                            )}
                          >
                            {message.status === "unread" ? (
                              <>
                                <MailOpen className="mr-2 h-4 w-4" />
                                Mark as Read
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Mark as Unread
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(message._id)}
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

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => {
        setSelectedMessage(null);
        setReplyText("");
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              {selectedMessage?.status === 'replied' ? 'View message and reply' : 'View and reply to message'}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage />
                  <AvatarFallback>
                    {getInitials(selectedMessage.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedMessage.name}</h3>
                  <p className="text-muted-foreground">{selectedMessage.email}</p>
                  {getStatusBadge(selectedMessage.status)}
                  {getPriorityBadge(selectedMessage.priority || 'medium')}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </label>
                    <p>{selectedMessage.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Location
                    </label>
                    <p>{selectedMessage.location || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date
                    </label>
                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedMessage.status === 'replied' && selectedMessage.replyMessage && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reply</label>
                    <div className="mt-1 p-3 bg-blue-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Replied on {selectedMessage.repliedAt && new Date(selectedMessage.repliedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedMessage.status !== 'replied' && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="mt-1 w-full p-3 border border-input rounded-md resize-none"
                      rows={4}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button 
                        onClick={() => handleReply(selectedMessage._id)}
                        disabled={!replyText.trim()}
                      >
                        <Reply className="mr-2 h-4 w-4" />
                        Send Reply
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setReplyText("")}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
