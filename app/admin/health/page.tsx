"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Activity, Database, CheckCircle, XCircle } from "lucide-react";

interface HealthStatus {
  status: string;
  timestamp: string;
  database: string;
  error?: string;
}

// eslint-disable-next-line complexity
export default function AdminHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const fetchHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error("Failed to fetch health status:", error);
      setHealth({
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Failed to connect"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const isHealthy = health?.status === "ok" && health?.database === "connected";
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8" />
            System Health
          </h1>
          <p className="text-muted-foreground mt-2">Monitor system status and diagnostics</p>
        </div>
        
        {loading ? (
          <p>Checking system health...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Overall Status</h2>
                {isHealthy ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className={`text-2xl font-bold ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
                {isHealthy ? 'Healthy' : 'Unhealthy'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database
                </h2>
                {health?.database === "connected" ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className={`text-2xl font-bold ${health?.database === "connected" ? 'text-green-500' : 'text-red-500'}`}>
                {health?.database === "connected" ? 'Connected' : 'Disconnected'}
              </p>
              {health?.error && (
                <p className="text-sm text-red-500 mt-2">{health.error}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-medium">{process.env.NODE_ENV || 'development'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <span className="font-medium">Next.js</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="font-medium">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
