import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface WarrantyData {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  project: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriod: number;
  createdAt?: string;
  updatedAt?: string;
}

function getWarrantyFilePath() {
  // 在 Vercel 上，尝试使用 /tmp 目录（可写）
  // 如果 /tmp 不可用，则使用项目目录
  const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
  
  if (isVercel) {
    // Vercel 环境：使用 /tmp 目录
    return "/tmp/warranties.json";
  } else {
    // 本地开发：使用项目目录
    return join(process.cwd(), "data", "warranties.json");
  }
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "請輸入聯絡電話" },
        { status: 400 }
      );
    }

    // 尝试从多个位置读取文件
    const projectPath = join(process.cwd(), "data", "warranties.json");
    const tmpPath = "/tmp/warranties.json";
    
    let filePath = projectPath;
    let data = "";
    
    // 优先尝试项目目录
    if (existsSync(projectPath)) {
      try {
        data = await readFile(projectPath, "utf-8");
        filePath = projectPath;
      } catch (error) {
        console.log("Cannot read from project path, trying /tmp");
      }
    }
    
    // 如果项目目录读取失败，尝试 /tmp
    if (!data && existsSync(tmpPath)) {
      try {
        data = await readFile(tmpPath, "utf-8");
        filePath = tmpPath;
      } catch (error) {
        console.log("Cannot read from /tmp either");
      }
    }
    
    if (!data) {
      return NextResponse.json({ warranties: [] });
    }

    const allWarranties: WarrantyData[] = JSON.parse(data);

    // 根據電話號碼查詢（支援部分匹配）
    const phoneStr = phone.trim().replace(/\s+/g, "");
    const matchingWarranties = allWarranties.filter((warranty) => {
      const warrantyPhone = warranty.phone.trim().replace(/\s+/g, "");
      return warrantyPhone.includes(phoneStr) || phoneStr.includes(warrantyPhone);
    });

    return NextResponse.json({ warranties: matchingWarranties });
  } catch (error) {
    console.error("Error querying warranties:", error);
    return NextResponse.json(
      { error: "查詢失敗，請稍後再試" },
      { status: 500 }
    );
  }
}

