"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Palette,
  Shield,
  Save
} from "lucide-react";
import { settings } from "@/actions/settings";
import { toast } from "sonner";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedEmailNotifications = localStorage.getItem("emailNotifications") !== "false";
    const savedNewsletter = localStorage.getItem("newsletter") === "true";

    setDarkMode(savedDarkMode);
    setEmailNotifications(savedEmailNotifications);
    setNewsletter(savedNewsletter);
  }, []);

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
        if (data.error) {
          toast.error(data.error);
        } else if (data.success) {
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
      // Apply dark mode
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleUpdatePassword} disabled={isPending}>
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}