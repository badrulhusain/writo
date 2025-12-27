"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";

interface CommentData {
  _id: string;
  content: string;
  status: string;
  authorId: {
    name: string;
    email: string;
  };
  blogId: {
    title: string;
  };
  createdAt: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/comments?status=${filter}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, status: newStatus })
      });
      fetchComments();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };
  
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await fetch(`/api/admin/comments?id=${commentId}`, {
        method: "DELETE"
      });
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Comment Moderation</h1>
          <div className="flex gap-2">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
          </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">{comment.authorId?.name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">
                      on &quot;{comment.blogId?.title || "Unknown post"}&quot;
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="mb-4">{comment.content}</p>
                
                <div className="flex gap-2">
                  {comment.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(comment._id, "approved")}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {comment.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(comment._id, "rejected")}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(comment._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No {filter} comments found
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
