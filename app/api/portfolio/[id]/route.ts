import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 处理 Next.js 15 的 params Promise
    const { id } = await params;
    
    // 取得 JSON 路徑（可在 Vercel 正式站運作）
    const filePath = path.join(process.cwd(), "public/data/works.json");

    // 讀取 JSON
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // 找作品（確保 id 類型匹配）
    const item = data.works.find((w: any) => w.id === Number(id) || w.id === id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
