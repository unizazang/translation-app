import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get("file");
  // ...existing code...
  return NextResponse.json({ success: true });
};
