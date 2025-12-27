import { NextResponse } from "next/server";
import { connectDB, Blog, Like, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

