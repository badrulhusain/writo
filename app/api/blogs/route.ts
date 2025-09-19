import { db } from "@/lib/db"; // your Prisma or DB connection
import { auth } from "@/Auth";

import { NextResponse } from "next/server";

export async function GET() {
  const blogs = await db.blog.findMany({ include: { author: true } });
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const blog = await db.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(blog);
}
