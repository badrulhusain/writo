import { connectDB, Blog, Like } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id)
      .populate('authorId', 'name email image')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Convert to plain object and attach dynamic like information
    const blogObj = blog.toObject ? blog.toObject() : blog;

    // Get like count for this blog
    const likeCount = await Like.countDocuments({ blogId: blog._id });

    // Determine if the current user has liked the blog
    let likedByCurrentUser = false;
    try {
      const session = await auth();
      if (session && session.user && session.user.id) {
        const existing = await Like.findOne({ blogId: blog._id, userId: session.user.id });
        likedByCurrentUser = Boolean(existing);
      }
    } catch (e) {
      // If auth fails for some reason, just treat as not liked by current user
      console.warn('Could not determine current user like state:', e);
    }

    // Determine if the current user is the author (server-side trust)
    let isOwner = false;
    try {
      const session = await auth();
      if (session && session.user && session.user.id) {
        const blogAuthorId = blog?.authorId && (blog.authorId._id ? String(blog.authorId._id) : String(blog.authorId));
        isOwner = String(session.user.id) === String(blogAuthorId);
      }
    } catch (e) {
      // If auth fails, default to false (not owner)
      console.warn('Could not determine owner state:', e);
    }

    return NextResponse.json({ ...blogObj, likeCount, likedByCurrentUser, isOwner });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const blog = await Blog.findById(id);

    const isAdmin = session.user.role === "ADMIN";

    // Normalize stored author id (handle populated author objects)
    const blogAuthorId = blog?.authorId && (blog.authorId._id ? String(blog.authorId._id) : String(blog.authorId));

    if (!blog || (!isAdmin && blogAuthorId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates: Record<string, any> = {};

    if (typeof body.title === "string") {
      updates.title = body.title;
    }

    if (typeof body.content === "string") {
      updates.content = body.content;
    }

    if (typeof body.status === "string") {
      updates.status = body.status;
    }

    if (body.categoryId) {
      updates.categoryId = body.categoryId;
    }

    if (Array.isArray(body.tags)) {
      updates.tags = body.tags;
    }

    if (body.featuredImage) {
      updates.featuredImage = body.featuredImage;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true })
      .populate('authorId', 'name email image')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    // attach latest likeCount after update
    const updatedObj = updatedBlog?.toObject ? updatedBlog.toObject() : updatedBlog;
    const likeCount = await Like.countDocuments({ blogId: updatedBlog._id });

    return NextResponse.json({ ...updatedObj, likeCount });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const blog = await Blog.findById(id);

    const isAdmin = session.user.role === "ADMIN";

    const blogAuthorId = blog?.authorId && (blog.authorId._id ? String(blog.authorId._id) : String(blog.authorId));

    if (!blog || (!isAdmin && blogAuthorId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete blog and associated likes
    await Blog.findByIdAndDelete(id);
    await Like.deleteMany({ blogId: id });

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}