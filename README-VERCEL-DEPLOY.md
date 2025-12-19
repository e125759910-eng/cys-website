# Vercel 部署指南

本指南將幫助您將 CYS 網站部署到 Vercel，並確保保固功能正常運作。

## 📋 前置準備

1. **GitHub 帳號**（推薦）或 GitLab/Bitbucket
2. **Vercel 帳號**（可在 https://vercel.com 免費註冊）
3. 將您的代碼推送到 Git 倉庫

## 🚀 部署步驟

### 步驟 1: 準備 Vercel KV 數據庫

保固功能需要持久化存儲。在 Vercel 上，我們使用 Vercel KV（基於 Redis）來存儲數據。

1. **登入 Vercel Dashboard**
   - 前往 https://vercel.com/dashboard

2. **創建 KV 數據庫**
   - 點擊您的項目或創建新項目
   - 在項目設置中，找到 "Storage" 或 "KV" 選項
   - 點擊 "Create Database" 並選擇 "KV"
   - 為數據庫命名（例如：`cys-warranties`）
   - 選擇區域（推薦選擇靠近您用戶的區域）
   - 點擊 "Create"

3. **獲取連接信息**
   - KV 創建完成後，Vercel 會自動創建環境變量
   - 記錄以下環境變量名稱：
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

### 步驟 2: 部署到 Vercel

#### 方法 A: 通過 Vercel Dashboard（推薦）

1. **導入項目**
   - 登入 https://vercel.com
   - 點擊 "Add New..." → "Project"
   - 選擇您的 Git 倉庫（GitHub/GitLab/Bitbucket）
   - 如果還沒有連接，先連接您的 Git 帳號

2. **配置項目**
   - **Framework Preset**: Next.js（應自動檢測）
   - **Root Directory**: `./`（如果不是根目錄，請調整）
   - **Build Command**: `npm run build`（預設值）
   - **Output Directory**: `.next`（預設值）

3. **設置環境變量**
   在 "Environment Variables" 區塊添加以下變量：

   ```
   KV_REST_API_URL = <從 Vercel KV 獲取的 URL>
   KV_REST_API_TOKEN = <從 Vercel KV 獲取的 Token>
   ADMIN_USERNAME = <您的管理員帳號，例如：admin>
   ADMIN_PASSWORD = <您的管理員密碼>
   ```

   **注意**：
   - 如果已創建 KV 數據庫，`KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 可能已自動添加
   - 環境變量可以在部署後隨時修改
   - `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 用於後台登入

4. **部署**
   - 點擊 "Deploy" 按鈕
   - 等待構建完成（通常需要 1-3 分鐘）

#### 方法 B: 通過 Vercel CLI

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **安裝依賴**
   ```bash
   npm install
   ```

4. **部署**
   ```bash
   vercel
   ```

   首次部署時，CLI 會詢問：
   - Set up and deploy? **Yes**
   - Which scope? 選擇您的帳號
   - Link to existing project? **No**（首次）
   - Project name? 輸入項目名稱（例如：cys-website）
   - Directory? **./**（預設）
   - Override settings? **No**

5. **設置環境變量**
   ```bash
   vercel env add KV_REST_API_URL
   vercel env add KV_REST_API_TOKEN
   vercel env add ADMIN_USERNAME
   vercel env add ADMIN_PASSWORD
   ```

6. **重新部署以應用環境變量**
   ```bash
   vercel --prod
   ```

### 步驟 3: 驗證部署

1. **訪問網站**
   - 部署完成後，Vercel 會提供一個 URL（例如：`https://cys-website.vercel.app`）
   - 訪問該 URL 確認網站正常運作

2. **測試保固功能**
   - 訪問 `/admin/login` 頁面登入後台
   - 新增一筆保固資料
   - 訪問 `/warranty` 頁面，使用電話號碼查詢保固
   - 確認資料可以正常新增、查詢、編輯和刪除

3. **檢查日誌**
   - 在 Vercel Dashboard 的 "Functions" 或 "Logs" 標籤查看日誌
   - 確認沒有錯誤訊息

## 🔧 環境變量說明

| 變量名稱 | 說明 | 是否必需 | 預設值 |
|---------|------|---------|--------|
| `KV_REST_API_URL` | Vercel KV 的 REST API URL | ✅ 是 | - |
| `KV_REST_API_TOKEN` | Vercel KV 的 REST API Token | ✅ 是 | - |
| `ADMIN_USERNAME` | 後台管理員帳號 | ❌ 否 | `admin` |
| `ADMIN_PASSWORD` | 後台管理員密碼 | ✅ 是 | - |

**注意**：如果 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 未設置，系統會回退到文件系統存儲（在 Vercel 上無法持久化）。

## 🌐 自訂域名（選用）

1. **在 Vercel Dashboard 中添加域名**
   - 進入項目設置 → "Domains"
   - 輸入您的域名（例如：`www.example.com`）
   - 按照提示配置 DNS 記錄

2. **配置 DNS**
   - 添加 CNAME 記錄指向 Vercel 提供的地址
   - 或添加 A 記錄（根據 Vercel 的指示）

3. **SSL 證書**
   - Vercel 會自動為您的域名配置 SSL 證書
   - 通常需要幾分鐘到幾小時生效

## 🔄 更新部署

當您推送代碼到 Git 倉庫時，Vercel 會自動重新部署。您也可以：

1. **手動觸發部署**
   - 在 Vercel Dashboard 中點擊 "Redeploy"

2. **通過 CLI**
   ```bash
   vercel --prod
   ```

## 📝 本地開發

本地開發時，系統會自動使用文件系統存儲（`data/warranties.json`）。無需配置 KV 環境變量。

如需在本地測試 KV 存儲，可以創建 `.env.local` 文件：

```env
KV_REST_API_URL=https://your-kv-url.vercel-storage.com
KV_REST_API_TOKEN=your-token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

## ⚠️ 常見問題

### 1. 保固資料無法保存

**原因**：KV 環境變量未正確配置

**解決方法**：
- 確認 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 已設置
- 檢查 Vercel KV 數據庫是否已創建
- 查看 Vercel 函數日誌以獲取詳細錯誤信息

### 2. 後台無法登入

**原因**：環境變量未設置或設置錯誤

**解決方法**：
- 確認 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 已設置
- 清除瀏覽器 Cookie 後重試

### 3. 部署失敗

**原因**：構建錯誤或依賴問題

**解決方法**：
- 檢查構建日誌中的錯誤信息
- 確認 `package.json` 中的依賴已正確安裝
- 嘗試在本地運行 `npm run build` 檢查是否有錯誤

### 4. 資料丟失

**原因**：KV 數據庫被刪除或重置

**解決方法**：
- 檢查 Vercel KV 數據庫是否還存在
- 確認環境變量是否正確
- 考慮定期備份數據（可導出 KV 數據）

## 💡 數據備份建議

雖然 Vercel KV 提供持久化存儲，但建議定期備份保固資料：

1. **通過後台導出**
   - 在後台管理頁面添加數據導出功能（可選）

2. **通過 API 導出**
   - 使用管理員帳號訪問 API 獲取所有資料
   - 保存為 JSON 文件

3. **使用 Vercel KV Dashboard**
   - 在 Vercel Dashboard 中查看和管理 KV 數據

## 📞 需要幫助？

如果遇到問題，可以：
1. 查看 Vercel 文檔：https://vercel.com/docs
2. 查看 Vercel KV 文檔：https://vercel.com/docs/storage/vercel-kv
3. 檢查項目日誌和錯誤信息

---

**部署完成後，您的網站將可以：**
- ✅ 永久保存保固資料（直到手動刪除）
- ✅ 在 Vercel 上正常運作
- ✅ 自動 HTTPS 和安全連接
- ✅ 全球 CDN 加速
- ✅ 自動擴展以應對流量

祝您部署順利！🎉


