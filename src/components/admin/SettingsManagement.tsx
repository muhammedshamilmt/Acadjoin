"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Textarea
} from "@/components/ui/textarea";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Save, 
  Settings, 
  Shield, 
  Mail, 
  Globe, 
  CreditCard,
  Database,
  Lock,
  Users,
  Building2,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface SettingsManagementProps {
  isPaidRegistrationEnabled: boolean;
  onPaidRegistrationToggle: (enabled: boolean) => void;
}

const SettingsManagement = ({ 
  isPaidRegistrationEnabled, 
  onPaidRegistrationToggle 
}: SettingsManagementProps) => {
  const [settings, setSettings] = useState({
    // Registration Settings
    paidRegistration: isPaidRegistrationEnabled,
    registrationFee: "50",
    freeRegistrationLimit: "100",
    
    // Email Settings
    emailNotifications: true,
    welcomeEmail: true,
    adminNotifications: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    
    // General Settings
    siteName: "FuturePath",
    siteDescription: "Educational platform connecting students and institutes",
    maintenanceMode: false,
    debugMode: false,
    
    // Content Settings
    maxFileSize: "10",
    allowedFileTypes: "jpg,jpeg,png,pdf,doc,docx",
    autoApproveInstitutes: false,
    autoApproveUsers: true,
  });

  const [institutionTypes, setInstitutionTypes] = useState([
    "University",
    "College",
    "School",
    "Training Center",
    "Online Platform",
    "Research Institute",
    "Vocational Center",
    "Language School"
  ]);

  const [newInstitutionType, setNewInstitutionType] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Loading settings from database...');
      
      const response = await fetch('/api/settings');
      console.log('Load settings response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Load settings response data:', data);
      } catch (parseError) {
        console.error('Failed to parse settings response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      // Check if the response indicates success
      if (data.success === false) {
        const errorMessage = data.error || data.details || 'Failed to load settings';
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        const errorMessage = data?.error || data?.details || `HTTP ${response.status}: Failed to fetch settings`;
        throw new Error(errorMessage);
      }
      
      if (data.settings) {
        console.log('Settings loaded successfully:', data.settings);
        
        // Update local state with all settings from database
        setSettings(prev => ({
          ...prev,
          ...data.settings
        }));
        
        // Update institution types if they exist in the response
        if (data.settings.institutionTypes && Array.isArray(data.settings.institutionTypes)) {
          setInstitutionTypes(data.settings.institutionTypes);
        }
        
        // Update the paid registration setting if it changed
        if (data.settings.paidRegistration !== isPaidRegistrationEnabled) {
          onPaidRegistrationToggle(data.settings.paidRegistration);
        }
      } else {
        console.warn('No settings data in response');
        toast.warning("No settings found, using defaults");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load settings from database";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Prepare settings data with institution types
      const settingsData = {
        ...settings,
        institutionTypes
      };
      
      console.log('Saving settings:', settingsData);
      
      // Save to database
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsData }),
      });
      
      console.log('Response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      // Check if the response indicates success
      if (responseData.success === false) {
        const errorMessage = responseData.error || responseData.details || 'Settings save failed';
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        const errorMessage = responseData?.error || responseData?.details || `HTTP ${response.status}: Failed to save settings`;
        throw new Error(errorMessage);
      }
      
      // Update local state with the returned settings data
      if (responseData.settings) {
        console.log('Updating local state with saved settings:', responseData.settings);
        setSettings(responseData.settings);
        setInstitutionTypes(responseData.settings.institutionTypes || institutionTypes);
      }
      
      // Update the paid registration setting if it changed
      if (settings.paidRegistration !== isPaidRegistrationEnabled) {
        onPaidRegistrationToggle(settings.paidRegistration);
      }
      
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings to database";
      console.error("Full error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      try {
        const defaultSettings = {
          paidRegistration: false,
          registrationFee: "50",
          freeRegistrationLimit: "100",
          emailNotifications: true,
          welcomeEmail: true,
          adminNotifications: true,
          smtpHost: "smtp.gmail.com",
          smtpPort: "587",
          twoFactorAuth: false,
          sessionTimeout: "30",
          maxLoginAttempts: "5",
          passwordMinLength: "8",
          siteName: "FuturePath",
          siteDescription: "Educational platform connecting students and institutes",
          maintenanceMode: false,
          debugMode: false,
          maxFileSize: "10",
          allowedFileTypes: "jpg,jpeg,png,pdf,doc,docx",
          autoApproveInstitutes: false,
          autoApproveUsers: true,
          institutionTypes: [
            "University",
            "College",
            "School",
            "Training Center",
            "Online Platform",
            "Research Institute",
            "Vocational Center",
            "Language School"
          ]
        };
        
        // Save to database
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ settings: defaultSettings }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to reset settings in database');
        }
        
        const responseData = await response.json();
        
        // Update local state with the returned settings data
        if (responseData.settings) {
          console.log('Updating local state with reset settings:', responseData.settings);
          setSettings(responseData.settings);
          setInstitutionTypes(responseData.settings.institutionTypes || defaultSettings.institutionTypes);
        } else {
          // Fallback to default settings if no response data
          setSettings(defaultSettings);
          setInstitutionTypes(defaultSettings.institutionTypes);
        }
        
        // Update the paid registration setting if it changed
        if (defaultSettings.paidRegistration !== isPaidRegistrationEnabled) {
          onPaidRegistrationToggle(defaultSettings.paidRegistration);
        }
        
        toast.success("Settings reset successfully");
      } catch (error) {
        console.error("Error resetting settings:", error);
        toast.error("Failed to reset settings in database");
      }
    }
  };

  const handleAddInstitutionType = async () => {
    if (newInstitutionType.trim() && !institutionTypes.includes(newInstitutionType.trim())) {
      try {
        const response = await fetch('/api/settings/institution-types', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: newInstitutionType.trim() }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add institution type');
        }
        
        const responseData = await response.json();
        
        // Update local state with the returned data
        if (responseData.institutionTypes) {
          setInstitutionTypes(responseData.institutionTypes);
        } else {
          // Fallback to adding locally
          setInstitutionTypes(prev => [...prev, newInstitutionType.trim()]);
        }
        
        setNewInstitutionType("");
        toast.success("Institution type added");
      } catch (error) {
        console.error("Error adding institution type:", error);
        toast.error(error instanceof Error ? error.message : "Failed to add institution type");
      }
    } else if (institutionTypes.includes(newInstitutionType.trim())) {
      toast.error("Institution type already exists");
    } else {
      toast.error("Please enter a valid institution type");
    }
  };

  const handleRemoveInstitutionType = async (type: string) => {
    if (confirm(`Are you sure you want to remove "${type}"?`)) {
      try {
        const response = await fetch(`/api/settings/institution-types?type=${encodeURIComponent(type)}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove institution type');
        }
        
        const responseData = await response.json();
        
        // Update local state with the returned data
        if (responseData.institutionTypes) {
          setInstitutionTypes(responseData.institutionTypes);
        } else {
          // Fallback to removing locally
          setInstitutionTypes(prev => prev.filter(t => t !== type));
        }
        
        toast.success("Institution type removed");
      } catch (error) {
        console.error("Error removing institution type:", error);
        toast.error(error instanceof Error ? error.message : "Failed to remove institution type");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
          {isLoading && (
            <p className="text-sm text-blue-600">Loading settings from database...</p>
          )}
        </div>
                 <div className="flex gap-2">
           <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
             <Save className="mr-2 h-4 w-4" />
             {isSaving ? "Saving..." : "Save Settings"}
           </Button>
         </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings from database...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="general" >
                   <TabsList className="grid w-full grid-cols-4">
           <TabsTrigger value="general" className="flex items-center gap-2">
             <Globe className="h-4 w-4" />
             General
           </TabsTrigger>
           <TabsTrigger value="email-registration" className="flex items-center gap-2">
             <Mail className="h-4 w-4" />
             Email
           </TabsTrigger>
           <TabsTrigger value="security-system" className="flex items-center gap-2">
             <Shield className="h-4 w-4" />
             Security
           </TabsTrigger>
           <TabsTrigger value="categories" className="flex items-center gap-2">
             <Building2 className="h-4 w-4" />
             Categories
           </TabsTrigger>
         </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure general platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    placeholder="AL-HYABA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                  placeholder="Educational platform connecting students and institutes"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => handleSettingChange("allowedFileTypes", e.target.value)}
                  placeholder="jpg,jpeg,png,pdf,doc,docx"
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of allowed file extensions
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable debug mode for development
                    </p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email & Registration Settings Tab */}
        <TabsContent value="email-registration" className="space-y-6">
          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email notifications and SMTP settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable email notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome emails to new users
                    </p>
                  </div>
                  <Switch
                    checked={settings.welcomeEmail}
                    onCheckedChange={(checked) => handleSettingChange("welcomeEmail", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Admin Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to admin
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminNotifications}
                    onCheckedChange={(checked) => handleSettingChange("adminNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange("smtpPort", e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Registration Settings
              </CardTitle>
              <CardDescription>
                Configure user and institute registration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Paid Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable paid registration for institutes
                  </p>
                </div>
                <Switch
                  checked={settings.paidRegistration}
                  onCheckedChange={(checked) => handleSettingChange("paidRegistration", checked)}
                />
              </div>

              {settings.paidRegistration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                    <Input
                      id="registrationFee"
                      type="number"
                      value={settings.registrationFee}
                      onChange={(e) => handleSettingChange("registrationFee", e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeRegistrationLimit">Free Registration Limit</Label>
                    <Input
                      id="freeRegistrationLimit"
                      type="number"
                      value={settings.freeRegistrationLimit}
                      onChange={(e) => handleSettingChange("freeRegistrationLimit", e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-approve Institutes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new institute registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproveInstitutes}
                    onCheckedChange={(checked) => handleSettingChange("autoApproveInstitutes", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-approve Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new user registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproveUsers}
                    onCheckedChange={(checked) => handleSettingChange("autoApproveUsers", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & System Information Tab */}
        <TabsContent value="security-system" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", e.target.value)}
                    placeholder="8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Current system status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Platform Version</Label>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Database Status</Label>
                  <p className="text-sm text-green-600">Connected</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Backup</Label>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">System Uptime</Label>
                  <p className="text-sm text-muted-foreground">99.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institution Types
              </CardTitle>
              <CardDescription>
                Manage institution type categories for registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Institution Type */}
              <div className="space-y-4">
                <Label htmlFor="newInstitutionType">Add New Institution Type</Label>
                <div className="flex gap-2">
                  <Input
                    id="newInstitutionType"
                    value={newInstitutionType}
                    onChange={(e) => setNewInstitutionType(e.target.value)}
                    placeholder="Enter institution type (e.g., Technical Institute)"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddInstitutionType}
                    className="px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Current Institution Types */}
              <div className="space-y-4">
                <Label className="text-base">Current Institution Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {institutionTypes.map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                    >
                      <span className="font-medium text-sm">{type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInstitutionType(type)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {institutionTypes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No institution types added yet. Add your first type above.
                  </p>
                )}
              </div>
                      </CardContent>
        </Card>
      </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SettingsManagement;
