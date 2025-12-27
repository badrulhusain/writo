import { NextRequest, NextResponse } from "next/server";
import { connectDB, User } from "@/lib/db";
import View from "@/models/View";
// Removed currentUser from lib/auth as it was causing conflicts or incorrect usage if related to next-auth, 
// OR keep it if it is the CLERK one. 
// The user file had: import { currentUser } from "@/lib/auth";
// And lib/auth.ts HAD Clerk's currentUser.
// So usage is Fine.
// Problem is dbUser._id is unknown.
import { currentUser } from "@/lib/auth";

// POST /api/views - Record a view
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { blogId } = await req.json();
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const user = await currentUser();
    // Resolve DB user ID if authenticated
    let userId: string | undefined;
    if (user && user.emailAddresses?.[0]?.emailAddress) {
       const dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });
       if (dbUser) {
         // @ts-ignore
         userId = dbUser._id.toString();
       }
    }

    // Check if we already have a view from this user/IP for this blog
    const query: any = { blogId };
    
    if (userId) {
      // Authenticated user
      query.userId = userId;
    } else {
      // Anonymous user - use IP address
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      query.ipAddress = ip;
    }
    
    // Check if view already exists
    const existingView = await View.findOne(query);
    
    if (!existingView) {
      // Create new view record
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
    
    // Get total view count for this blog
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