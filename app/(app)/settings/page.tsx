"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  User,
  Mail,
  MapPin,
  Link as LinkIcon
} from "lucide-react";
import { settings } from "@/actions/settings";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  // Profile State
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  
  // Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchProfile();
    
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedEmailNotifications = localStorage.getItem("emailNotifications") !== "false";
    const savedNewsletter = localStorage.getItem("newsletter") === "true";

    setDarkMode(savedDarkMode);
    setEmailNotifications(savedEmailNotifications);
    setNewsletter(savedNewsletter);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setName(data.user.name);
        setBio(data.user.bio);
        setLocation(data.user.location);
        setWebsite(data.user.website);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleSaveProfile = () => {
    startTransition(() => {
      settings({
        name,
        bio,
        location,
        website,
      }).then((data) => {
        if (data && 'error' in data) {
          toast.error(data.error);
        } else if (data && 'success' in data) {
          toast.success(data.success);
          fetchProfile(); // Refresh data
        }
      });
    });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    startTransition(() => {
      settings({
        password: currentPassword,
        newPassword,
      }).then((data) => {
        if (data && 'error' in data) {
          toast.error(data.error);
        } else if (data && 'success' in data) {
          toast.success(data.success);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      });
    });
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());
    if (key === "darkMode") {
      setDarkMode(value);
      document.documentElement.classList.toggle("dark", value);
    } else if (key === "emailNotifications") {
      setEmailNotifications(value);
    } else if (key === "newsletter") {
      setNewsletter(value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account & Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information visible to others.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={userData?.email || ""}
                          disabled
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="location" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="website" 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
             <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Details about your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Account Type</span>
                    <Badge variant={userData?.role === "ADMIN" ? "default" : "secondary"}>
                      {userData?.role || "USER"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '-'}</span>
                  </div>
                   <div className="pt-4">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your password and account security.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button onClick={handleUpdatePassword} disabled={isPending} className="w-full mt-2">
                    {isPending ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes.
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your posts.
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our monthly newsletter.
                  </p>
                </div>
                <Switch checked={newsletter} onCheckedChange={(checked) => handlePreferenceChange("newsletter", checked)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}