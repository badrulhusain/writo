"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BarChart3 } from "lucide-react";

interface AnalyticsData {
  topPostsByViews: Array<{ title: string; views: number }>;
  topPostsByLikes: Array<{ title: string; likes: number }>;
  topPostsByComments: Array<{ title: string; comments: number }>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/analytics");
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your content performance</p>
        </div>
        
        {loading ? (
          <p>Loading analytics...</p>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Posts by Views
              </h2>
              <div className="space-y-3">
                {data.topPostsByViews.map((post, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{post.title}</span>
                    <span className="text-sm font-medium ml-2">{post.views || 0}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Posts by Likes
              </h2>
              <div className="space-y-3">
                {data.topPostsByLikes.map((post, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{post.title}</span>
                    <span className="text-sm font-medium ml-2">{post.likes}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Posts by Comments
              </h2>
              <div className="space-y-3">
                {data.topPostsByComments.map((post, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{post.title}</span>
                    <span className="text-sm font-medium ml-2">{post.comments}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No analytics data available</p>
        )}
      </div>
    </AdminLayout>
  );
}
