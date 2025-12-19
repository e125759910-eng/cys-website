import { NextResponse } from "next/server";
import { readWarranties } from "@/lib/warranty-storage";

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
    const allWarranties = await readWarranties();

    // 根據電話號碼查詢（精確匹配，移除所有空格和特殊字符）
    const phoneStr = phone.trim().replace(/\s+/g, "").replace(/[-\s()]/g, "");
    const matchingWarranties = allWarranties.filter((warranty) => {
      const warrantyPhone = warranty.phone.trim().replace(/\s+/g, "").replace(/[-\s()]/g, "");
      // 精確匹配或後綴匹配（支援輸入完整號碼或部分號碼）
      return warrantyPhone === phoneStr || 
             warrantyPhone.endsWith(phoneStr) || 
             phoneStr.endsWith(warrantyPhone) ||
             warrantyPhone.includes(phoneStr) ||
             phoneStr.includes(warrantyPhone);
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
