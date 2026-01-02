import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 嘗試使用 redis 包作為備選方案
let redisClient: any = null;

// 獲取 KV 客戶端（動態初始化）
async function getKVClient(): Promise<any | null> {
  // 檢查多種可能的環境變量名稱
  // Vercel 使用 KV_REDIS_URL 時，URL 中已包含認證信息
  const hasKVConfig = !!(
    process.env.KV_REDIS_URL ||
    process.env.REDIS_URL ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );

  if (!hasKVConfig) {
    console.log("KV environment variables not set, will use file system storage");
    return null;
  }
  
  console.log("KV configuration found:", {
    hasKVRedisURL: !!process.env.KV_REDIS_URL,
    hasRedisURL: !!process.env.REDIS_URL,
    hasKVRestAPI: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  });

  try {
    // 優先嘗試使用 @vercel/kv（如果環境變量完整）
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const kvModule = await import("@vercel/kv");
      const kv = kvModule.kv;
      if (kv) {
        console.log("KV client initialized with KV_REST_API_URL and KV_REST_API_TOKEN");
        return kv;
      }
    }
    
    // 如果有 KV_REDIS_URL，檢查格式並選擇合適的客戶端
    if (process.env.KV_REDIS_URL) {
      const redisUrl = process.env.KV_REDIS_URL;
      console.log("Found KV_REDIS_URL, format:", redisUrl.startsWith('redis://') ? 'redis://' : 'https://');
      
      // 如果是 redis:// 格式，使用 redis 包
      if (redisUrl.startsWith('redis://')) {
        try {
          const redisModule = await import("redis");
          const client = redisModule.createClient({
            url: redisUrl,
          });
          
          if (!client.isOpen) {
            await client.connect();
          }
          
          console.log("Redis client initialized successfully with KV_REDIS_URL (redis://)");
          return client;
        } catch (redisError: any) {
          console.error("Failed to initialize redis client:", redisError);
          // 繼續嘗試其他方法
        }
      }
      // 如果是 https:// 格式（REST API），嘗試使用 @vercel/kv
      else if (redisUrl.startsWith('https://')) {
        // Vercel KV REST API URL，嘗試直接使用
        // 對於 Upstash REST API，URL 格式通常是: https://xxx.upstash.io
        // 但 @vercel/kv 需要 KV_REST_API_URL 和 KV_REST_API_TOKEN
        // 如果 KV_REDIS_URL 是完整的 REST API URL，可能需要從 URL 中提取信息
        console.log("KV_REDIS_URL is REST API format, attempting to use @vercel/kv");
        
        // 嘗試設置為 KV_REST_API_URL（如果還沒有設置）
        if (!process.env.KV_REST_API_URL) {
          process.env.KV_REST_API_URL = redisUrl;
          console.log("Set KV_REST_API_URL from KV_REDIS_URL");
        }
        
        // 嘗試使用 @vercel/kv（它會從環境變量讀取）
        try {
          const kvModule = await import("@vercel/kv");
          const kv = kvModule.kv;
          if (kv) {
            console.log("KV client initialized with KV_REDIS_URL (https://) via @vercel/kv");
            return kv;
          }
        } catch (kvError: any) {
          console.error("Failed to initialize @vercel/kv with KV_REDIS_URL:", kvError);
          // 如果 @vercel/kv 需要 Token，但我們沒有，可能需要使用 HTTP 請求
        }
      }
    }
    
    // 最後嘗試 @vercel/kv（可能環境變量會在運行時設置）
    const kvModule = await import("@vercel/kv");
    const kv = kvModule.kv;
    
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
 * 支持多種環境變量格式：
 * 1. KV_REDIS_URL (Vercel 自動提供的格式，URL 包含認證信息)
 * 2. REDIS_URL (通用格式)
 * 3. KV_REST_API_URL + KV_REST_API_TOKEN (舊格式，需要兩個變量)
 */
function shouldUseKV(): boolean {
  // Vercel 使用 KV_REDIS_URL 時，URL 中已包含認證信息，不需要單獨的 Token
  return !!(
    process.env.KV_REDIS_URL ||
    process.env.REDIS_URL ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}

/**
 * 使用 HTTP REST API 直接讀取（備選方案）
 */
async function readFromKVRestAPI(): Promise<WarrantyData[]> {
  const url = process.env.KV_REST_API_URL || process.env.KV_REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error("KV REST API requires KV_REST_API_URL and KV_REST_API_TOKEN");
  }
  
  try {
    // Upstash REST API 格式
    const response = await fetch(`${url}/get/${STORAGE_KEY}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`KV REST API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const data = result.result; // Upstash 返回格式: { result: ... }
    
    if (!data) {
      console.log("No data found in KV via REST API, returning empty array");
      return [];
    }
    
    const warranties = Array.isArray(data) ? data : [];
    console.log(`Successfully read ${warranties.length} warranties from KV via REST API`);
    return warranties;
  } catch (error: any) {
    console.error("Error reading from KV REST API:", error);
    throw error;
  }
}

/**
 * 從 KV 存儲讀取保固資料
 */
async function readFromKV(): Promise<WarrantyData[]> {
  const kvClient = await getKVClient();
  if (!kvClient) {
    // 如果客戶端初始化失敗，但環境變量存在，嘗試使用 REST API
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      console.log("KV client not available, trying REST API fallback");
      return await readFromKVRestAPI();
    }
    
    throw new Error(
      "KV not configured. Please set one of:\n" +
      "- KV_REDIS_URL (Vercel format)\n" +
      "- REDIS_URL (generic format)\n" +
      "- KV_REST_API_URL + KV_REST_API_TOKEN (legacy format)"
    );
  }

  try {
    // 檢查客戶端類型並使用正確的方法
    let data: any;
    
    // redis 包使用小寫方法
    if (typeof kvClient.get === 'function') {
      data = await kvClient.get(STORAGE_KEY);
    } else if (typeof kvClient.GET === 'function') {
      // 某些 redis 客戶端使用大寫方法
      data = await kvClient.GET(STORAGE_KEY);
    } else {
      throw new Error("KV client does not support get method");
    }
    
    if (!data) {
      console.log("No data found in KV, returning empty array");
      return [];
    }
    
    // redis 返回的數據可能是字符串，需要解析
    let warranties: WarrantyData[];
    if (typeof data === 'string') {
      try {
        warranties = JSON.parse(data);
      } catch (parseError) {
        console.error("Failed to parse data from KV:", parseError);
        return [];
      }
    } else {
      warranties = Array.isArray(data) ? data : [];
    }
    
    console.log(`Successfully read ${warranties.length} warranties from KV`);
    return warranties;
  } catch (error: any) {
    console.error("Error reading from KV:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      clientType: typeof kvClient,
      hasGet: typeof kvClient?.get === 'function',
      hasGET: typeof kvClient?.GET === 'function',
      isOpen: kvClient?.isOpen,
      isReady: kvClient?.isReady
    });
    
    // 如果客戶端讀取失敗，但環境變量存在，嘗試使用 REST API
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      console.log("KV client read failed, trying REST API fallback");
      try {
        return await readFromKVRestAPI();
      } catch (restError) {
        console.error("REST API fallback also failed:", restError);
      }
    }
    
    // 讀取失敗時返回空數組，而不是拋出錯誤
    return [];
  }
}

/**
 * 使用 HTTP REST API 直接寫入（備選方案）
 */
async function writeToKVRestAPI(warranties: WarrantyData[]): Promise<void> {
  const url = process.env.KV_REST_API_URL || process.env.KV_REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error("KV REST API requires KV_REST_API_URL and KV_REST_API_TOKEN");
  }
  
  try {
    // 確保數據是有效的 JSON
    const serialized = JSON.parse(JSON.stringify(warranties));
    
    // Upstash REST API 格式
    const response = await fetch(`${url}/set/${STORAGE_KEY}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serialized),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`KV REST API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`Successfully wrote ${warranties.length} warranties to KV via REST API`);
    
    // 驗證寫入
    const verify = await readFromKVRestAPI();
    if (verify.length !== warranties.length) {
      throw new Error(`KV write verification failed: expected ${warranties.length}, got ${verify.length}`);
    }
  } catch (error: any) {
    console.error("Error writing to KV REST API:", error);
    throw error;
  }
}

/**
 * 寫入保固資料到 KV 存儲
 */
async function writeToKV(warranties: WarrantyData[]): Promise<void> {
  const kvClient = await getKVClient();
  
  // 如果客戶端初始化失敗，但環境變量存在，嘗試使用 REST API
  if (!kvClient) {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      console.log("KV client not available, trying REST API fallback for write");
      return await writeToKVRestAPI(warranties);
    }
    
    const hasKVRedisURL = !!process.env.KV_REDIS_URL;
    const hasRedisURL = !!process.env.REDIS_URL;
    const hasKVRestAPI = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    
    if (hasKVRedisURL || hasRedisURL || hasKVRestAPI) {
      throw new Error("KV client initialization failed - check KV configuration and logs");
    } else {
      throw new Error(
        "KV not configured. Please set one of:\n" +
        "- KV_REDIS_URL (Vercel format, recommended)\n" +
        "- REDIS_URL (generic format)\n" +
        "- KV_REST_API_URL + KV_REST_API_TOKEN (legacy format)"
      );
    }
  }

  try {
    // 確保數據是有效的 JSON 字符串（redis 需要字符串）
    const serialized = JSON.stringify(warranties);
    
    console.log(`Attempting to write ${warranties.length} warranties to KV`);
    console.log(`KV client type: ${typeof kvClient}, has set: ${typeof kvClient.set === 'function'}, has SET: ${typeof kvClient.SET === 'function'}`);
    
    // 檢查是 redis 客戶端還是 @vercel/kv 客戶端
    // redis 包需要將數據序列化為字符串
    if (typeof kvClient.set === 'function') {
      // @vercel/kv 或 redis 客戶端（小寫方法）
      // 對於 redis 包，需要將對象序列化為字符串
      await kvClient.set(STORAGE_KEY, serialized);
      console.log("KV set operation completed");
    } else if (typeof kvClient.SET === 'function') {
      // 某些 redis 客戶端使用大寫方法
      await kvClient.SET(STORAGE_KEY, serialized);
      console.log("KV SET operation completed");
    } else {
      throw new Error(`KV client does not support set method. Client type: ${typeof kvClient}`);
    }
    
    // 驗證寫入是否成功
    let verify: any;
    if (typeof kvClient.get === 'function') {
      verify = await kvClient.get(STORAGE_KEY);
    } else if (typeof kvClient.GET === 'function') {
      verify = await kvClient.GET(STORAGE_KEY);
    } else {
      throw new Error(`KV client does not support get method. Client type: ${typeof kvClient}`);
    }
    
    // redis 返回字符串，需要解析
    let verifyData: WarrantyData[];
    if (typeof verify === 'string') {
      try {
        verifyData = JSON.parse(verify);
      } catch (parseError) {
        throw new Error(`KV write verification failed - could not parse saved data`);
      }
    } else {
      verifyData = Array.isArray(verify) ? verify : [];
    }
    
    if (!verifyData || !Array.isArray(verifyData) || verifyData.length !== warranties.length) {
      throw new Error(`KV write verification failed - expected ${warranties.length}, got ${verifyData?.length || 0}`);
    }
    
    console.log(`Successfully wrote ${warranties.length} warranties to KV (verified: ${verifyData.length})`);
  } catch (error: any) {
    console.error("Error writing to KV:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
      clientType: typeof kvClient,
      hasSet: typeof kvClient?.set === 'function',
      hasGet: typeof kvClient?.get === 'function'
    });
    
    // 如果客戶端寫入失敗，但環境變量存在，嘗試使用 REST API
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      console.log("KV client write failed, trying REST API fallback");
      try {
        return await writeToKVRestAPI(warranties);
      } catch (restError: any) {
        console.error("REST API fallback also failed:", restError);
        // 繼續使用原始錯誤
      }
    }
    
    // 提供更詳細的錯誤信息
    let errorMsg = `KV write failed: ${error?.message || String(error)}`;
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('connect')) {
      errorMsg = "無法連接到 KV 服務，請檢查連接配置";
    } else if (error?.code === '401' || error?.message?.includes('Unauthorized') || error?.message?.includes('TOKEN')) {
      errorMsg = "KV 認證失敗。如果使用 KV_REDIS_URL，請確保 URL 中包含完整的認證信息，或設置 KV_REST_API_TOKEN";
    } else if (error?.message?.includes('Missing')) {
      errorMsg = "KV 配置不完整。請在 Vercel Dashboard 中檢查環境變量設置";
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

