import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStorageType, checkStorageConfiguration } from "@/lib/warranty-storage";

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

// GET: 獲取系統診斷信息
export async function GET() {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "未授權" },
      { status: 401 }
    );
  }

  const storageConfig = checkStorageConfiguration();
  
  const diagnostics = {
    storageType: getStorageType(),
    kvConfigured: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
    kvUrlSet: !!process.env.KV_REST_API_URL,
    kvTokenSet: !!process.env.KV_REST_API_TOKEN,
    adminUsernameSet: !!process.env.ADMIN_USERNAME,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    isVercel: storageConfig.isVercel,
    needsKV: storageConfig.needsKV,
    isConfigured: storageConfig.isConfigured,
    message: storageConfig.message,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ diagnostics });
}

