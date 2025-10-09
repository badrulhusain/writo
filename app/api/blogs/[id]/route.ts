import { connectDB, Blog, User, Category, Tag } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id)
      .populate('authorId', 'name email image')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const blog = await Blog.findById(id);

    if (!blog || blog.authorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      title: body.title,
      content: body.content,
    }, { new: true })
      .populate('authorId', 'name email image')
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog || blog.authorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}