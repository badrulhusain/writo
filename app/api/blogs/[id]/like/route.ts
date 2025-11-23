import { connectDB, Like } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const blogId = id;
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Check if like already exists
    const existingLike = await Like.findOne({
      userId,
      blogId: new mongoose.Types.ObjectId(blogId)
    });

    if (existingLike) {
      // Unlike: remove the like
      await Like.findByIdAndDelete(existingLike._id);
      // return updated count
      const likeCount = await Like.countDocuments({ blogId: new mongoose.Types.ObjectId(blogId) });
      return NextResponse.json({ liked: false, message: "Unliked", likeCount });
    } else {
      // Like: create new like
      await Like.create({
        userId,
        blogId: new mongoose.Types.ObjectId(blogId)
      });
      const likeCount = await Like.countDocuments({ blogId: new mongoose.Types.ObjectId(blogId) });
      return NextResponse.json({ liked: true, message: "Liked", likeCount });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blogId = id;

    // Count likes for this blog
    const likeCount = await Like.countDocuments({
      blogId: new mongoose.Types.ObjectId(blogId)
    });

    // Check if current user liked it (if authenticated)
    const session = await auth();
    let userLiked = false;

    if (session?.user?.id) {
      const userId = new mongoose.Types.ObjectId(session.user.id);
      const existingLike = await Like.findOne({
        userId,
        blogId: new mongoose.Types.ObjectId(blogId)
      });
      userLiked = !!existingLike;
    }

    return NextResponse.json({ likeCount, userLiked });
  } catch (error) {
    console.error('Error fetching like data:', error);
    return NextResponse.json({ error: "Failed to fetch like data" }, { status: 500 });
  }
}