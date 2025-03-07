import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { text } = await request.json();
  // ...existing code...
  return NextResponse.json({ success: true });
};
