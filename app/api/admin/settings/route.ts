import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    
    const settings = await Settings.find().lean();
    
    // Convert to key-value object
    const settingsObj: Record<string, string> = {};
    settings.forEach((setting: any) => {
      settingsObj[setting.key] = setting.value;
    });
    
    return NextResponse.json(settingsObj);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const body = await request.json();
    
    // Update or create each setting
    for (const [key, value] of Object.entries(body)) {
      await Settings.findOneAndUpdate(
        { key },
        { key, value, category: "general" },
        { upsert: true, new: true }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
