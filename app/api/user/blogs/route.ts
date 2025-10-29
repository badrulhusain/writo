import { connectDB, Blog, Category, Tag } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Use lean() for better performance when you don't need Mongoose documents
    const blogs = await Blog.find({ authorId: session.user.id })
      .select('title content status createdAt likeCount') // Only select needed fields
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get stats
    const totalPosts = blogs.length;
    const publishedPosts = blogs.filter(blog => blog.status === 'published').length;
    const draftPosts = blogs.filter(blog => blog.status === 'draft').length;

    // Calculate total likes (simplified - would need aggregation in real app)
    const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likeCount || 0), 0);

    return NextResponse.json({
      blogs,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalLikes
      }
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}