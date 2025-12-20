# 如何获取 Vercel KV 连接信息

如果找不到 REST API 部分，请按照以下步骤操作：

## 🔍 方法 1: 在 KV 数据库详情页面查找

1. **进入 KV 数据库页面**
   - Vercel Dashboard → 项目 → Storage
   - 点击 KV 数据库 "warranties-kv"

2. **查找连接信息的位置**
   - 查看页面上的所有标签/部分：
     - "Overview"（概览）
     - "Settings"（设置）
     - "Getting Started"（快速开始）
     - "Usage"（使用情况）
     - "API" 或 "REST API"
     - "Connection"（连接）

3. **在 "Getting Started" 或 "Quickstart" 部分**
   - 通常会有代码示例
   - 查看 `.env.local` 标签
   - 应该能看到环境变量名称和值

## 🔍 方法 2: 检查自动创建的环境变量

1. **在项目设置中**
   - Settings → Environment Variables
   - 查看是否有以下变量：
     - `KV_REDIS_URL`
     - `KV_URL`（如果使用了自定义前缀）
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

2. **如果看到 `KV_REDIS_URL`**
   - 点击变量查看值
   - 复制这个值

## 🔍 方法 3: 使用 Vercel CLI 查看

1. **在本地终端运行**
   ```bash
   vercel env pull .env.local
   ```

2. **查看生成的文件**
   - 打开 `.env.local` 文件
   - 查找 KV 相关的环境变量

## 🔍 方法 4: 在 "Connect Project" 对话框中

当您点击 "Connect Project" 时：
- 查看 "Custom Prefix" 输入框
- 如果留空，Vercel 会创建 `KV_REDIS_URL`
- 如果输入了前缀（如 `KV`），会创建 `KV_URL`

## ✅ 推荐操作

1. **检查环境变量**
   - 进入项目 Settings → Environment Variables
   - 查看是否有 `KV_REDIS_URL` 或类似变量
   - 如果有，复制这个值

2. **如果只有 `KV_REDIS_URL`**
   - 代码已经更新，可以直接使用 `KV_REDIS_URL`
   - 不需要单独的 Token（URL 中包含认证信息）

3. **重新部署**
   - 确保环境变量已设置
   - 重新部署项目

## 📝 当前代码支持

代码现在支持：
- ✅ `KV_REDIS_URL`（Vercel 自动提供）
- ✅ `REDIS_URL`（通用格式）
- ✅ `KV_REST_API_URL` + `KV_REST_API_TOKEN`（旧格式）

如果只有 `KV_REDIS_URL`，代码会自动使用 redis 包连接，不需要 REST API Token。

