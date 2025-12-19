# Vercel KV 快速配置指南

## 🚀 5分钟快速配置

### 步骤 1: 创建 KV 数据库（2分钟）

1. **打开 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 登录您的账号

2. **进入项目**
   - 点击项目：`cys-website`

3. **创建 KV 数据库**
   - 点击左侧菜单 **"Storage"**
   - 点击 **"Create Database"** 按钮
   - 选择 **"KV"** 类型
   - 数据库名称：`cys-warranties`（或任意名称）
   - 选择区域：`Southeast Asia (Singapore)` 或 `East Asia (Tokyo)`（推荐）
   - 点击 **"Create"**

### 步骤 2: 获取连接信息（1分钟）

1. **查看 KV 数据库详情**
   - 点击刚创建的 KV 数据库
   - 在页面中找到 **"REST API"** 部分

2. **复制连接信息**
   - 复制 **"REST API URL"**（类似：`https://xxx.upstash.io`）
   - 复制 **"REST API Token"**（一长串字符）

### 步骤 3: 设置环境变量（1分钟）

1. **进入项目设置**
   - 在项目页面，点击顶部 **"Settings"** 标签
   - 点击左侧菜单 **"Environment Variables"**

2. **添加环境变量**
   
   点击 **"Add New"** 添加以下两个变量：

   **变量 1:**
   - Name: `KV_REST_API_URL`
   - Value: 粘贴刚才复制的 REST API URL
   - Environment: 勾选 **"Production"**（必须！）
   - 点击 **"Save"**

   **变量 2:**
   - Name: `KV_REST_API_TOKEN`
   - Value: 粘贴刚才复制的 REST API Token
   - Environment: 勾选 **"Production"**（必须！）
   - 点击 **"Save"**

3. **确认环境变量**
   - 应该看到两个环境变量：
     - ✅ `KV_REST_API_URL`
     - ✅ `KV_REST_API_TOKEN`

### 步骤 4: 重新部署（1分钟）

1. **触发重新部署**
   - 点击顶部 **"Deployments"** 标签
   - 找到最新的部署记录
   - 点击右侧 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 确认重新部署

2. **等待部署完成**
   - 通常需要 1-2 分钟
   - 等待状态变为 **"Ready"**

### 步骤 5: 验证配置（30秒）

1. **测试后台**
   - 访问：`https://your-domain.com/admin/login`
   - 登录后台

2. **运行系统诊断**
   - 点击 **"系统诊断"** 按钮
   - 应该看到：
     - ✅ 存储类型: `kv`
     - ✅ KV 已配置: `是`
     - ✅ KV URL 已设置: `是`
     - ✅ KV Token 已设置: `是`

3. **测试功能**
   - 点击 **"新增保固"**
   - 填写测试数据
   - 点击 **"新增"**
   - 应该成功保存！

## ⚠️ 常见错误

### 错误 1: 环境变量未应用到 Production

**症状**：诊断显示 KV 未配置

**解决**：
- 检查环境变量设置时，确保勾选了 **"Production"**
- 如果只勾选了 "Preview" 或 "Development"，Production 环境不会生效

### 错误 2: 环境变量值错误

**症状**：连接失败

**解决**：
- 重新复制 KV 数据库的 REST API URL 和 Token
- 确保没有多余的空格或换行
- 删除旧的环境变量，重新添加

### 错误 3: 部署后仍然显示错误

**解决**：
- 等待 1-2 分钟让部署完全完成
- 清除浏览器缓存
- 重新登录后台
- 再次运行系统诊断

## 📸 截图参考

### KV 数据库创建页面
- 选择 "KV" 类型
- 输入数据库名称
- 选择区域

### 环境变量设置页面
- Name: `KV_REST_API_URL`
- Value: 从 KV 数据库复制的 URL
- Environment: ✅ Production

## ✅ 配置检查清单

完成配置后，确认以下所有项：

- [ ] KV 数据库已创建
- [ ] 已复制 REST API URL
- [ ] 已复制 REST API Token
- [ ] 已添加 `KV_REST_API_URL` 环境变量
- [ ] 已添加 `KV_REST_API_TOKEN` 环境变量
- [ ] 环境变量已应用到 Production
- [ ] 已重新部署项目
- [ ] 部署状态为 "Ready"
- [ ] 系统诊断显示 KV 已配置
- [ ] 可以成功新增保固记录
- [ ] 可以成功删除保固记录

## 🆘 需要帮助？

如果按照以上步骤操作后仍有问题：

1. **检查 Vercel 日志**
   - 在 Deployments 页面点击最新部署
   - 查看 "Functions" 或 "Logs" 标签
   - 查找错误信息

2. **验证 KV 数据库**
   - 确认 KV 数据库状态为 "Active"
   - 确认数据库没有被删除

3. **重新配置**
   - 删除所有 KV 相关环境变量
   - 重新创建 KV 数据库
   - 重新添加环境变量
   - 重新部署

---

**配置完成后，您的保固系统将可以正常新增、编辑和删除记录！** 🎉

