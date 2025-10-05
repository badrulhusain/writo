"use client";

import { useState } from "react";
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

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Building AI-Powered Blog Platforms with Next.js",
    excerpt: "Learn how to integrate AI tools into blog platforms to enhance content creation and user engagement...",
    author: {
      name: "Alex Johnson",
      avatar: "https://github.com/shadcn.png"
    },
    date: "June 15, 2023",
    readTime: "8 min read",
    views: 1240,
    comments: 24,
    likes: 56,
    category: "Technology",
    tags: ["AI", "Next.js", "Web Development"],
    featured: true
  },
  {
    id: 2,
    title: "10 Tips for Better UI Design",
    excerpt: "Discover essential principles that will help you create more intuitive and engaging user interfaces...",
    author: {
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    date: "June 10, 2023",
    readTime: "5 min read",
    views: 980,
    comments: 18,
    likes: 42,
    category: "Design",
    tags: ["UI", "UX", "Design Principles"],
    featured: false
  },
  {
    id: 3,
    title: "Building a Blog with React",
    excerpt: "A step-by-step guide to creating your own blog platform using React and modern web technologies...",
    author: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    date: "June 5, 2023",
    readTime: "12 min read",
    views: 1520,
    comments: 32,
    likes: 78,
    category: "Tutorial",
    tags: ["React", "JavaScript", "Tutorial"],
    featured: false
  },
  {
    id: 4,
    title: "Understanding Tailwind CSS",
    excerpt: "Explore the utility-first approach to styling and how it can speed up your development workflow...",
    author: {
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    date: "May 28, 2023",
    readTime: "6 min read",
    views: 870,
    comments: 15,
    likes: 38,
    category: "CSS",
    tags: ["Tailwind", "CSS", "Styling"],
    featured: false
  },
];

const categories = [
  { name: "Technology", count: 12 },
  { name: "Design", count: 8 },
  { name: "Business", count: 5 },
  { name: "Lifestyle", count: 7 },
  { name: "Tutorial", count: 15 },
];

const trendingTags = [
  "AI", "Next.js", "React", "JavaScript", "Web Development", "UI/UX", "CSS", "Tailwind"
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Featured Post
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{featuredPost.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={featuredPost.author.avatar} />
                <AvatarFallback>{featuredPost.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{featuredPost.author.name}</span>
            </div>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {featuredPost.date}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {featuredPost.readTime}
            </span>
          </div>
          <Button asChild>
            <Link href={`/blog/${featuredPost.id}`}>Read Article</Link>
          </Button>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent"></div>
      </div>

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
              <option key={tag} value={tag}>{tag}</option>
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
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle>
                    <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
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
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
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