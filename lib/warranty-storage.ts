import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 獲取 KV 客戶端（動態初始化）
async function getKVClient(): Promise<any | null> {
  // 在本地開發環境中，如果沒有配置 KV，直接返回 null
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }

  try {
    // @vercel/kv 會自動從環境變量讀取 KV_REST_API_URL 和 KV_REST_API_TOKEN
    // 使用動態導入避免在構建時出錯
    const kvModule = await import("@vercel/kv");
    return kvModule.kv;
  } catch (error: any) {
    // 如果模組不存在或導入失敗，使用文件系統存儲
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
    throw new Error("KV not configured");
  }

  try {
    const data = await kvClient.get(STORAGE_KEY);
    return data ? (Array.isArray(data) ? data : []) : [];
  } catch (error) {
    console.error("Error reading from KV:", error);
    return [];
  }
}

/**
 * 寫入保固資料到 KV 存儲
 */
async function writeToKV(warranties: WarrantyData[]): Promise<void> {
  const kvClient = await getKVClient();
  if (!kvClient) {
    throw new Error("KV not configured");
  }

  try {
    await kvClient.set(STORAGE_KEY, warranties);
  } catch (error) {
    console.error("Error writing to KV:", error);
    throw error;
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
 * 寫入所有保固資料
 * 優先使用 KV（生產環境），否則使用文件系統（本地開發）
 */
export async function writeWarranties(warranties: WarrantyData[]): Promise<void> {
  if (shouldUseKV()) {
    try {
      await writeToKV(warranties);
      // 同時寫入文件系統作為備份（如果可能）
      try {
        await writeToFile(warranties);
      } catch (fileError) {
        // 文件寫入失敗不影響主要功能（在 Vercel 上文件系統是只讀的）
        console.log("File backup write failed (expected in production)");
      }
    } catch (error) {
      console.error("Failed to write to KV:", error);
      throw error;
    }
  } else {
    await writeToFile(warranties);
  }
}

/**
 * 獲取存儲類型（用於調試）
 */
export function getStorageType(): "kv" | "file" {
  return shouldUseKV() ? "kv" : "file";
}

