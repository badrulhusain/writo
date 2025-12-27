"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Heart,
  Share2,
  Search,
  Plus,
  Settings,
  MapPin,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  createdAt: string;
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

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
  featuredImage?: {
    url: string;
    alt: string;
  };
}

// eslint-disable-next-line complexity
export default function ProfilePage() {
  // Profile State
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    fetchProfile();
    fetchBlogs();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/user/blogs");
      if (response.ok) {
        const data = await response.json();
        const blogs = data.blogs;
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
      setBlogsLoading(false);
    }
  };

  const handleLike = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
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
        await navigator.share({ title, url });
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
      toast.success("Link copied to clipboard!");
    });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" ||
                         (filter === "published" && post.status === "published") ||
                         (filter === "drafts" && post.status === "draft");
    return matchesSearch && matchesFilter;
  });

  if (profileLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="text-center py-8">Failed to load profile</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              {userData.bio && (
                <p className="text-sm max-w-2xl">{userData.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                {userData.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {userData.location}
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center">
                    <LinkIcon className="mr-1 h-3 w-3" />
                    <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {userData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Joined {new Date(userData.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{stats?.posts || 0}</span>
                  <span className="text-xs text-muted-foreground">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{stats?.followers || 0}</span>
                  <span className="text-xs text-muted-foreground">Followers</span>
                </div>
                 <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{stats?.following || 0}</span>
                  <span className="text-xs text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold">My Blogs</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <button
                onClick={() => setFilter("all")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "published" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter("drafts")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "drafts" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Drafts
              </button>
            </div>
             <Button asChild>
              <Link href="/blog/create">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {blogsLoading ? (
          <div className="text-center py-8">Loading blogs...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground mb-4">No blog posts found.</p>
            <Button asChild variant="outline">
              <Link href="/blog/create">Create your first post</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card key={post._id} className="flex flex-col overflow-hidden">
                {post.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={post.featuredImage.url} 
                      alt={post.featuredImage.alt || post.title}
                      className="w-full h-full object-cover"
                      width={400}
                      height={200}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className={post.featuredImage ? "pt-4" : ""}>
                  {!post.featuredImage && (
                    <div className="flex justify-end mb-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  )}
                  <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
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
                <CardFooter className="flex justify-between items-center border-t pt-4">
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/blog/${post._id}`}>View</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}