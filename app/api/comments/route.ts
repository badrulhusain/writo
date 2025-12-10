import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { auth } from "@/Auth";

// POST /api/comments - Create a new comment
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, blogId, parentId } = await req.json();
    
    if (!content || !blogId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await Comment.create({
      content,
      authorId: session.user.id,
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
    await dbConnect();
    
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