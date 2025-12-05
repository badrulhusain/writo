import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
    const logs = await AuditLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
