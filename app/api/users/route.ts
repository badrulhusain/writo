import { connectDB, User } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Aggregate users with their published blog count
    const trendingUsers = await User.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "authorId",
          as: "blogs"
        }
      },
      {
        $addFields: {
          publishedBlogsCount: {
            $size: {
              $filter: {
                input: "$blogs",
                as: "blog",
                cond: { $eq: ["$$blog.status", "published"] }
              }
            }
          }
        }
      },
      {
        $match: {
          publishedBlogsCount: { $gt: 0 }
        }
      },
      {
        $sort: { publishedBlogsCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          publishedBlogsCount: 1
        }
      }
    ]);

    return NextResponse.json(trendingUsers);
  } catch (error) {
    console.error('Error fetching trending users:', error);
    return NextResponse.json({ error: "Failed to fetch trending users" }, { status: 500 });
  }
}