import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 驗證管理員身份
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  if (!token) {
    return false;
  }

  // 簡單驗證（生產環境應使用更安全的方式）
  try {
    const decoded = Buffer.from(token.value, "base64").toString("utf-8");
    return decoded.startsWith(process.env.ADMIN_USERNAME || "admin:");
  } catch {
    return false;
  }
}

// 獲取保固資料文件路徑
function getWarrantyFilePath() {
  return join(process.cwd(), "data", "warranties.json");
}

// GET: 獲取所有保固資料
export async function GET() {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "未授權" },
      { status: 401 }
    );
  }

  try {
    const filePath = getWarrantyFilePath();
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ warranties: [] });
    }

    const data = await readFile(filePath, "utf-8");
    const warranties = JSON.parse(data);
    
    return NextResponse.json({ warranties });
  } catch (error) {
    console.error("Error reading warranties:", error);
    return NextResponse.json(
      { error: "讀取資料失敗" },
      { status: 500 }
    );
  }
}

