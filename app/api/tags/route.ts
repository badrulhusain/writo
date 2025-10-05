import { connectDB, Tag } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Get trending tags (most used)
    const tags = await Tag.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "tags",
          as: "blogs"
        }
      },
      {
        $addFields: {
          count: { $size: "$blogs" }
        }
      },
      {
        $match: {
          count: { $gt: 0 }
        }
      },
      {
        $project: {
          name: 1,
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}