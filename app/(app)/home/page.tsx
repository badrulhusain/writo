export const dynamic = 'force-dynamic';
import { connectDB, Blog, Category, Tag, User, Like } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import mongoose from "mongoose";
import HomeClient from "./components/HomeClient";

// Helper to fetch data directly from DB
async function getData() {
  try {
    await connectDB();
    const user = await currentUser();
    let userId = null;

    if (user && user.emailAddresses?.length > 0) {
      const email = user.emailAddresses[0].emailAddress;
      const dbUser = await User.findOne({ email });
      if (dbUser) {
        userId = dbUser._id;
      }
    }

    // 1. Fetch Blogs
    const blogs = await Blog.find({ status: "published" })
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

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
    }

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
    <HomeClient
      initialBlogs={data.blogs}
      initialCategories={data.categories}
      initialTags={data.tags}
      initialUsers={data.users}
    />
  );
}