"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  status: string;
  authorId: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" 
        ? "/api/admin/posts"
        : `/api/admin/posts?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await fetch(`/api/admin/posts?id=${postId}`, {
        method: "DELETE"
      });
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };
  
  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, status: newStatus })
      });
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "published" ? "default" : "outline"}
              onClick={() => setFilter("published")}
            >
              Published
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "outline"}
              onClick={() => setFilter("draft")}
            >
              Drafts
            </Button>
          </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Author</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-t border-border">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">{post.authorId?.name || "Unknown"}</td>
                    <td className="p-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleStatusChange(post._id, e.target.value)}
                        className="bg-background border border-border rounded px-2 py-1"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
