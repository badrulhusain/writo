import { connectDB, User } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user stats
    const postsCount = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "authorId",
          as: "posts"
        }
      },
      {
        $addFields: {
          postsCount: { $size: "$posts" }
        }
      },
      {
        $project: { postsCount: 1 }
      }
    ]);

    // For now, mock followers/following as they're not implemented
    const stats = {
      posts: postsCount[0]?.postsCount || 0,
      followers: 0,
      following: 0
    };

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        avatar: user.image || "",
        role: user.role,
        createdAt: user.createdAt
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}