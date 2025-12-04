import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/bookmarks - Add a bookmark
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await req.json();
    
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userId: session.user.id,
      blogId
    });

    if (existingBookmark) {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 400 });
    }

    const bookmark = await Bookmark.create({
      userId: session.user.id,
      blogId
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

// DELETE /api/bookmarks?blogId={id} - Remove a bookmark
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId parameter" }, { status: 400 });
    }

    const result = await Bookmark.deleteOne({
      userId: session.user.id,
      blogId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}

// GET /api/bookmarks?blogId={id} - Check if a blog is bookmarked by the user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId parameter" }, { status: 400 });
    }

    const bookmark = await Bookmark.findOne({
      userId: session.user.id,
      blogId
    });

    return NextResponse.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json({ error: "Failed to check bookmark" }, { status: 500 });
  }
}