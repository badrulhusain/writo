"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  authorId: {
    name: string;
    email: string;
  };
  categoryId?: {
    name: string;
  };
  tags: Array<{
    name: string;
  }>;
  createdAt: string;
  status: string;
  likeCount?: number;
  userLiked?: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (response.ok) {
        const blogs = await response.json();
        // Fetch like data for each blog
        const blogsWithLikes = await Promise.all(
          blogs.map(async (blog: BlogPost) => {
            try {
              const likeResponse = await fetch(`/api/blogs/${blog._id}/like`);
              if (likeResponse.ok) {
                const likeData = await likeResponse.json();
                return { ...blog, likeCount: likeData.likeCount, userLiked: likeData.userLiked };
              }
            } catch (error) {
              console.error("Error fetching likes for blog:", blog._id, error);
            }
            return blog;
          })
        );
        setBlogPosts(blogsWithLikes);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        // Update the local state
        setBlogPosts(posts =>
          posts.map(post =>
            post._id === blogId
              ? {
                  ...post,
                  userLiked: result.liked,
                  likeCount: (post.likeCount || 0) + (result.liked ? 1 : -1)
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleShare = async (blogId: string, title: string) => {
    const url = `${window.location.origin}/blog/${blogId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Blog Posts</h1>
          <p className="text-muted-foreground">Manage and view all your published blog posts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/blog/create">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading blogs...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-4 w-4" />
                  {post.authorId.name}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                {post.categoryId && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Category: {post.categoryId.name}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post._id)}
                    className={`p-1 h-8 ${post.userLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${post.userLiked ? 'fill-current' : ''}`} />
                    {post.likeCount || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post._id, post.title)}
                    className="p-1 h-8"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blog/${post._id}`}>View</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}