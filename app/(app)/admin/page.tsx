"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface AdminBlog {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  likeCount?: number;
  authorId: {
    name?: string;
    email?: string;
  };
  categoryId?: {
    name: string;
  } | null;
}

interface CategoryStat {
  _id: string;
  name: string;
  count: number;
}

const AdminPage = () => {
  const router = useRouter();
  const user = useCurrentUser();

  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [blogsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/blogs"),
        fetch("/api/categories"),
      ]);

      if (!blogsRes.ok) {
        if (blogsRes.status === 403) {
          setError("You need admin privileges to access this page.");
        } else {
          setError("Failed to load blogs. Please try again.");
        }
        setBlogs([]);
      } else {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError("Something went wrong while loading admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAdminData();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/home");
    }
  }, [user, router]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return blogs.filter((blog) => {
      const authorName = blog.authorId?.name?.toLowerCase() ?? "";
      const matchesSearch =
        !normalizedSearch ||
        blog.title.toLowerCase().includes(normalizedSearch) ||
        blog.content.toLowerCase().includes(normalizedSearch) ||
        authorName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ? true : blog.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all"
          ? true
          : (blog.categoryId?.name?.toLowerCase() || "uncategorized") ===
            categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const published = blogs.filter((blog) => blog.status === "published").length;
    const drafts = blogs.filter((blog) => blog.status === "draft").length;
    const totalLikes = blogs.reduce(
      (sum, blog) => sum + (blog.likeCount || 0),
      0
    );

    return {
      total: blogs.length,
      published,
      drafts,
      totalLikes,
    };
  }, [blogs]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post.");
      }

      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error(err);
      window.alert("Unable to delete the blog post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (user && user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-medium uppercase tracking-wide">
              Admin Only
            </p>
          </div>
          <h1 className="text-3xl font-bold mt-2">Admin Control Center</h1>
          <p className="text-muted-foreground">
            Manage every blog post and monitor categories in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchAdminData} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/blog/create">
              <Plus className="mr-2 h-4 w-4" />
              New Blog
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Permission issue</CardTitle>
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all authors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Live on site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">Engagement overall</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>Search, filter, and manage every blog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, content, or author..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="flex flex-1 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading blogs...
                </p>
              ) : filteredBlogs.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No blogs match the current filters.
                  </p>
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{blog.title}</h3>
                        <Badge
                          variant={
                            blog.status === "published" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {blog.status}
                        </Badge>
                        <Badge variant="outline">
                          {blog.categoryId?.name || "Uncategorized"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {blog.content}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>
                          Author: {blog.authorId?.name || "Unknown author"}
                        </span>
                        <span>
                          Created:{" "}
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span>Likes: {blog.likeCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${blog._id}`}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${blog._id}/edit`}>
                          <Pencil className="mr-1 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {deletingId === blog._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Overview of all categories and their blog counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No categories found.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.count} blog{category.count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;

