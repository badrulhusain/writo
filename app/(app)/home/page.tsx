"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  Eye,
  MessageCircle,
  Heart,
  Sparkles,
  TrendingUp,
  Clock
} from "lucide-react";
import Link from "next/link";

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
}

interface Category {
  name: string;
  count: number;
}

interface Tag {
  name: string;
  count: number;
}

interface TrendingUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  publishedBlogsCount: number;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsRes, categoriesRes, tagsRes, usersRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/categories"),
        fetch("/api/tags"),
        fetch("/api/users")
      ]);

      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        // Fetch like data for each blog
        const blogsWithLikes = await Promise.all(
          blogs.map(async (blog: BlogPost) => {
            try {
              const likeResponse = await fetch(`/api/blogs/${blog._id}/like`);
              if (likeResponse.ok) {
                const likeData = await likeResponse.json();
                return { ...blog, likeCount: likeData.likeCount };
              }
            } catch (error) {
              console.error("Error fetching likes for blog:", blog._id, error);
            }
            return blog;
          })
        );
        setBlogPosts(blogsWithLikes);
      }

      if (categoriesRes.ok) {
        const cats = await categoriesRes.json();
        setCategories(cats);
      }

      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        setTrendingTags(tags);
      }

      if (usersRes.ok) {
        const users = await usersRes.json();
        setTrendingUsers(users);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search, category, and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.categoryId?.name === selectedCategory;
    const matchesTag = selectedTag === "All" || post.tags.some(tag => tag.name === selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Featured post is the most recent post
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {featuredPost && (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-4 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Featured Post
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{featuredPost.content.substring(0, 200)}...</p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{featuredPost.authorId.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{featuredPost.authorId.name}</span>
              </div>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(featuredPost.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Button asChild>
              <Link href={`/blog/${featuredPost._id}`}>Read Article</Link>
            </Button>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent"></div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="All">All Tags</option>
            {trendingTags.map((tag) => (
              <option key={tag.name} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {regularPosts.map((post) => (
              <Card key={post._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {post.categoryId && <Badge variant="secondary">{post.categoryId.name}</Badge>}
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle>
                    <Link href={`/blog/${post._id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.content.substring(0, 200)}...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{post.authorId.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{post.authorId.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likeCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag.name} variant="outline">{tag.name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Trending Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Badge
                    key={tag.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.publishedBlogsCount} blogs</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Writing Assistant Promo */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                AI Writing Assistant
              </CardTitle>
              <CardDescription>Enhance your writing with our AI tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Get real-time suggestions for headlines, grammar improvements, and content summarization.
              </p>
              <Button className="w-full" asChild>
                <Link href="/blog/create">Try Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}