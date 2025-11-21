import { NextResponse } from "next/server";
import { auth } from "@/Auth";
import { connectDB, Blog, Like } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");

    const query: Record<string, any> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (categoryId && categoryId !== "all") {
      query.categoryId = categoryId;
    }

    if (authorId) {
      query.authorId = authorId;
    }

    const blogs = await Blog.find(query)
      .populate("authorId", "name email")
      .populate("categoryId", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    const blogIds = blogs.map((blog: any) => blog._id);

    const likeCounts = blogIds.length
      ? await Like.aggregate([
          { $match: { blogId: { $in: blogIds } } },
          { $group: { _id: "$blogId", count: { $sum: 1 } } },
        ])
      : [];

    const likeMap = new Map<string, number>();
    likeCounts.forEach((lc: any) => {
      likeMap.set(String(lc._id), lc.count);
    });

    const blogsWithLikes = blogs.map((blog: any) => ({
      ...blog.toObject ? blog.toObject() : blog,
      likeCount: likeMap.get(String(blog._id)) || 0,
    }));

    return NextResponse.json(blogsWithLikes);
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

