# 📸 NEF 转 JPG 转换说明

## 🎯 功能说明

此脚本可以自动将 `public/works/` 文件夹中的 `.NEF` 文件转换为 `.JPG` 格式，以便在网页上显示。

## 📥 安装 ImageMagick（必需）

### 方法 1：使用安装程序（推荐）

1. **下载 ImageMagick**
   - 访问：https://imagemagick.org/script/download.php
   - 选择 Windows 版本下载

2. **安装时的重要设置**
   - ✅ 勾选 "Install legacy utilities (e.g. convert)"
   - ✅ 勾选 "Add application directory to your system path"
   - 完成安装

3. **验证安装**
   ```bash
   magick -version
   ```
   或
   ```bash
   convert -version
   ```

### 方法 2：使用 Chocolatey（如果已安装）

```bash
choco install imagemagick
```

### 方法 3：使用 winget（Windows 10/11）

```bash
winget install ImageMagick.ImageMagick
```

## 🚀 使用方法

### 步骤 1：确保 ImageMagick 已安装

运行以下命令检查：
```bash
magick -version
```

### 步骤 2：运行转换脚本

```bash
npm run convert-nef
```

脚本会：
- ✅ 自动扫描 `public/works/` 文件夹中的所有 `.NEF` 文件
- ✅ 将每个 `.NEF` 文件转换为 `.JPG` 格式
- ✅ 保存在同一文件夹中
- ✅ 如果 `.JPG` 已存在，自动跳过

### 步骤 3：重新生成作品集

转换完成后，运行：
```bash
npm run generate-works
```

## 📝 示例

假设您有以下文件：
```
public/works/Porsche GT4RS 全車改色TPU/
  ├── DSC_4464.NEF
  ├── DSC_4465.NEF
  └── DSC_4468.NEF
```

运行 `npm run convert-nef` 后：
```
public/works/Porsche GT4RS 全車改色TPU/
  ├── DSC_4464.NEF
  ├── DSC_4464.JPG  ← 新生成
  ├── DSC_4465.NEF
  ├── DSC_4465.JPG  ← 新生成
  ├── DSC_4468.NEF
  └── DSC_4468.JPG  ← 新生成
```

## ⚙️ 转换设置

- **质量**: 90%（高质量）
- **格式**: JPG
- **位置**: 与原文件同一文件夹

## 🚨 注意事项

- ⚠️ 转换过程可能需要一些时间，取决于文件数量和大小
- ⚠️ 原始 `.NEF` 文件不会被删除，会保留在原位置
- ⚠️ 如果 `.JPG` 文件已存在，会自动跳过转换
- ⚠️ 确保有足够的磁盘空间

## 💡 提示

- 可以保留 `.NEF` 文件作为原始备份
- 转换后的 `.JPG` 文件会自动被作品集生成脚本识别
- 建议定期运行转换脚本，处理新添加的 `.NEF` 文件

