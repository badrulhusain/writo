import { connectDB, Blog, Category, Tag, Like, User } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getHomeData } from "@/lib/services/blog-service";


export async function GET() {
  try {
    const user = await currentUser();
    let userId = null;
    if (user && user.emailAddresses?.[0]?.emailAddress) {
       const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress }) as any;
       if (dbUser) userId = dbUser._id.toString();
    }

    const { blogs } = await getHomeData(userId);
    return NextResponse.json(blogs);
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
