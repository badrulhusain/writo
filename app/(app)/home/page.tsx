import { connectDB, Blog, Category, Tag, User, Like } from "@/lib/db";
import { auth } from "@/Auth";
import mongoose from "mongoose";
import HomeClient from "./components/HomeClient";

// Helper to fetch data directly from DB
async function getData() {
  try {
    await connectDB();
    const session = await auth();
    const userId = session?.user?.id ? new mongoose.Types.ObjectId(session.user.id) : null;

<<<<<<< HEAD
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
    photographer: string;
    photographerUrl: string;
  };
}
=======
    // 1. Fetch Blogs
    const blogs = await Blog.find({ status: "published" })
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });
>>>>>>> home

    // Aggregate like counts
    const blogIds = blogs.map((b: any) => b._id);
    const likeCounts = await Like.aggregate([
      { $match: { blogId: { $in: blogIds } } },
      { $group: { _id: "$blogId", count: { $sum: 1 } } }
    ]);

    const likeMap = new Map<string, number>();
    likeCounts.forEach((lc: any) => {
      likeMap.set(String(lc._id), lc.count);
    });

<<<<<<< HEAD
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
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(8);
  const [total, setTotal] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const blogsUrl = `/api/blogs?page=${page}&limit=${limit}`;
      const [blogsRes, categoriesRes, tagsRes, usersRes] = await Promise.all([
        fetch(blogsUrl),
        fetch("/api/categories"),
        fetch("/api/tags"),
        fetch("/api/users")
      ]);

      if (blogsRes.ok) {
        const blogsJson = await blogsRes.json();
        // If server returned paginated shape
        if (blogsJson && Array.isArray(blogsJson.blogs)) {
          setBlogPosts(blogsJson.blogs);
          setTotal(blogsJson.total ?? null);
        } else if (Array.isArray(blogsJson)) {
          // Backwards compatible response
          setBlogPosts(blogsJson);
          setTotal(null);
        }
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
=======
    // Get user likes if authenticated
    const userLikesSet = new Set<string>();
    if (userId) {
      const userLikes = await Like.find({ 
        userId, 
        blogId: { $in: blogIds } 
      });
      userLikes.forEach((like: any) => {
        userLikesSet.add(String(like.blogId));
      });
>>>>>>> home
    }

<<<<<<< HEAD
  

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

  // Filter posts based on search, category, and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.categoryId?.name === selectedCategory;
    const matchesTag = selectedTag === "All" || post.tags.some(tag => tag.name === selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });
=======
    // Serialize blogs
    const serializedBlogs = blogs.map((blog: any) => ({
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      authorId: {
        name: blog.authorId?.name || "Unknown",
        email: blog.authorId?.email || "",
      },
      categoryId: blog.categoryId ? { name: blog.categoryId.name } : undefined,
      tags: blog.tags.map((t: any) => ({ name: t.name })),
      createdAt: blog.createdAt.toISOString(),
      formattedDate: new Date(blog.createdAt).toLocaleDateString('en-GB'),
      status: blog.status,
      featuredImage: blog.featuredImage ? {
        url: blog.featuredImage.url,
        alt: blog.featuredImage.alt,
        photographer: blog.featuredImage.photographer,
        photographerUrl: blog.featuredImage.photographerUrl,
      } : undefined,
      likeCount: likeMap.get(String(blog._id)) || 0,
      userLiked: userLikesSet.has(String(blog._id))
    }));
>>>>>>> home

    // 2. Fetch Categories
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "categoryId",
          as: "blogs"
        }
      },
      {
        $addFields: {
          count: { $size: "$blogs" }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 3. Fetch Tags
    const tags = await Tag.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "tags",
          as: "blogs"
        }
      },
      {
        $addFields: {
          count: { $size: "$blogs" }
        }
      },
      {
        $match: {
          count: { $gt: 0 }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // 4. Fetch Users
    const users = await User.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "authorId",
          as: "blogs"
        }
      },
      {
        $addFields: {
          publishedBlogsCount: {
            $size: {
              $filter: {
                input: "$blogs",
                as: "blog",
                cond: { $eq: ["$$blog.status", "published"] }
              }
            }
          }
        }
      },
      {
        $match: {
          publishedBlogsCount: { $gt: 0 }
        }
      },
      {
        $sort: { publishedBlogsCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          publishedBlogsCount: 1
        }
      }
    ]);
    
    const serializedUsers = users.map((u: any) => ({
      ...u,
      _id: u._id.toString()
    }));

    return {
      blogs: serializedBlogs,
      categories,
      tags,
      users: serializedUsers
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      blogs: [],
      categories: [],
      tags: [],
      users: []
    };
  }
}

export default async function HomePage() {
  const data = await getData();

  return (
<<<<<<< HEAD
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
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          )}
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-4 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Featured Post
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{featuredPost.title}</h1>
            <p className="text-lg text-gray-200 mb-6">{featuredPost.content.substring(0, 200)}...</p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{featuredPost.authorId.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-white">{featuredPost.authorId.name}</span>
              </div>
              <span className="flex items-center gap-1 text-gray-200">
                <Calendar className="h-4 w-4" />
                {new Date(featuredPost.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Button asChild>
              <Link href={`/blog/${featuredPost._id}`}>Read Article</Link>
            </Button>
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
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <div className="text-sm text-muted-foreground">
                Page {page}{total ? ` of ${Math.max(1, Math.ceil(total / limit))}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={total !== null ? page * limit >= total : false}
              >
                Next
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/blog">View All</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {regularPosts.map((post) => (
              <Card key={post._id} className="hover:shadow-md transition-shadow overflow-hidden">
                {post.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                )}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className={`p-1 h-8 ${post.userLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`mr-1 h-4 w-4 ${post.userLiked ? 'fill-current' : ''}`} />
                        {post.likeCount || 0}
                      </Button>
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
=======
    <HomeClient
      initialBlogs={data.blogs}
      initialCategories={data.categories}
      initialTags={data.tags}
      initialUsers={data.users}
    />
>>>>>>> home
  );
}