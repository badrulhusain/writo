import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB, User } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    
    const query: any = {};
    if (role) {
      query.role = role;
    }
    
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const body = await request.json();
    const { userId, role } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
