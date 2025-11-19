# 📸 作品集自動生成說明

## 🎯 功能說明

現在您可以將所有作品照片放在 `public/works/` 資料夾中，系統會自動掃描並生成作品集！

## 📁 使用步驟

### 步驟 1：創建作品資料夾

在 `public/` 目錄下創建 `works` 資料夾：

```
public/
  └── works/          ← 創建這個資料夾
      ├── 作品1.jpg
      ├── 作品2.png
      ├── BMW包膜.jpg
      └── ...
```

### 步驟 2：放入作品照片

將所有作品照片放入 `public/works/` 資料夾中。

**支援的圖片格式：**
- `.jpg` / `.jpeg` ✅ 推荐（网页显示最佳）
- `.png` ✅ 推荐
- `.gif`
- `.webp` ✅ 推荐（文件小，质量高）
- `.svg`
- `.nef` / `.NEF` ⚠️ **注意：RAW 格式，浏览器无法直接显示**

**重要提示：**
- `.NEF` 是 Nikon 相机的 RAW 格式文件
- 浏览器**无法直接显示** RAW 格式图片
- 如果使用 `.NEF` 文件，需要：
  1. 将 `.NEF` 转换为 `.JPG` 或 `.PNG` 格式
  2. 或使用图片处理软件（如 Lightroom、Photoshop）导出为网页格式
  3. 建议：保留 `.NEF` 作为原始文件，上传转换后的 `.JPG` 到网站

**命名建議：**
- 使用描述性的檔名，例如：`BMW全車包膜.jpg`、`特斯拉改色膜.png`
- 系統會自動從檔名生成作品標題
- 檔名中的 `-` 和 `_` 會被轉換為空格

### 步驟 3：生成作品集

運行以下命令自動生成作品集：

```bash
npm run generate-works
```

這個命令會：
- ✅ 自動掃描 `public/works/` 資料夾中的所有圖片
- ✅ 從檔名生成作品標題
- ✅ 自動更新 `data/works.ts` 檔案
- ✅ 按檔名排序作品

### 步驟 4：查看結果

生成完成後：
- 首頁會自動顯示前 3 個作品
- 作品集頁面會顯示所有作品

## 🔄 更新作品

當您新增、刪除或重新命名作品照片後：

1. 將新照片放入 `public/works/` 資料夾
2. 運行 `npm run generate-works`
3. 刷新網頁即可看到更新

## 📝 範例

假設您的 `public/works/` 資料夾中有以下檔案：

```
public/works/
  ├── BMW-M3-全車包膜.jpg
  ├── 特斯拉-Model-3-改色.jpg
  └── 賓士-AMG-保護膜.png
```

運行 `npm run generate-works` 後，會自動生成：

```typescript
export const works: Work[] = [
  {
    id: 1,
    title: "Bmw M3 全車包膜",
    img: "/works/BMW-M3-全車包膜.jpg",
    description: "專業包膜服務展示",
    category: "包膜案例"
  },
  {
    id: 2,
    title: "賓士 Amg 保護膜",
    img: "/works/賓士-AMG-保護膜.png",
    description: "專業包膜服務展示",
    category: "包膜案例"
  },
  {
    id: 3,
    title: "特斯拉 Model 3 改色",
    img: "/works/特斯拉-Model-3-改色.jpg",
    description: "專業包膜服務展示",
    category: "包膜案例"
  }
];
```

## ⚙️ 進階設定

如果您想要自訂作品資訊（如描述、分類），可以：

1. 運行 `npm run generate-works` 生成基礎資料
2. 手動編輯 `data/works.ts` 檔案
3. 添加或修改 `description` 和 `category` 欄位

## 🚨 注意事項

- ⚠️ `data/works.ts` 檔案會被自動覆蓋，如需手動修改請在生成後進行
- ⚠️ 確保圖片檔名不包含特殊字元（避免 `/`、`\`、`:` 等）
- ⚠️ 建議使用有意義的檔名，方便識別作品

## 💡 提示

- 可以將 `npm run generate-works` 添加到您的開發流程中
- 每次新增作品後記得運行此命令
- 圖片會自動按檔名排序顯示

