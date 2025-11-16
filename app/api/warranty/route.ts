import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("📩 CYS Warranty Registration:", data);

  // TODO: 在這裡串接資料庫或 Google Sheet / Email 服務
  return NextResponse.json({ message: "保固登記成功！感謝您選擇 CYS ✨" });
}

