"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Bookmark,
  ThumbsUp,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Comments from "@/components/Comments";
import ShareButton from "@/components/ShareButton";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  category?: {
    id: string;
    name: string;
  };
  tags: {
    _id: string;
    name: string;
  }[];
}

// Function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlogPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Record view and get view count
  useEffect(() => {
    const recordView = async () => {
      try {
        // Record the view
        const response = await fetch("/api/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId: id }),
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.viewCount);
        }

        // Also get the current view count
        const viewResponse = await fetch(`/api/views?blogId=${id}`);
        if (viewResponse.ok) {
          const viewData = await viewResponse.json();
          setViewCount(viewData.viewCount);
        }
      } catch (err) {
        console.error("Failed to record/view count:", err);
      }
    };

    if (id) {
      recordView();
    }
  }, [id]);

  // Check if the blog is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`/api/bookmarks?blogId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setBookmarked(data.isBookmarked);
        }
      } catch (err) {
        console.error("Failed to check bookmark status:", err);
      }
    };

    if (id) {
      checkBookmarkStatus();
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?blogId=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setBookmarked(false);
        } else {
          console.error("Failed to remove bookmark");
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId: id }),
        });

        if (response.ok) {
          setBookmarked(true);
        } else {
          console.error("Failed to add bookmark");
        }
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error || 'Blog not found'}</p>
            <Button asChild className="mt-4">
              <Link href="/profile">Back to Blogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blogPost.content);

  return (
    <div className="space-y-8">
      {/* Blog Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {blogPost.category && <Badge>{blogPost.category.name}</Badge>}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(blogPost.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {viewCount} views
          </span>
        </div>

        <h1 className="text-4xl font-bold">{blogPost.title}</h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={undefined} />
              <AvatarFallback>{blogPost.authorId.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blogPost.authorId.name || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary - Placeholder */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            AI-Generated Summary (TL;DR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">AI summary feature coming soon...</p>
        </CardContent>
      </Card>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4 [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold">
        <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {blogPost.tags.map((tag) => (
          <Badge key={tag._id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={liked ? "text-primary" : ""}
          >
            <ThumbsUp className="h-5 w-5 mr-2" />
            {liked ? "Liked" : "Like"} ({liked ? 1 : 0})
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-5 w-5 mr-2" />
            0 Comments
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBookmark}>
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <ShareButton title={blogPost.title} url={`/blog/${id}`} />
        </div>
      </div>

      {/* AI Recommendations - Placeholder */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Recommendation feature coming soon...</p>
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <Comments blogId={id} />
    </div>
  );
}