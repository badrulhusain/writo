"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Shield } from "lucide-react";

interface AuditLogEntry {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  action: string;
  resourceType: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminSecurity() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchLogs();
  }, []);
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/audit");
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Security & Auditing
          </h1>
          <p className="text-muted-foreground mt-2">Monitor admin actions and security events</p>
        </div>
        
        {loading ? (
          <p>Loading audit logs...</p>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">Resource</th>
                  <th className="text-left p-4">IP Address</th>
                  <th className="text-left p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-t border-border">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{log.userId?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{log.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{log.action}</td>
                    <td className="p-4">{log.resourceType}</td>
                    <td className="p-4">{log.ipAddress || "N/A"}</td>
                    <td className="p-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {logs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No audit logs found
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
