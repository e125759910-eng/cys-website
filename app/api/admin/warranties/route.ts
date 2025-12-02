import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile, mkdir } from "fs/promises";
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
  warrantyPeriod: number; // 保固期限（月）
  createdAt?: string;
  updatedAt?: string;
}

// 驗證管理員身份
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  if (!token) {
    return false;
  }

  try {
    const decoded = Buffer.from(token.value, "base64").toString("utf-8");
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    return decoded.startsWith(`${adminUsername}:`);
  } catch {
    return false;
  }
}

// 獲取保固資料文件路徑（統一使用 /tmp，在 Vercel 上可寫）
function getWarrantyFilePath() {
  // 在 Vercel 上，文件系統是只讀的，必須使用 /tmp
  // 在本地開發，也使用 /tmp 以保持一致性
  return "/tmp/warranties.json";
}

// 獲取備用文件路徑（項目目錄，用於讀取現有數據）
function getBackupFilePath() {
  return join(process.cwd(), "data", "warranties.json");
}

// 統一的文件讀取函數
async function readWarrantiesFile(): Promise<{ data: string; path: string } | null> {
  const primaryPath = getWarrantyFilePath();
  const backupPath = getBackupFilePath();
  
  // 優先讀取主路徑（/tmp）
  if (existsSync(primaryPath)) {
    try {
      const data = await readFile(primaryPath, "utf-8");
      return { data, path: primaryPath };
    } catch (error) {
      console.log(`Cannot read from ${primaryPath}, trying backup`);
    }
  }
  
  // 如果主路徑不存在，嘗試備用路徑（項目目錄）
  if (existsSync(backupPath)) {
    try {
      const data = await readFile(backupPath, "utf-8");
      return { data, path: backupPath };
    } catch (error) {
      console.log(`Cannot read from ${backupPath}`);
    }
  }
  
  return null;
}

// 統一的文件寫入函數
async function writeWarrantiesFile(content: string): Promise<void> {
  const filePath = getWarrantyFilePath();
  
  // 如果 /tmp 文件不存在，但備用文件存在，先合併數據
  if (!existsSync(filePath)) {
    const backupPath = getBackupFilePath();
    if (existsSync(backupPath)) {
      try {
        const backupData = await readFile(backupPath, "utf-8");
        const backupWarranties = JSON.parse(backupData);
        const newWarranties = JSON.parse(content);
        
        // 合併數據（避免重複）
        const merged = [...backupWarranties];
        const newIds = new Set(newWarranties.map((w: WarrantyData) => w.id));
        merged.forEach((w: WarrantyData) => {
          if (!newIds.has(w.id)) {
            newWarranties.push(w);
          }
        });
        
        content = JSON.stringify(newWarranties, null, 2);
        console.log(`Merged data from backup file. Total: ${newWarranties.length}`);
      } catch (error) {
        console.log("Could not merge backup data, using new data only");
      }
    }
  }
  
  try {
    await writeFile(filePath, content, "utf-8");
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error: any) {
    console.error(`Error writing to ${filePath}:`, error);
    // 如果 /tmp 寫入失敗，嘗試項目目錄（僅本地開發）
    if (error.code === "EACCES" || error.code === "EROFS" || error.code === "ENOENT") {
      const backupPath = getBackupFilePath();
      const backupDir = join(process.cwd(), "data");
      try {
        if (!existsSync(backupDir)) {
          await mkdir(backupDir, { recursive: true });
        }
        await writeFile(backupPath, content, "utf-8");
        console.log(`Successfully wrote to backup path ${backupPath}`);
      } catch (backupError) {
        console.error(`Error writing to backup path:`, backupError);
        throw new Error(`無法寫入文件: ${error.message}`);
      }
    } else {
      throw error;
    }
  }
}

// 計算保固結束日期
function calculateWarrantyEndDate(startDate: string, periodMonths: number): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + periodMonths);
  return end.toISOString();
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
    const fileResult = await readWarrantiesFile();
    
    if (!fileResult) {
      return NextResponse.json({ warranties: [] });
    }

    let warranties = [];
    try {
      warranties = JSON.parse(fileResult.data);
      if (!Array.isArray(warranties)) {
        warranties = [];
      }
    } catch (parseError) {
      console.error("Error parsing warranties JSON:", parseError);
      warranties = [];
    }
    
    console.log(`Loaded ${warranties.length} warranties from ${fileResult.path}`);
    return NextResponse.json({ warranties });
  } catch (error) {
    console.error("Error reading warranties:", error);
    return NextResponse.json(
      { error: "讀取資料失敗" },
      { status: 500 }
    );
  }
}

// POST: 新增保固資料
export async function POST(request: Request) {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "未授權" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    
    // 驗證必填欄位
    if (!data.customerName || !data.phone || !data.carModel || !data.project || !data.warrantyStartDate || !data.warrantyPeriod) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
        { status: 400 }
      );
    }

    // 讀取現有資料
    let warranties: WarrantyData[] = [];
    const fileResult = await readWarrantiesFile();
    
    if (fileResult) {
      try {
        warranties = JSON.parse(fileResult.data);
        if (!Array.isArray(warranties)) {
          warranties = [];
        }
      } catch (error) {
        console.error("Error parsing warranties:", error);
        warranties = [];
      }
    }

    // 計算保固結束日期
    const warrantyEndDate = calculateWarrantyEndDate(data.warrantyStartDate, data.warrantyPeriod);

    // 添加新保固資料
    const newWarranty: WarrantyData = {
      id: `warranty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerName: data.customerName,
      phone: data.phone,
      carModel: data.carModel,
      project: data.project,
      warrantyStartDate: data.warrantyStartDate,
      warrantyEndDate: warrantyEndDate,
      warrantyPeriod: data.warrantyPeriod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    warranties.push(newWarranty);

    // 保存到文件（使用統一的寫入函數）
    await writeWarrantiesFile(JSON.stringify(warranties, null, 2));
    console.log(`Successfully saved warranty. Total: ${warranties.length}`);

    return NextResponse.json({ 
      success: true, 
      warranty: newWarranty 
    });
  } catch (error) {
    console.error("Error saving warranty:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { 
        error: "新增失敗，請稍後再試",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// PUT: 更新保固資料
export async function PUT(request: Request) {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "未授權" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "缺少保固 ID" },
        { status: 400 }
      );
    }

    // 讀取現有資料
    const fileResult = await readWarrantiesFile();
    
    if (!fileResult) {
      return NextResponse.json(
        { error: "找不到保固資料" },
        { status: 404 }
      );
    }

    let warranties: WarrantyData[] = JSON.parse(fileResult.data);

    const index = warranties.findIndex((w) => w.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "找不到指定的保固資料" },
        { status: 404 }
      );
    }

    // 更新資料
    const updatedWarranty = {
      ...warranties[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // 如果更新了開始日期或期限，重新計算結束日期
    if (data.warrantyStartDate || data.warrantyPeriod) {
      const startDate = data.warrantyStartDate || updatedWarranty.warrantyStartDate;
      const period = data.warrantyPeriod || updatedWarranty.warrantyPeriod;
      updatedWarranty.warrantyEndDate = calculateWarrantyEndDate(startDate, period);
    }

    warranties[index] = updatedWarranty;

    // 保存到文件（使用統一的寫入函數）
    await writeWarrantiesFile(JSON.stringify(warranties, null, 2));
    console.log(`Successfully updated warranty`);

    return NextResponse.json({ 
      success: true, 
      warranty: updatedWarranty 
    });
  } catch (error) {
    console.error("Error updating warranty:", error);
    return NextResponse.json(
      { error: "更新失敗，請稍後再試" },
      { status: 500 }
    );
  }
}

// DELETE: 刪除保固資料
export async function DELETE(request: Request) {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "未授權" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "缺少保固 ID" },
        { status: 400 }
      );
    }

    // 讀取現有資料
    const fileResult = await readWarrantiesFile();
    
    if (!fileResult) {
      return NextResponse.json(
        { error: "找不到保固資料" },
        { status: 404 }
      );
    }

    let warranties: WarrantyData[] = JSON.parse(fileResult.data);
    const filtered = warranties.filter((w) => w.id !== id);

    if (filtered.length === warranties.length) {
      return NextResponse.json(
        { error: "找不到指定的保固資料" },
        { status: 404 }
      );
    }

    // 保存到文件（使用統一的寫入函數）
    await writeWarrantiesFile(JSON.stringify(filtered, null, 2));
    console.log(`Successfully deleted warranty. Remaining: ${filtered.length}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting warranty:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { 
        error: "刪除失敗，請稍後再試",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
