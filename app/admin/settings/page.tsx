"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTitle: "",
    siteDescription: "",
    githubUrl: "",
    linkedinUrl: "",
    xUrl: "",
    youtubeUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      setSettings({
        siteTitle: data.siteTitle || "",
        siteDescription: data.siteDescription || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        xUrl: data.xUrl || "",
        youtubeUrl: data.youtubeUrl || ""
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage site-wide configuration</p>
        </div>
        
        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    placeholder="Writo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    rows={3}
                    placeholder="Unlock Your Blogging Potential with AI"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={settings.githubUrl}
                    onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.linkedinUrl}
                    onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">X (Twitter) URL</label>
                  <input
                    type="url"
                    value={settings.xUrl}
                    onChange={(e) => setSettings({ ...settings, xUrl: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    placeholder="https://x.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">YouTube URL</label>
                  <input
                    type="url"
                    value={settings.youtubeUrl}
                    onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    placeholder="https://youtube.com/@yourusername"
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
