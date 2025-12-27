import { connectDB, Blog, Category, Tag, User, Like } from "@/lib/db";
import mongoose from "mongoose";
import { cache } from "react";

export interface SerializedBlog {
  _id: string;
  title: string;
  content: string;
  authorId: {
    name: string;
    email: string;
  };
  categoryId?: { name: string };
  tags: { name: string }[];
  createdAt: string;
  formattedDate: string;
  status: string;
  featuredImage?: {
    url: string;
    alt: string;
    photographer: string;
    photographerUrl: string;
  };
  likeCount: number;
  userLiked: boolean;
}

export const getHomeData = cache(async (userId?: string | null) => {
  await connectDB();

  // 1. Fetch Blogs
  const blogs = await Blog.find({ status: "published" })
    .populate('authorId', 'name email')
    .populate('categoryId', 'name')
    .populate('tags', 'name')
    .sort({ createdAt: -1 });

  const blogIds = blogs.map((b: any) => b._id);

  // Aggregate like counts
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

  const serializedBlogs: SerializedBlog[] = blogs.map((blog: any) => ({
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
      url: blog.featuredImage.url || "",
      alt: blog.featuredImage.alt || "",
      photographer: blog.featuredImage.photographer || "",
      photographerUrl: blog.featuredImage.photographerUrl || "",
    } : undefined,
    likeCount: likeMap.get(String(blog._id)) || 0,
    userLiked: userLikesSet.has(String(blog._id))
  }));

  // 2. Fetch Categories with counts
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

  // 3. Fetch Top Tags
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

  // 4. Fetch Top Authors
  const authors = await User.aggregate([
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

  const serializedAuthors = authors.map((u: any) => ({
    ...u,
    _id: u._id.toString()
  }));

  return {
    blogs: serializedBlogs,
    categories,
    tags,
    users: serializedAuthors
  };
});
