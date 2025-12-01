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
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    return decoded.startsWith(`${adminUsername}:`);
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
      console.log("Warranties file not found, returning empty array");
      return NextResponse.json({ warranties: [] });
    }

    const data = await readFile(filePath, "utf-8");
    let warranties = [];
    
    try {
      warranties = JSON.parse(data);
      // 確保返回的是數組
      if (!Array.isArray(warranties)) {
        console.warn("Warranties data is not an array, converting...");
        warranties = [];
      }
    } catch (parseError) {
      console.error("Error parsing warranties JSON:", parseError);
      warranties = [];
    }
    
    console.log(`Found ${warranties.length} warranties`);
    return NextResponse.json({ warranties });
  } catch (error) {
    console.error("Error reading warranties:", error);
    return NextResponse.json(
      { error: "讀取資料失敗", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

