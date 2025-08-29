"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Activity, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download
} from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const analyticsData = {
    overview: {
      totalUsers: 1250,
      totalInstitutes: 45,
      activeUsers: 890,
      newRegistrations: 156,
    },
    trends: {
      userGrowth: 12.5,
      instituteGrowth: 8.2,
      engagementGrowth: 15.3,
      conversionGrowth: -2.1,
    },
    monthlyData: [
      { month: "Jan", users: 1200, institutes: 40, registrations: 140 },
      { month: "Feb", users: 1250, institutes: 42, registrations: 145 },
      { month: "Mar", users: 1300, institutes: 43, registrations: 150 },
      { month: "Apr", users: 1350, institutes: 44, registrations: 155 },
      { month: "May", users: 1400, institutes: 45, registrations: 160 },
      { month: "Jun", users: 1450, institutes: 46, registrations: 165 },
    ],
    topInstitutes: [
      { name: "Tech Academy", registrations: 45, rating: 4.8 },
      { name: "Business School Pro", registrations: 38, rating: 4.6 },
      { name: "Creative Arts Institute", registrations: 32, rating: 4.7 },
      { name: "Medical Training Center", registrations: 28, rating: 4.5 },
    ],
    userDemographics: {
      students: 65,
      professionals: 25,
      others: 10,
    },
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getTrendColor = (value: number) => {
    return value > 0 ? "text-green-600" : "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track platform performance and user engagement
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.trends.userGrowth)}
              <span className={getTrendColor(analyticsData.trends.userGrowth)}>
                +{analyticsData.trends.userGrowth}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalInstitutes}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.trends.instituteGrowth)}
              <span className={getTrendColor(analyticsData.trends.instituteGrowth)}>
                +{analyticsData.trends.instituteGrowth}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.trends.engagementGrowth)}
              <span className={getTrendColor(analyticsData.trends.engagementGrowth)}>
                +{analyticsData.trends.engagementGrowth}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.newRegistrations}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.trends.conversionGrowth)}
              <span className={getTrendColor(analyticsData.trends.conversionGrowth)}>
                {analyticsData.trends.conversionGrowth > 0 ? '+' : ''}{analyticsData.trends.conversionGrowth}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>
              Monthly growth of users and institutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-center space-x-2">
              {analyticsData.monthlyData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-muted-foreground">{data.month}</div>
                  <div className="flex space-x-1">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(data.users / 1500) * 200}px` }}
                    ></div>
                    <div 
                      className="w-8 bg-green-500 rounded-t"
                      style={{ height: `${(data.institutes / 50) * 200}px` }}
                    ></div>
                  </div>
                  <div className="text-xs text-center">
                    <div className="text-blue-600">{data.users}</div>
                    <div className="text-green-600">{data.institutes}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm">Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">Institutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>
              Distribution of user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Students</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${analyticsData.userDemographics.students}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analyticsData.userDemographics.students}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Professionals</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${analyticsData.userDemographics.professionals}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analyticsData.userDemographics.professionals}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Others</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${analyticsData.userDemographics.others}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analyticsData.userDemographics.others}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Institutes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Institutes</CardTitle>
          <CardDescription>
            Institutes with highest registration rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topInstitutes.map((institute, index) => (
              <div key={institute.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{institute.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {institute.registrations} registrations
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(institute.rating) 
                            ? "text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{institute.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Session Duration</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.1%</div>
            <p className="text-xs text-muted-foreground">
              -1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
