import { connectDB, Category } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Get all categories with blog count
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "categoryId",
          as: "blogs"
        }
      },
      {
        $addFields: {
          count: { $size: "$blogs" }
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
      }
    ]);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}