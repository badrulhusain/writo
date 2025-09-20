import { db } from "@/lib/db";
import { auth } from "@/Auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const blog = await db.blog.findUnique({ where: { id } });

  if (!blog || blog.authorId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updatedBlog = await db.blog.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(updatedBlog);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const blog = await db.blog.findUnique({ where: { id } });

  if (!blog || blog.authorId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.blog.delete({ where: { id } });

  return NextResponse.json({ message: "Blog deleted" });
}