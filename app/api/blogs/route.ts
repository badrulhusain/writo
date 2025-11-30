import { connectDB, Blog, Category, Tag, Like } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : null;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : null;

    // If pagination params provided, apply skip/limit
    const query = Blog.find({ status: "published" })
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    let blogs: any[];
    let total = 0;
    if (page && limit) {
      total = await Blog.countDocuments({ status: "published" });
      blogs = await query.skip((page - 1) * limit).limit(limit).exec();
    } else {
      blogs = await query.exec();
    }
    // Aggregate like counts for the returned blogs to avoid N+1 requests from the client
    const blogIds = blogs.map((b: any) => b._id);
    const likeCounts = await Like.aggregate([
      { $match: { blogId: { $in: blogIds } } },
      { $group: { _id: "$blogId", count: { $sum: 1 } } }
    ]);

    const likeMap = new Map<string, number>();
    likeCounts.forEach((lc: any) => {
      likeMap.set(String(lc._id), lc.count);
    });

    // Attach likeCount to each blog object
    const blogsWithLikes = blogs.map((blog: any) => ({
      ...blog.toObject ? blog.toObject() : blog,
      likeCount: likeMap.get(String(blog._id)) || 0,
    }));
    console.log(`Fetched ${blogs.length} published blogs`);
    blogs.forEach(blog => console.log(`Blog: ${blog.title} - Status: ${blog.status}`));

    // If pagination was used return a structured response
    if (page && limit) {
      return NextResponse.json({ blogs: blogsWithLikes, total, page, limit });
    }

    // Backwards compatible: return array when no pagination params
    return NextResponse.json(blogsWithLikes);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Getting session...");
    const session = await auth();
    console.log("Session:", session);
    if (!session || !session.user || !session.user.id) {
      console.log("Unauthorized - no session or user id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Parsing request body...");
    const body = await req.json();
    console.log("Request body:", body);
    const { title, content, category, tags, status, featuredImage } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Find or create category
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category });
      }
    }

    // Find or create tags
    const tagIds = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        let tagDoc = await Tag.findOne({ name: tagName });
        if (!tagDoc) {
          tagDoc = await Tag.create({ name: tagName });
        }
        tagIds.push(tagDoc._id);
      }
    }

    // Create blog
    console.log("Creating blog with data:", {
      title,
      content,
      authorId: session.user.id,
      categoryId: categoryDoc?._id,
      tags: tagIds,
      status,
      featuredImage,
    });
    const blog = await Blog.create({
      title,
      content,
      authorId: new mongoose.Types.ObjectId(session.user.id),
      categoryId: categoryDoc?._id,
      tags: tagIds,
      status,
      featuredImage,
    });
    console.log("Blog created:", blog);

    // Populate the created blog
    const populatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    return NextResponse.json(populatedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
