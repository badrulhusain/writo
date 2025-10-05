"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  BarChart3,
  Eye,
  MessageCircle,
  Heart,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockBlogs = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with the latest features of Next.js 15...",
    author: "Alex Johnson",
    date: "2023-06-15",
    views: 1240,
    comments: 24,
    likes: 56,
    category: "Technology",
    tags: ["Next.js", "React", "Web Development"],
    status: "Published",
    aiInsights: {
      seoScore: 85,
      readability: "Good",
      suggestions: 3
    }
  },
  {
    id: 2,
    title: "10 Tips for Better UI Design",
    excerpt: "Discover essential principles that will help you create more intuitive and engaging user interfaces...",
    author: "Sarah Williams",
    date: "2023-06-10",
    views: 980,
    comments: 18,
    likes: 42,
    category: "Design",
    tags: ["UI", "UX", "Design Principles"],
    status: "Published",
    aiInsights: {
      seoScore: 92,
      readability: "Excellent",
      suggestions: 1
    }
  },
  {
    id: 3,
    title: "Building a Blog with React",
    excerpt: "A step-by-step guide to creating your own blog platform using React and modern web technologies...",
    author: "Michael Chen",
    date: "2023-06-05",
    views: 1520,
    comments: 32,
    likes: 78,
    category: "Tutorial",
    tags: ["React", "JavaScript", "Tutorial"],
    status: "Draft",
    aiInsights: {
      seoScore: 78,
      readability: "Good",
      suggestions: 5
    }
  },
];

const mockStats = {
  totalPosts: 24,
  pageViews: 1248,
  comments: 86,
  engagement: 68,
  topCategory: "Technology"
};

export default function DashboardPage() {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter blogs based on search term, category, and status
  useEffect(() => {
    let result = blogs;
    
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "All") {
      result = result.filter(blog => blog.category === categoryFilter);
    }
    
    if (statusFilter !== "All") {
      result = result.filter(blog => blog.status === statusFilter);
    }
    
    setFilteredBlogs(result);
  }, [searchTerm, categoryFilter, statusFilter, blogs]);

  // Get unique categories for filter dropdown
  const categories = ["All", ...new Set(blogs.map(blog => blog.category))];
  const statuses = ["All", "Published", "Draft"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your blog.</p>
        </div>
        <Button asChild>
          <Link href="/blog/create">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pageViews}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.comments}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.engagement}%</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Blog List */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
            <CardDescription>Manage and view all your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{blog.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{blog.category}</Badge>
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={blog.status === "Published" ? "default" : "secondary"}
                        >
                          {blog.status}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {blog.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {blog.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Insights */}
                    <div className="mt-3 p-3 bg-secondary/50 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">AI Insights</span>
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          SEO Score: {blog.aiInsights.seoScore}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Readability: {blog.aiInsights.readability}</span>
                        <span>{blog.aiInsights.suggestions} AI suggestions</span>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          View suggestions
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${blog.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${blog.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}