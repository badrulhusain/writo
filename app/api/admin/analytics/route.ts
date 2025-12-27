import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB, Blog } from "@/lib/db";
import Like from "@/models/Like";
import Comment from "@/models/Comment";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    
    // Get top posts by views
    const topPostsByViews = await Blog.find({ status: "published" })
      .sort({ views: -1 })
      .limit(10)
      .select("title views")
      .lean();
    
    // Get top posts by likes
    const likeCounts = await Like.aggregate([
      { $group: { _id: "$blogId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const topPostsByLikes = await Promise.all(
      likeCounts.map(async (item) => {
        const post = await Blog.findById(item._id).select("title");
        return {
          title: post?.title || "Unknown",
          likes: item.count
        };
      })
    );
    
    // Get top posts by comments
    const commentCounts = await Comment.aggregate([
      { $group: { _id: "$blogId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const topPostsByComments = await Promise.all(
      commentCounts.map(async (item) => {
        const post = await Blog.findById(item._id).select("title");
        return {
          title: post?.title || "Unknown",
          comments: item.count
        };
      })
    );
    
    return NextResponse.json({
      topPostsByViews,
      topPostsByLikes,
      topPostsByComments
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
