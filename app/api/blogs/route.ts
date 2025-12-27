import { connectDB, Blog, Category, Tag, Like, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();


    const blogs = await Blog.find({ status: "published" })
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    // Aggregate like counts
    const blogIds = blogs.map((b: any) => b._id);
    const likeCounts = await Like.aggregate([
      { $match: { blogId: { $in: blogIds } } },
      { $group: { _id: "$blogId", count: { $sum: 1 } } }
    ]);

    const likeMap = new Map<string, number>();
    likeCounts.forEach((lc: any) => {
      likeMap.set(String(lc._id), lc.count);
    });

    // Get user likes if authenticated
    const userLikesSet = new Set<string>();
    
    const user = await currentUser();
    if (user && user.emailAddresses?.[0]?.emailAddress) {
       const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
       if (dbUser) {
          const userId = dbUser._id;
          const userLikes = await Like.find({ 
            userId, 
            blogId: { $in: blogIds } 
          });
          userLikes.forEach((like: any) => {
            userLikesSet.add(String(like.blogId));
          });
       }
    }

    // Attach likeCount and userLiked to each blog object
    const blogsWithLikes = blogs.map((blog: any) => ({
      ...blog.toObject ? blog.toObject() : blog,
      likeCount: likeMap.get(String(blog._id)) || 0,
      userLiked: userLikesSet.has(String(blog._id))
    }));

    console.log(`Fetched ${blogs.length} published blogs`);
    return NextResponse.json(blogsWithLikes);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

async function getOrCreateCategory(name: string) {
  if (!name) return null;
  let categoryDoc = await Category.findOne({ name });
  if (!categoryDoc) {
    categoryDoc = await Category.create({ name });
  }
  return categoryDoc;
}

async function getOrCreateTags(tags: string[]) {
  const tagIds = [];
  if (tags && Array.isArray(tags)) {
    for (const tagName of tags) {
      let tagDoc = await Tag.findOne({ name: tagName });
      if (!tagDoc) {
        tagDoc = await Tag.create({ name: tagName });
      }
      tagIds.push(tagDoc._id);
    }
  }
  return tagIds;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await currentUser();
    
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized - User not found in DB" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, category, tags, status, featuredImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const categoryDoc = await getOrCreateCategory(category);
    const tagIds = await getOrCreateTags(tags);

    const blog = await Blog.create({
      title,
      content,
      authorId: dbUser._id,
      categoryId: categoryDoc?._id,
      tags: tagIds,
      status,
      featuredImage,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name email')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    return NextResponse.json(populatedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
