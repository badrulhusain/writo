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

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const category = await Category.create({ name });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}