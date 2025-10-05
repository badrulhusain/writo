import { connectDB, Blog, Category, Tag } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs);
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
    const { title, content, category, tags, publishImmediately } = body;

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
      status: publishImmediately ? "published" : "draft",
    });
    const blog = await Blog.create({
      title,
      content,
      authorId: new mongoose.Types.ObjectId(session.user.id),
      categoryId: categoryDoc?._id,
      tags: tagIds,
      status: publishImmediately ? "published" : "draft",
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
