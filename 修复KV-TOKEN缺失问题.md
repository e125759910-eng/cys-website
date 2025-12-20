# 修复 KV TOKEN 缺失问题

## 🔍 问题诊断

错误信息：`@vercel/kv: Missing TOKEN`

**原因**：
- Vercel 连接 KV 数据库后，可能只自动创建了 `KV_REDIS_URL`
- 但 `@vercel/kv` 包需要 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN`
- 缺少 `KV_REST_API_TOKEN` 导致无法连接

## ✅ 解决方案

### 方法 1: 获取 REST API Token（推荐）

1. **在 Vercel Dashboard 中**
   - 进入项目 → Storage
   - 点击 KV 数据库 "warranties-kv"

2. **找到 REST API 部分**
   - 在数据库详情页面
   - 找到 "REST API" 或 "API" 部分
   - 应该能看到：
     - **REST API URL**（类似：`https://xxx.upstash.io`）
     - **REST API Token**（一长串字符）

3. **设置环境变量**
   - 进入项目 Settings → Environment Variables
   - 添加/编辑以下环境变量：

   **变量 1:**
   - Name: `KV_REST_API_URL`
   - Value: 从 KV 数据库复制的 REST API URL
   - Environment: ✅ Production
   - Save

   **变量 2:**
   - Name: `KV_REST_API_TOKEN`
   - Value: 从 KV 数据库复制的 REST API Token
   - Environment: ✅ Production
   - Save

4. **重新部署**
   - Deployments → 最新部署 → ... → Redeploy

### 方法 2: 检查现有环境变量

1. **检查环境变量名称**
   - 进入项目 Settings → Environment Variables
   - 查看是否有以下变量：
     - `KV_REDIS_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

2. **如果只有 KV_REDIS_URL**
   - 需要手动添加 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN`
   - 从 KV 数据库详情页面获取这些值

## 📋 快速检查清单

- [ ] 已访问 KV 数据库详情页面
- [ ] 已找到 REST API 部分
- [ ] 已复制 REST API URL
- [ ] 已复制 REST API Token
- [ ] 已添加 `KV_REST_API_URL` 环境变量
- [ ] 已添加 `KV_REST_API_TOKEN` 环境变量
- [ ] 环境变量已应用到 Production
- [ ] 已重新部署项目
- [ ] 部署已完成
- [ ] 已测试新增功能
- [ ] 已测试删除功能

## 🔧 验证步骤

部署完成后：

1. **运行系统诊断**
   - 登录后台管理页面
   - 点击 "系统诊断"
   - 应该看到：
     - ✅ KV 已配置: 是
     - ✅ KV URL 已设置: 是
     - ✅ KV Token 已设置: 是

2. **测试功能**
   - 尝试新增一条保固记录
   - 应该成功保存
   - 尝试删除一条记录
   - 应该成功删除

## ⚠️ 重要提示

- `KV_REDIS_URL` 和 `KV_REST_API_URL` 是不同的格式
- `@vercel/kv` 包需要 `KV_REST_API_URL` + `KV_REST_API_TOKEN`
- 两个环境变量都必须设置
- 必须应用到 Production 环境
- 设置后必须重新部署

## 🆘 如果仍然无法工作

1. **检查 Vercel 日志**
   - Deployments → 最新部署 → Functions/Logs
   - 查看详细错误信息

2. **验证环境变量**
   - 确认环境变量名称完全正确（区分大小写）
   - 确认值没有多余空格
   - 确认已应用到 Production

3. **重新连接 KV 数据库**
   - 在 KV 数据库页面
   - 断开连接
   - 重新连接
   - 检查环境变量是否自动创建

---

**完成这些步骤后，新增和删除功能应该可以正常工作！** 🎉

