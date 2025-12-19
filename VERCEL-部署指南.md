# Vercel 部署快速指南

## 🚀 快速部署步驟

### 1. 創建 Vercel KV 數據庫（必需）

1. 登入 https://vercel.com/dashboard
2. 點擊 "Storage" → "Create Database" → 選擇 "KV"
3. 命名為 `cys-warranties` 並創建
4. 記錄 KV 連接信息（Vercel 會自動創建環境變量）

### 2. 部署到 Vercel

**選項 A：通過網站（推薦）**
1. 訪問 https://vercel.com/new
2. 連接您的 Git 倉庫
3. 點擊 "Deploy"

**選項 B：通過 CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### 3. 設置環境變量

在 Vercel Dashboard → 項目設置 → Environment Variables 添加：

```
KV_REST_API_URL = <從 KV 數據庫獲取>
KV_REST_API_TOKEN = <從 KV 數據庫獲取>
ADMIN_USERNAME = admin
ADMIN_PASSWORD = <設置您的密碼>
```

### 4. 重新部署

在 Vercel Dashboard 點擊 "Redeploy" 以應用環境變量

## ✅ 驗證

1. 訪問您的網站
2. 訪問 `/admin/login` 測試後台登入
3. 新增保固資料測試功能

## 📖 詳細說明

查看 `README-VERCEL-DEPLOY.md` 獲取完整的部署指南和故障排除。

## ⚠️ 重要提示

- **KV 數據庫是必需的**，否則保固資料無法持久保存
- 環境變量設置後需要重新部署才能生效
- 本地開發時不需要 KV，系統會使用文件系統存儲


