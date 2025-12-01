import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface WarrantyData {
  id: string;
  name: string;
  email: string;
  serial: string;
  date: string;
  registeredAt: string;
}

function getWarrantyFilePath() {
  return join(process.cwd(), "data", "warranties.json");
}

async function saveWarranty(data: Omit<WarrantyData, "id" | "registeredAt">) {
  const filePath = getWarrantyFilePath();
  const dataDir = join(process.cwd(), "data");

  // 確保 data 目錄存在
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }

  // 讀取現有資料
  let warranties: WarrantyData[] = [];
  if (existsSync(filePath)) {
    try {
      const content = await readFile(filePath, "utf-8");
      warranties = JSON.parse(content);
    } catch (error) {
      console.error("Error reading warranties:", error);
    }
  }

  // 添加新保固資料
  const newWarranty: WarrantyData = {
    id: `warranty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    registeredAt: new Date().toISOString(),
  };

  warranties.push(newWarranty);

  // 保存到文件
  await writeFile(filePath, JSON.stringify(warranties, null, 2), "utf-8");

  return newWarranty;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 驗證必填欄位
    if (!data.name || !data.email || !data.serial) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
        { status: 400 }
      );
    }

    // 保存保固資料
    await saveWarranty({
      name: data.name,
      email: data.email,
      serial: data.serial,
      date: data.date || "",
    });

    console.log("📩 CYS Warranty Registration:", data);

    return NextResponse.json({
      message: "保固登記成功！感謝您選擇 CYS ✨",
    });
  } catch (error) {
    console.error("Error saving warranty:", error);
    return NextResponse.json(
      { error: "登記失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
