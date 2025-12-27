import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    
    const comments = await Comment.find({ status })
      .populate("authorId", "name email")
      .populate("blogId", "title")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const body = await request.json();
    const { commentId, status } = body;
    
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status },
      { new: true }
    );
    
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");
    
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }
    
    const comment = await Comment.findByIdAndDelete(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
