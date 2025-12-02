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

// 獲取保固資料文件路徑（統一使用 /tmp）
function getWarrantyFilePath() {
  return "/tmp/warranties.json";
}

// 獲取備用文件路徑（項目目錄，用於讀取現有數據）
function getBackupFilePath() {
  return join(process.cwd(), "data", "warranties.json");
}

// 統一的文件讀取函數
async function readWarrantiesFile(): Promise<string | null> {
  const primaryPath = getWarrantyFilePath();
  const backupPath = getBackupFilePath();
  
  // 優先讀取主路徑（/tmp）
  if (existsSync(primaryPath)) {
    try {
      return await readFile(primaryPath, "utf-8");
    } catch (error) {
      console.log(`Cannot read from ${primaryPath}, trying backup`);
    }
  }
  
  // 如果主路徑不存在，嘗試備用路徑（項目目錄）
  if (existsSync(backupPath)) {
    try {
      return await readFile(backupPath, "utf-8");
    } catch (error) {
      console.log(`Cannot read from ${backupPath}`);
    }
  }
  
  return null;
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

    // 讀取保固資料
    const data = await readWarrantiesFile();
    
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

