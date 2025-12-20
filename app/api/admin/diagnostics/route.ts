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
  
  // 檢查多種可能的 KV 環境變量
  const hasKVRestAPI = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  const hasKVRedisURL = !!process.env.KV_REDIS_URL;
  const hasRedisURL = !!process.env.REDIS_URL;
  // Vercel 使用 KV_REDIS_URL 時，URL 中已包含認證信息，不需要單獨的 Token
  const kvConfigured = hasKVRestAPI || hasKVRedisURL || hasRedisURL;

  const diagnostics = {
    storageType: getStorageType(),
    kvConfigured: kvConfigured,
    kvUrlSet: !!process.env.KV_REST_API_URL || !!process.env.KV_REDIS_URL || !!process.env.REDIS_URL,
    // 對於 KV_REDIS_URL 格式，不需要單獨的 Token（URL 中包含認證信息）
    kvTokenSet: !!process.env.KV_REST_API_TOKEN || hasKVRedisURL || hasRedisURL,
    kvRestAPIConfigured: hasKVRestAPI,
    kvRedisURLConfigured: hasKVRedisURL,
    redisURLConfigured: hasRedisURL,
    // 顯示使用的格式
    kvFormat: hasKVRedisURL ? "KV_REDIS_URL" : hasRedisURL ? "REDIS_URL" : hasKVRestAPI ? "KV_REST_API_URL + Token" : "未配置",
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

  // 如果未配置 KV，提供详细的配置指导
  if (storageConfig.needsKV) {
    return NextResponse.json({ 
      diagnostics,
      configurationGuide: {
        step1: "在 Vercel Dashboard 中创建 KV 数据库",
        step2: "在项目设置中添加环境变量：KV_REST_API_URL 和 KV_REST_API_TOKEN",
        step3: "确保环境变量应用于 Production 环境",
        step4: "重新部署项目",
        detailedGuide: "请查看项目中的 '配置Vercel-KV.md' 文件获取详细步骤"
      }
    });
  }

  return NextResponse.json({ diagnostics });
}

