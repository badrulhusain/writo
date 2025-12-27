import { connectDB, Blog, Like, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    let dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    
    if (!dbUser) {
      // Sync on demand
      dbUser = await User.create({
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "User",
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        role: "USER",
      });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Use lean() for better performance when you don't need Mongoose documents
    const blogs = await Blog.find({ authorId: dbUser._id })
      .select('title content status createdAt featuredImage') // Only select needed fields
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
    // Calculate total likes by counting documents in the Like collection for these blogs
    const blogIds = blogs.map(b => b._id);
    const totalLikes = await Like.countDocuments({ 
      blogId: { $in: blogIds } 
    });

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