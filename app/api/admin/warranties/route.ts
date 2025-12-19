import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readWarranties, writeWarranties, type WarrantyData } from "@/lib/warranty-storage";

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

// 計算保固結束日期
function calculateWarrantyEndDate(startDate: string, periodMonths: number): string {
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new Error("無效的開始日期");
  }
  const end = new Date(start);
  end.setMonth(end.getMonth() + periodMonths);
  // 確保日期格式為 ISO 字符串
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
    const warranties = await readWarranties();
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
    const warranties = await readWarranties();

    // 確保日期格式正確（ISO格式）
    const startDate = new Date(data.warrantyStartDate).toISOString();
    
    // 計算保固結束日期
    const warrantyEndDate = calculateWarrantyEndDate(startDate, data.warrantyPeriod);

    // 添加新保固資料
    const newWarranty: WarrantyData = {
      id: `warranty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerName: data.customerName.trim(),
      phone: data.phone.trim().replace(/\s+/g, ""), // 移除空格，統一格式
      carModel: data.carModel.trim(),
      project: data.project.trim(),
      warrantyStartDate: startDate,
      warrantyEndDate: warrantyEndDate,
      warrantyPeriod: data.warrantyPeriod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    warranties.push(newWarranty);

    // 保存資料
    await writeWarranties(warranties);
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
    const warranties = await readWarranties();

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
      const startDate = data.warrantyStartDate 
        ? new Date(data.warrantyStartDate).toISOString() 
        : updatedWarranty.warrantyStartDate;
      const period = data.warrantyPeriod || updatedWarranty.warrantyPeriod;
      updatedWarranty.warrantyEndDate = calculateWarrantyEndDate(startDate, period);
      updatedWarranty.warrantyStartDate = startDate;
    }
    
    // 更新其他欄位
    if (data.customerName) updatedWarranty.customerName = data.customerName.trim();
    if (data.phone) updatedWarranty.phone = data.phone.trim().replace(/\s+/g, "");
    if (data.carModel) updatedWarranty.carModel = data.carModel.trim();
    if (data.project) updatedWarranty.project = data.project.trim();
    if (data.warrantyPeriod) updatedWarranty.warrantyPeriod = data.warrantyPeriod;

    warranties[index] = updatedWarranty;

    // 保存資料
    await writeWarranties(warranties);
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
    const warranties = await readWarranties();
    const filtered = warranties.filter((w) => w.id !== id);

    if (filtered.length === warranties.length) {
      return NextResponse.json(
        { error: "找不到指定的保固資料" },
        { status: 404 }
      );
    }

    // 保存資料
    await writeWarranties(filtered);
    console.log(`Successfully deleted warranty ${id}. Remaining: ${filtered.length}`);

    // 驗證刪除是否成功
    const verifyWarranties = await readWarranties();
    const stillExists = verifyWarranties.some((w) => w.id === id);
    
    if (stillExists) {
      console.error(`Warning: Warranty ${id} still exists after deletion attempt`);
      return NextResponse.json(
        { error: "刪除失敗，資料仍存在" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `已成功刪除保固資料，剩餘 ${filtered.length} 筆`
    });
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
