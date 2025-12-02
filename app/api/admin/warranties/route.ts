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

// 獲取保固資料文件路徑
function getWarrantyFilePath() {
  // 优先使用项目目录（本地开发）
  const projectPath = join(process.cwd(), "data", "warranties.json");
  
  // 在 Vercel 上，如果项目目录不可写，使用 /tmp
  const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
  
  if (isVercel) {
    // Vercel 环境：尝试使用 /tmp 目录（可写）
    // 注意：/tmp 在每次部署后会被清理，但可以在单次部署期间使用
    return "/tmp/warranties.json";
  }
  
  return projectPath;
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

    let warranties = [];
    try {
      warranties = JSON.parse(data);
      if (!Array.isArray(warranties)) {
        warranties = [];
      }
    } catch (parseError) {
      console.error("Error parsing warranties JSON:", parseError);
      warranties = [];
    }
    
    console.log(`Loaded ${warranties.length} warranties from ${filePath}`);
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

    const filePath = getWarrantyFilePath();
    const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
    
    // 在 Vercel 上不需要创建目录（/tmp 已存在）
    // 在本地开发环境才需要创建目录
    if (!isVercel) {
      const dataDir = join(process.cwd(), "data");
      if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
      }
    }

    // 讀取現有資料
    let warranties: WarrantyData[] = [];
    if (existsSync(filePath)) {
      try {
        const content = await readFile(filePath, "utf-8");
        warranties = JSON.parse(content);
        if (!Array.isArray(warranties)) {
          warranties = [];
        }
      } catch (error) {
        console.error("Error reading warranties:", error);
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

    // 保存到文件
    try {
      await writeFile(filePath, JSON.stringify(warranties, null, 2), "utf-8");
      console.log(`Successfully saved warranty to ${filePath}. Total: ${warranties.length}`);
    } catch (writeError: any) {
      console.error("Error writing warranty file:", writeError);
      // 如果是权限错误，尝试使用 /tmp
      if (writeError.code === "EACCES" || writeError.code === "EROFS") {
        const tmpPath = "/tmp/warranties.json";
        console.log(`Retrying with /tmp path: ${tmpPath}`);
        try {
          await writeFile(tmpPath, JSON.stringify(warranties, null, 2), "utf-8");
          console.log(`Successfully saved warranty to ${tmpPath}`);
        } catch (tmpError) {
          console.error("Error writing to /tmp:", tmpError);
          throw tmpError;
        }
      } else {
        throw writeError;
      }
    }

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

    // 尝试从多个位置读取文件
    const projectPath = join(process.cwd(), "data", "warranties.json");
    const tmpPath = "/tmp/warranties.json";
    
    let filePath = projectPath;
    let content = "";
    
    // 优先尝试项目目录
    if (existsSync(projectPath)) {
      try {
        content = await readFile(projectPath, "utf-8");
        filePath = projectPath;
      } catch (error) {
        console.log("Cannot read from project path, trying /tmp");
      }
    }
    
    // 如果项目目录读取失败，尝试 /tmp
    if (!content && existsSync(tmpPath)) {
      try {
        content = await readFile(tmpPath, "utf-8");
        filePath = tmpPath;
      } catch (error) {
        console.log("Cannot read from /tmp either");
      }
    }
    
    if (!content) {
      return NextResponse.json(
        { error: "找不到保固資料" },
        { status: 404 }
      );
    }

    let warranties: WarrantyData[] = JSON.parse(content);

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

    // 保存到文件
    try {
      await writeFile(filePath, JSON.stringify(warranties, null, 2), "utf-8");
      console.log(`Successfully updated warranty in ${filePath}`);
    } catch (writeError: any) {
      console.error("Error writing warranty file:", writeError);
      // 如果是权限错误，尝试使用 /tmp
      if (writeError.code === "EACCES" || writeError.code === "EROFS") {
        const tmpPath = "/tmp/warranties.json";
        console.log(`Retrying with /tmp path: ${tmpPath}`);
        try {
          await writeFile(tmpPath, JSON.stringify(warranties, null, 2), "utf-8");
          console.log(`Successfully updated warranty to ${tmpPath}`);
        } catch (tmpError) {
          console.error("Error writing to /tmp:", tmpError);
          throw tmpError;
        }
      } else {
        throw writeError;
      }
    }

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

    // 尝试从多个位置读取文件
    const projectPath = join(process.cwd(), "data", "warranties.json");
    const tmpPath = "/tmp/warranties.json";
    
    let filePath = projectPath;
    let content = "";
    
    // 优先尝试项目目录
    if (existsSync(projectPath)) {
      try {
        content = await readFile(projectPath, "utf-8");
        filePath = projectPath;
      } catch (error) {
        console.log("Cannot read from project path, trying /tmp");
      }
    }
    
    // 如果项目目录读取失败，尝试 /tmp
    if (!content && existsSync(tmpPath)) {
      try {
        content = await readFile(tmpPath, "utf-8");
        filePath = tmpPath;
      } catch (error) {
        console.log("Cannot read from /tmp either");
      }
    }
    
    if (!content) {
      return NextResponse.json(
        { error: "找不到保固資料" },
        { status: 404 }
      );
    }

    let warranties: WarrantyData[] = JSON.parse(content);

    const filtered = warranties.filter((w) => w.id !== id);

    if (filtered.length === warranties.length) {
      return NextResponse.json(
        { error: "找不到指定的保固資料" },
        { status: 404 }
      );
    }

    // 保存到文件
    try {
      await writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
      console.log(`Successfully deleted warranty from ${filePath}. Remaining: ${filtered.length}`);
    } catch (writeError: any) {
      console.error("Error writing warranty file:", writeError);
      // 如果是权限错误，尝试使用 /tmp
      if (writeError.code === "EACCES" || writeError.code === "EROFS") {
        const tmpPath = "/tmp/warranties.json";
        console.log(`Retrying with /tmp path: ${tmpPath}`);
        try {
          await writeFile(tmpPath, JSON.stringify(filtered, null, 2), "utf-8");
          console.log(`Successfully deleted warranty to ${tmpPath}`);
        } catch (tmpError) {
          console.error("Error writing to /tmp:", tmpError);
          throw tmpError;
        }
      } else {
        throw writeError;
      }
    }

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
