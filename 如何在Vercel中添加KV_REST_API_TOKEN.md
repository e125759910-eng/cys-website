# 如何在 Vercel 中添加 KV_REST_API_TOKEN

## 📍 步骤 1: 进入 KV 数据库详情页面

1. **登录 Vercel Dashboard**
   - 访问 https://vercel.com
   - 登录您的账户

2. **进入项目**
   - 点击您的项目（cys-website）

3. **进入 Storage**
   - 在左侧导航栏中，点击 **"Storage"** 或 **"存储"**
   - 或者直接访问：`https://vercel.com/[您的用户名]/[项目名]/storage`

4. **选择 KV 数据库**
   - 点击您的 KV 数据库（通常是 "warranties-kv" 或类似名称）

## 📍 步骤 2: 查找 REST API Token

在 KV 数据库详情页面中，查找以下部分：

### 方法 A: 查找 "REST API" 部分
- 在页面中查找 **"REST API"** 或 **"API"** 标签/部分
- 应该能看到：
  - **REST API URL**: `https://xxx.upstash.io`
  - **REST API Token**: `xxxxx...`（一长串字符）

### 方法 B: 查找 "Getting Started" 或 "Quickstart"
- 点击 **"Getting Started"** 或 **"快速开始"** 标签
- 查看代码示例，通常会显示环境变量：
  ```bash
  KV_REST_API_URL=https://xxx.upstash.io
  KV_REST_API_TOKEN=xxxxx...
  ```

### 方法 C: 查找 "Settings" 或 "连接信息"
- 点击 **"Settings"** 或 **"设置"** 标签
- 查找 **"Connection"** 或 **"连接"** 部分
- 应该能看到 REST API 相关信息

## 📍 步骤 3: 复制 Token

1. **找到 Token 字段**
   - 通常显示为：`KV_REST_API_TOKEN` 或 `REST API Token`
   - 是一串长字符（可能以 `AX` 开头）

2. **复制 Token**
   - 点击 Token 旁边的 **"复制"** 按钮
   - 或手动选择并复制整个 Token 值

## 📍 步骤 4: 在项目设置中添加环境变量

1. **进入项目设置**
   - 在 Vercel Dashboard 中，点击您的项目
   - 点击顶部导航栏的 **"Settings"** 或 **"设置"**

2. **进入环境变量页面**
   - 在左侧菜单中，点击 **"Environment Variables"** 或 **"环境变量"**

3. **添加 KV_REST_API_TOKEN**
   - 点击 **"Add New"** 或 **"添加新变量"** 按钮
   - **Key（键）**: 输入 `KV_REST_API_TOKEN`
   - **Value（值）**: 粘贴刚才复制的 Token
   - **Environment（环境）**: 选择 **"Production"**（生产环境）
     - 如果需要，也可以选择 "Preview" 和 "Development"

4. **保存**
   - 点击 **"Save"** 或 **"保存"**

## 📍 步骤 5: 检查 KV_REST_API_URL

同时确保 `KV_REST_API_URL` 也已设置：

1. **在环境变量列表中查找**
   - 查看是否已有 `KV_REST_API_URL`
   - 如果没有，需要添加它

2. **获取 KV_REST_API_URL**
   - 在 KV 数据库详情页面的 REST API 部分
   - 复制 **REST API URL**（格式通常是：`https://xxx.upstash.io`）

3. **添加 KV_REST_API_URL**
   - Key: `KV_REST_API_URL`
   - Value: 粘贴 REST API URL
   - Environment: Production

## 📍 步骤 6: 重新部署

1. **触发重新部署**
   - 在 Vercel Dashboard 中，进入 **"Deployments"** 或 **"部署"**
   - 点击最新的部署记录
   - 点击 **"Redeploy"** 或 **"重新部署"**
   - 或者推送新的代码更改到 Git 仓库

2. **等待部署完成**
   - 部署通常需要 1-3 分钟

## 📍 步骤 7: 验证配置

1. **进入后台**
   - 访问您的网站后台：`https://[您的域名]/admin/dashboard`

2. **点击"系统诊断"**
   - 查看诊断结果
   - 应该显示：
     - ✅ `KV URI 已設置: 是`
     - ✅ `KV Token 已設置: 是`
     - ✅ `連接測試: 連接成功`

3. **测试功能**
   - 尝试新增一条保固记录
   - 尝试删除一条保固记录
   - 如果都成功，说明配置正确！

## ⚠️ 常见问题

### Q1: 找不到 REST API 部分？
**A**: 尝试以下方法：
- 查看 KV 数据库页面的所有标签页
- 检查是否有 "API"、"Connection"、"Settings" 等标签
- 如果使用 Vercel 自动创建的 KV，可能需要手动查看 Upstash 控制台

### Q2: 只有 KV_REDIS_URL，没有 Token？
**A**: 
- 如果 `KV_REDIS_URL` 是 `redis://` 格式，不需要单独的 Token
- 如果 `KV_REDIS_URL` 是 `https://` 格式（REST API URL），需要添加 `KV_REST_API_TOKEN`
- 代码会自动处理这两种情况

### Q3: Token 在哪里找不到？
**A**: 
- 在 Vercel Dashboard → Storage → KV 数据库详情页面
- 查找 "REST API" 或 "API" 部分
- 如果还是找不到，可能需要：
  1. 检查 KV 数据库是否已正确创建
  2. 联系 Vercel 支持
  3. 或者使用 `KV_REDIS_URL` 格式（如果支持）

### Q4: 添加环境变量后还是不工作？
**A**: 
- 确保环境变量应用于 **Production** 环境
- 确保已重新部署项目
- 检查 Vercel 函数日志中的错误信息
- 使用"系统诊断"功能查看详细配置状态

## 📝 快速检查清单

- [ ] 已进入 KV 数据库详情页面
- [ ] 已找到 REST API Token
- [ ] 已复制 Token 值
- [ ] 已在项目设置中添加 `KV_REST_API_TOKEN` 环境变量
- [ ] 已检查 `KV_REST_API_URL` 是否已设置
- [ ] 已选择 Production 环境
- [ ] 已保存环境变量
- [ ] 已重新部署项目
- [ ] 已通过"系统诊断"验证配置
- [ ] 已测试新增和删除功能

---

如果按照以上步骤操作后仍有问题，请提供：
1. 系统诊断的完整输出
2. Vercel 函数日志中的错误信息
3. 您在 KV 数据库页面看到的具体内容

