import { connectDB, Like, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const blogId = id;
    const userId = dbUser._id;

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
    const user = await currentUser();
    let userLiked = false;

    if (user && user.emailAddresses?.[0]?.emailAddress) {
       const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
       if (dbUser) {
          const userId = dbUser._id;
          const existingLike = await Like.findOne({
            userId,
            blogId: new mongoose.Types.ObjectId(blogId)
          });
          userLiked = !!existingLike;
       }
    }

    return NextResponse.json({ likeCount, userLiked });
  } catch (error) {
    console.error('Error fetching like data:', error);
    return NextResponse.json({ error: "Failed to fetch like data" }, { status: 500 });
  }
}