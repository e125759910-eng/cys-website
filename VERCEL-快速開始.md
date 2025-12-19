# 🚀 Vercel 部署快速開始

## 第一步：安裝依賴

在部署前，請先在本地安裝新的依賴包：

```bash
npm install
```

這會安裝 `@vercel/kv` 包，用於在 Vercel 上持久化存儲保固資料。

## 第二步：部署到 Vercel

### 方法 1: 通過 Vercel Dashboard（推薦）

1. **推送代碼到 Git**
   ```bash
   git add .
   git commit -m "準備部署到 Vercel"
   git push
   ```

2. **在 Vercel 創建項目**
   - 訪問 https://vercel.com/new
   - 連接您的 Git 倉庫
   - 點擊 "Deploy"

3. **創建 KV 數據庫**
   - 在 Vercel Dashboard → Storage → Create Database
   - 選擇 "KV"
   - 命名並創建

4. **設置環境變量**
   - 項目設置 → Environment Variables
   - 添加：
     ```
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=您的密碼
     ```
   - KV 的環境變量會自動添加

5. **重新部署**
   - 點擊 "Redeploy" 應用環境變量

### 方法 2: 通過 CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 設置環境變量（首次部署後）
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD

# 生產環境部署
vercel --prod
```

## 第三步：測試

1. 訪問您的網站（Vercel 會提供 URL）
2. 訪問 `/admin/login` 登入後台
3. 新增保固資料測試
4. 訪問 `/warranty` 查詢保固

## 📚 完整文檔

- 詳細部署指南：`README-VERCEL-DEPLOY.md`
- 簡要指南：`VERCEL-部署指南.md`

## ⚠️ 重要提示

1. **KV 數據庫是必需的** - 沒有它，保固資料無法在 Vercel 上持久保存
2. **環境變量** - 設置後需要重新部署才能生效
3. **本地開發** - 不需要 KV，系統會自動使用文件系統

## 🎉 完成！

部署完成後，您的保固功能將：
- ✅ 永久保存資料（直到手動刪除）
- ✅ 在 Vercel 上正常運作
- ✅ 支援新增、編輯、刪除、查詢

祝部署順利！


