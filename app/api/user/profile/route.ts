import { connectDB, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses?.[0]?.emailAddress) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    let dbUser = await User.findOne({ email: clerkUser.emailAddresses[0].emailAddress }).select('-password');
    
    if (!dbUser) {
      // Sync on demand: Create user if they exist in Clerk but not in our DB
      dbUser = await User.create({
        name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : clerkUser.username || "User",
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl,
        role: "USER",
      });
    }

    const user = dbUser;

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