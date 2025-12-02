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
  return join(process.cwd(), "data", "warranties.json");
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

    const filePath = getWarrantyFilePath();

    if (!existsSync(filePath)) {
      return NextResponse.json({ warranties: [] });
    }

    const data = await readFile(filePath, "utf-8");
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

