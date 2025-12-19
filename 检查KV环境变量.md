# 检查 KV 环境变量配置

您的 KV 数据库 "保固-kv" 已经创建并连接到项目，但还需要设置环境变量才能使用。

## 🔍 检查步骤

### 步骤 1: 获取 KV 连接信息

1. **在 Vercel Dashboard 中**
   - 点击 KV 数据库 "保固-kv"
   - 进入数据库详情页面

2. **找到 "REST API" 部分**
   - 应该能看到：
     - **REST API URL**（类似：`https://xxx.upstash.io`）
     - **REST API Token**（一长串字符）

3. **复制这两个值**
   - 保存好，稍后需要用到

### 步骤 2: 检查环境变量

1. **在项目设置中**
   - 点击顶部 "Settings" 标签
   - 点击左侧 "Environment Variables"

2. **检查是否存在以下环境变量：**
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

3. **如果不存在或值不正确：**
   - 点击 "Add New" 添加
   - 或点击现有变量进行编辑

### 步骤 3: 设置环境变量

**环境变量 1:**
- Name: `KV_REST_API_URL`
- Value: 从 KV 数据库复制的 REST API URL
- Environment: ✅ **必须勾选 "Production"**
- 点击 "Save"

**环境变量 2:**
- Name: `KV_REST_API_TOKEN`
- Value: 从 KV 数据库复制的 REST API Token
- Environment: ✅ **必须勾选 "Production"**
- 点击 "Save"

### 步骤 4: 重新部署

1. 点击 "Deployments" 标签
2. 找到最新部署
3. 点击 "..." → "Redeploy"
4. 等待部署完成

### 步骤 5: 验证

1. 登录后台管理页面
2. 点击 "系统诊断"
3. 应该看到：
   - ✅ KV 已配置: 是
   - ✅ KV URL 已设置: 是
   - ✅ KV Token 已设置: 是

## ⚠️ 重要提示

- KV 数据库已连接 ✅
- 但环境变量可能未设置 ❌
- 环境变量必须应用到 "Production" 环境
- 设置后必须重新部署

## 🎯 快速操作

1. 点击 KV 数据库 "保固-kv" → 复制 REST API URL 和 Token
2. 项目设置 → Environment Variables → 添加/编辑环境变量
3. 确保勾选 "Production" 环境
4. 重新部署项目
5. 测试功能

