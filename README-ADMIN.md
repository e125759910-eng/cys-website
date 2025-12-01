# CYS 後台管理系統

## 功能說明

這是一個需要帳號密碼的後台管理系統，用於查看客戶登記的保固資訊。

## 安全特性

1. **身份驗證**：需要帳號密碼才能登入
2. **Session 管理**：使用 HTTP-only cookies 儲存認證資訊
3. **路由保護**：未認證用戶無法訪問後台頁面
4. **資料保護**：保固資料僅管理員可查看

## 使用方式

### 1. 設定管理員帳號密碼

在 `.env.local` 文件中設定（如果沒有則使用預設值）：

```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

**預設帳號密碼**（僅用於開發環境）：
- 帳號：`admin`
- 密碼：`admin123`

⚠️ **生產環境請務必修改為強密碼！**

### 2. 訪問後台

1. 打開瀏覽器，訪問：`http://localhost:3000/admin/login`
2. 輸入帳號密碼
3. 登入成功後會自動跳轉到後台管理頁面

### 3. 查看保固資訊

在後台管理頁面可以查看：
- 所有客戶的保固登記資料
- 登記時間
- 客戶姓名、Email、產品序號、購買日期

### 4. 登出

點擊右上角的「登出」按鈕即可登出。

## 檔案結構

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # 登入頁面
│   ├── dashboard/
│   │   └── page.tsx          # 後台管理頁面
│   └── layout.tsx            # 後台布局
├── api/
│   ├── admin/
│   │   ├── login/
│   │   │   └── route.ts      # 登入 API
│   │   ├── logout/
│   │   │   └── route.ts      # 登出 API
│   │   └── warranties/
│   │       └── route.ts      # 獲取保固資料 API
│   └── warranty/
│       └── route.ts          # 保固登記 API（已更新為保存資料）
data/
└── warranties.json            # 保固資料儲存文件（自動生成）
middleware.ts                  # 路由保護中間件
```

## 資料儲存

保固資料儲存在 `data/warranties.json` 文件中，格式如下：

```json
[
  {
    "id": "warranty-1234567890-abc123",
    "name": "客戶姓名",
    "email": "customer@example.com",
    "serial": "產品序號",
    "date": "2024-01-01",
    "registeredAt": "2024-01-01T12:00:00.000Z"
  }
]
```

## 安全建議

1. **生產環境**：
   - 使用強密碼
   - 考慮使用資料庫而非 JSON 文件
   - 使用 JWT 或更安全的認證方式
   - 啟用 HTTPS
   - 限制後台訪問 IP

2. **資料備份**：
   - 定期備份 `data/warranties.json`
   - 考慮使用資料庫進行資料管理

## 注意事項

- 保固資料僅管理員可查看，客戶無法訪問
- 所有 API 路由都有身份驗證保護
- Session 有效期為 24 小時
- 登出後會清除認證資訊

