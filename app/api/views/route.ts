import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/lib/db";
import View from "@/models/View";
import { currentUser } from "@/lib/auth";

async function getUserId(user: any) {
  if (user && user.emailAddresses?.[0]?.emailAddress) {
    const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
    if (dbUser) {
      // @ts-expect-error: mongoose document _id type mismatch with string
      return dbUser._id.toString();
    }
  }
  return undefined;
}

async function recordViewIfNotExists(blogId: string, userId: string | undefined, req: NextRequest) {
  const query: any = { blogId };
  
  if (userId) {
    query.userId = userId;
  } else {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    query.ipAddress = ip;
  }
  
  const existingView = await View.findOne(query);
  
  if (!existingView) {
    const viewData: any = { blogId };
    
    if (userId) {
      viewData.userId = userId;
    } else {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      viewData.ipAddress = ip;
    }
    
    viewData.userAgent = req.headers.get('user-agent') || '';
    await View.create(viewData);
  }
}

// POST /api/views - Record a view
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { blogId } = await req.json();
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const user = await currentUser();
    const userId = await getUserId(user);

    await recordViewIfNotExists(blogId, userId, req);
    const viewCount = await View.countDocuments({ blogId });
    
    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

// GET /api/views?blogId={id} - Get view count for a blog
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId parameter" }, { status: 400 });
    }

    const viewCount = await View.countDocuments({ blogId });
    
    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error("Error fetching view count:", error);
    return NextResponse.json({ error: "Failed to fetch view count" }, { status: 500 });
  }
}