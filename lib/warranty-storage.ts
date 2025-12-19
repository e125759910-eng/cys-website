import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 獲取 KV 客戶端（動態初始化）
async function getKVClient(): Promise<any | null> {
  // 在本地開發環境中，如果沒有配置 KV，直接返回 null
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.log("KV environment variables not set, will use file system storage");
    return null;
  }

  try {
    // @vercel/kv 會自動從環境變量讀取 KV_REST_API_URL 和 KV_REST_API_TOKEN
    // 使用動態導入避免在構建時出錯
    const kvModule = await import("@vercel/kv");
    const kv = kvModule.kv;
    
    // 測試連接
    if (kv) {
      console.log("KV client initialized successfully");
      return kv;
    } else {
      console.error("KV client is null after import");
      return null;
    }
  } catch (error: any) {
    // 如果模組不存在或導入失敗，使用文件系統存儲
    console.error("Failed to import @vercel/kv:", error);
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot resolve')) {
      console.log("Vercel KV module not found, using file system storage");
    } else {
      console.log("Vercel KV not available, using file system storage:", error.message);
    }
    return null;
  }
}

export interface WarrantyData {
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

const STORAGE_KEY = "warranties";
const FILE_PATH = join(process.cwd(), "data", "warranties.json");

/**
 * 判斷是否使用 Vercel KV 存儲
 */
function shouldUseKV(): boolean {
  return process.env.KV_REST_API_URL !== undefined &&
         process.env.KV_REST_API_TOKEN !== undefined;
}

/**
 * 從 KV 存儲讀取保固資料
 */
async function readFromKV(): Promise<WarrantyData[]> {
  const kvClient = await getKVClient();
  if (!kvClient) {
    throw new Error("KV not configured - KV_REST_API_URL and KV_REST_API_TOKEN must be set");
  }

  try {
    const data = await kvClient.get(STORAGE_KEY);
    if (!data) {
      console.log("No data found in KV, returning empty array");
      return [];
    }
    const warranties = Array.isArray(data) ? data : [];
    console.log(`Successfully read ${warranties.length} warranties from KV`);
    return warranties;
  } catch (error: any) {
    console.error("Error reading from KV:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code
    });
    // 讀取失敗時返回空數組，而不是拋出錯誤
    return [];
  }
}

/**
 * 寫入保固資料到 KV 存儲
 */
async function writeToKV(warranties: WarrantyData[]): Promise<void> {
  const kvClient = await getKVClient();
  if (!kvClient) {
    const hasEnvVars = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    if (hasEnvVars) {
      throw new Error("KV client initialization failed - check KV configuration");
    } else {
      throw new Error("KV not configured - KV_REST_API_URL and KV_REST_API_TOKEN must be set in environment variables");
    }
  }

  try {
    // 確保數據是有效的 JSON
    const serialized = JSON.parse(JSON.stringify(warranties));
    
    // 使用 set 方法寫入數據
    await kvClient.set(STORAGE_KEY, serialized);
    
    // 驗證寫入是否成功
    const verify = await kvClient.get(STORAGE_KEY);
    if (!verify || !Array.isArray(verify)) {
      throw new Error("KV write verification failed - data not saved correctly");
    }
    
    console.log(`Successfully wrote ${warranties.length} warranties to KV (verified: ${verify.length})`);
  } catch (error: any) {
    console.error("Error writing to KV:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 500)
    });
    
    // 提供更詳細的錯誤信息
    let errorMsg = `KV write failed: ${error?.message || String(error)}`;
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('connect')) {
      errorMsg = "無法連接到 KV 服務，請檢查 KV_REST_API_URL 是否正確";
    } else if (error?.code === '401' || error?.message?.includes('Unauthorized')) {
      errorMsg = "KV 認證失敗，請檢查 KV_REST_API_TOKEN 是否正確";
    }
    
    throw new Error(errorMsg);
  }
}

/**
 * 從文件系統讀取保固資料
 */
async function readFromFile(): Promise<WarrantyData[]> {
  try {
    if (existsSync(FILE_PATH)) {
      const data = await readFile(FILE_PATH, "utf-8");
      const warranties = JSON.parse(data);
      return Array.isArray(warranties) ? warranties : [];
    }
  } catch (error) {
    console.error("Error reading from file:", error);
  }
  return [];
}

/**
 * 寫入保固資料到文件系統
 */
async function writeToFile(warranties: WarrantyData[]): Promise<void> {
  try {
    const dataDir = join(process.cwd(), "data");
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    await writeFile(FILE_PATH, JSON.stringify(warranties, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to file:", error);
    throw error;
  }
}

/**
 * 讀取所有保固資料
 * 優先使用 KV（生產環境），否則使用文件系統（本地開發）
 */
export async function readWarranties(): Promise<WarrantyData[]> {
  if (shouldUseKV()) {
    try {
      return await readFromKV();
    } catch (error) {
      console.warn("Failed to read from KV, falling back to file system:", error);
      return await readFromFile();
    }
  } else {
    return await readFromFile();
  }
}

/**
 * 檢查是否在 Vercel 環境
 */
function isVercelEnvironment(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_URL
  );
}

/**
 * 寫入所有保固資料
 * 優先使用 KV（生產環境），否則使用文件系統（本地開發）
 */
export async function writeWarranties(warranties: WarrantyData[]): Promise<void> {
  // 驗證數據格式
  if (!Array.isArray(warranties)) {
    throw new Error("Warranties must be an array");
  }

  // 在 Vercel 環境中，必須使用 KV
  if (isVercelEnvironment() && !shouldUseKV()) {
    throw new Error(
      "在 Vercel 環境中必須配置 Vercel KV。請在 Vercel Dashboard 中設置 KV_REST_API_URL 和 KV_REST_API_TOKEN 環境變量。\n\n" +
      "設置步驟：\n" +
      "1. 在 Vercel Dashboard 中創建 KV 數據庫\n" +
      "2. 在項目設置中添加環境變量：\n" +
      "   - KV_REST_API_URL\n" +
      "   - KV_REST_API_TOKEN\n" +
      "3. 重新部署項目"
    );
  }

  if (shouldUseKV()) {
    try {
      await writeToKV(warranties);
      // 同時寫入文件系統作為備份（如果可能，僅本地開發）
      if (!isVercelEnvironment()) {
        try {
          await writeToFile(warranties);
        } catch (fileError) {
          // 文件寫入失敗不影響主要功能
          console.log("File backup write failed");
        }
      }
    } catch (error: any) {
      console.error("Failed to write to KV:", error);
      const errorMessage = error?.message || String(error);
      throw new Error(`Failed to save warranties to KV: ${errorMessage}`);
    }
  } else {
    // 僅在本地開發環境使用文件系統
    try {
      await writeToFile(warranties);
      console.log(`Successfully wrote ${warranties.length} warranties to file`);
    } catch (error: any) {
      console.error("Failed to write to file:", error);
      // 如果是只讀文件系統錯誤，提供明確提示
      if (error?.code === 'EROFS' || error?.message?.includes('read only')) {
        throw new Error(
          "文件系統是只讀的。在 Vercel 環境中必須使用 Vercel KV 存儲。\n\n" +
          "請在 Vercel Dashboard 中配置 KV 環境變量並重新部署。"
        );
      }
      throw new Error(`Failed to save warranties to file: ${error?.message || String(error)}`);
    }
  }
}

/**
 * 獲取存儲類型（用於調試）
 */
export function getStorageType(): "kv" | "file" {
  return shouldUseKV() ? "kv" : "file";
}

/**
 * 檢查存儲配置是否正確
 */
export function checkStorageConfiguration(): {
  isConfigured: boolean;
  isVercel: boolean;
  needsKV: boolean;
  message: string;
} {
  const isVercel = isVercelEnvironment();
  const hasKV = shouldUseKV();
  const needsKV = isVercel && !hasKV;

  let message = "";
  if (needsKV) {
    message = "在 Vercel 環境中必須配置 Vercel KV。請設置 KV_REST_API_URL 和 KV_REST_API_TOKEN 環境變量。";
  } else if (hasKV) {
    message = "KV 存儲已正確配置。";
  } else {
    message = "使用文件系統存儲（僅本地開發）。";
  }

  return {
    isConfigured: !needsKV,
    isVercel,
    needsKV,
    message,
  };
}

