import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB, User, Blog } from "@/lib/db";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      publishedPosts,
      draftPosts,
      adminUsers
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Like.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      User.countDocuments({ role: "ADMIN" })
    ]);
    
    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      publishedPosts,
      draftPosts,
      adminUsers
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
