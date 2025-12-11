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
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
  formattedDate?: string;
  status: string;
  likeCount?: number;
  userLiked?: boolean;
  featuredImage?: {
    url: string;
    alt: string;
    photographer: string;
    photographerUrl: string;
  };
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

interface HomeClientProps {
  initialBlogs: BlogPost[];
  initialCategories: Category[];
  initialTags: Tag[];
  initialUsers: TrendingUser[];
}

export default function HomeClient({
  initialBlogs,
  initialCategories,
  initialTags,
  initialUsers
}: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [trendingTags, setTrendingTags] = useState<Tag[]>(initialTags);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>(initialUsers);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Category Creation
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleLike = async (blogId: string) => {
    // Optimistic update
    setBlogPosts(currentPosts => 
      currentPosts.map(post => {
        if (post._id === blogId) {
          const isLiked = !post.userLiked;
          return {
            ...post,
            userLiked: isLiked,
            likeCount: (post.likeCount || 0) + (isLiked ? 1 : -1)
          };
        }
        return post;
      })
    );

    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
      });
      
      if (!res.ok) {
        throw new Error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to update like");
      // Revert optimistic update
      setBlogPosts(currentPosts => 
        currentPosts.map(post => {
          if (post._id === blogId) {
            const isLiked = !post.userLiked; // Revert to previous state
            return {
              ...post,
              userLiked: isLiked,
              likeCount: (post.likeCount || 0) + (isLiked ? 1 : -1)
            };
          }
          return post;
        })
      );
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();

      if (res.ok) {
        setCategories(prev => [...prev, { name: data.name, count: 0 }]);
        setNewCategoryName("");
        setShowAddCategory(false);
        toast.success("Category created successfully");
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
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
  const remainingPosts = filteredPosts.slice(1);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {featuredPost && (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12">
          {featuredPost.featuredImage && (
            <div className="absolute inset-0">
              <img
                src={featuredPost.featuredImage.url}
                alt={featuredPost.featuredImage.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
          )}
          <div className="relative z-10 max-w-3xl flex flex-col justify-end min-h-[400px] h-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Badge className="mb-4 w-fit flex items-center gap-1 bg-primary/90 hover:bg-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Featured Post
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg">{featuredPost.title}</h1>
            <p className="text-lg text-gray-200 mb-6 line-clamp-2 drop-shadow-md">{featuredPost.content.replace(/<[^>]*>?/gm, '')}</p>
            </div>
           <div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{featuredPost.authorId.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-white">{featuredPost.authorId.name}</span>
              </div>
              <span className="flex items-center gap-1 text-gray-200">
                <Calendar className="h-4 w-4" />
                {featuredPost.formattedDate || new Date(featuredPost.createdAt).toLocaleDateString()}
              </span>
            </div>

            <Button asChild size="lg" className="w-fit shadow-lg hover:scale-105 transition-transform">
              <Link href={`/blog/${featuredPost._id}`}>Read Article</Link>
            </Button></div>
          </div>
          {!featuredPost.featuredImage && (
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent"></div>
          )}
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
              <Link href="/profile">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {currentPosts.map((post) => (
              <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-muted">
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {post.categoryId && <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">{post.categoryId.name}</Badge>}
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.formattedDate || new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight">
                    <Link href={`/blog/${post._id}`} className="hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.content.replace(/<[^>]*>?/gm, '')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarFallback>{post.authorId.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{post.authorId.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button 
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-1 transition-colors ${post.userLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                      >
                        <Heart className={`h-4 w-4 ${post.userLiked ? 'fill-current' : ''}`} />
                        {post.likeCount || 0}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag.name} variant="outline" className="bg-secondary/50">#{tag.name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Categories</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddCategory(!showAddCategory)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddCategory && (
                <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-top-2">
                  <Input 
                    placeholder="New category..." 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" onClick={handleAddCategory} disabled={isCreatingCategory}>
                    {isCreatingCategory ? <Clock className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                  </Button>
                </div>
              )}
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
