"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

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

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
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
              <Link href="/blog">Back to Blogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Blog Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm ">
          {blogPost.category && <Badge>{blogPost.category.name}</Badge>}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(blogPost.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {Math.ceil(blogPost.content.length / 1000)} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            0 views
          </span>
        </div>

        <h1 className="text-4xl font-bold">{blogPost.title}</h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={ undefined} />
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
      <div className="prose prose-lg max-w-none dark:prose-invert">
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
          <Button variant="ghost" size="sm">
            <Share2 className="h-5 w-5" />
          </Button>
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Comments (0)</h2>
        
        <div className="space-y-6">
          {/* Comment input */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea 
                    placeholder="Write a comment..." 
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Sample comments */}
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${item}`} />
                    <AvatarFallback>U{item}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">User {item}</h4>
                      <span className="text-sm text-muted-foreground">
                        {item === 1 ? "2 hours ago" : item === 2 ? "1 day ago" : "3 days ago"}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {item === 1 
                        ? "Great article! The section on AI writing assistants was particularly helpful." 
                        : item === 2 
                        ? "I've been working on a similar project. Would love to see more examples of implementation." 
                        : "Thanks for sharing. The best practices section is spot on."}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {item * 3}
                      </Button>
                      <Button variant="ghost" size="sm">Reply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}