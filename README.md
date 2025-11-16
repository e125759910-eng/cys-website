# CYS | Change Your Style

一個以科技感藍色為主題的未來科技風格品牌網站，使用 Next.js + TypeScript + Tailwind CSS 構建。

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置專案
```bash
npm run build
```

### 啟動生產環境
```bash
npm start
```

## 📁 專案結構

```
cys-website/
├─ app/                      # Next.js App Router 頁面
│  ├─ page.tsx              # 首頁
│  ├─ portfolio/page.tsx    # 作品集頁面
│  ├─ warranty/page.tsx     # 電子保固頁面
│  ├─ contact/page.tsx      # 聯絡我們頁面
│  ├─ layout.tsx            # 根佈局
│  ├─ globals.css           # 全域樣式
│  └─ api/warranty/route.ts # 保固登記 API
├─ components/               # React 組件
│  ├─ Navbar.tsx            # 導航列
│  ├─ Footer.tsx            # 頁尾
│  ├─ Hero.tsx              # 首頁英雄區塊
│  ├─ PortfolioGrid.tsx     # 作品集網格
│  └─ WarrantyForm.tsx      # 保固登記表單
├─ public/                   # 靜態資源
│  ├─ logo.svg              # CYS Logo
│  ├─ work1.svg             # 作品圖 1
│  ├─ work2.svg             # 作品圖 2
│  └─ work3.svg             # 作品圖 3
├─ tailwind.config.js        # Tailwind CSS 設定
├─ postcss.config.js         # PostCSS 設定
├─ tsconfig.json            # TypeScript 設定
└─ next.config.js           # Next.js 設定
```

## 🎨 功能特色

- ✨ **科技感設計**：未來科技藍色主題，漸層背景
- 🎭 **動畫效果**：使用 Framer Motion 實現流暢動畫
- 📱 **響應式設計**：完美支援各種螢幕尺寸
- 🎨 **作品集展示**：優雅的作品展示網格
- 📋 **保固登記**：電子保固登記表單與 API
- 📞 **聯絡資訊**：清晰的聯絡方式展示

## 🛠 技術棧

- **框架**：Next.js 14 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **動畫**：Framer Motion
- **部署**：建議使用 Vercel

## 📝 自訂設定

### 顏色主題
在 `tailwind.config.js` 中修改品牌顏色：
```js
colors: {
  brand: {
    blue: "#0a84ff",    // 主要品牌藍
    dark: "#001f3f",    // 深色背景
    light: "#a0cfff",   // 淺色文字
  },
}
```

### API 整合
編輯 `app/api/warranty/route.ts` 來串接：
- 資料庫（如 MongoDB、PostgreSQL）
- Google Sheets API
- 郵件服務（SendGrid、Mailgun）

## 🚀 部署

### Vercel（推薦）
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台
專案支援任何支援 Next.js 的平台：
- Netlify
- AWS Amplify
- Railway
- Render

## 📧 聯絡方式

- Email: info@cys-style.com
- 電話: 02-1234-5678
- 地址: 台北市信義區時尚大道 88 號

---

© 2024 CYS | Change Your Style — All rights reserved.

