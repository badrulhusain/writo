import { NextRequest, NextResponse } from "next/server";
import {  connectDB, User } from "@/lib/db";
import Comment from "@/models/Comment";
import { currentUser } from "@/lib/auth";

// POST /api/comments - Create a new comment
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve DB user
    const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    if (!dbUser) {
        return NextResponse.json({ error: "Unauthorized - User not found in DB" }, { status: 401 });
    }

    const { content, blogId, parentId } = await req.json();
    
    if (!content || !blogId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await Comment.create({
      content,
      authorId: dbUser._id,
      blogId,
      parentId: parentId || null
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// GET /api/comments?blogId={id} - Get comments for a blog post
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId parameter" }, { status: 400 });
    }

    const comments = await Comment.find({ blogId })
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}