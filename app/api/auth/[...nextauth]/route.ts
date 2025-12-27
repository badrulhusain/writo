import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "This route is deprecated. Please use Clerk for authentication." }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ message: "This route is deprecated. Please use Clerk for authentication." }, { status: 410 });
}
