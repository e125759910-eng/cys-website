# Vercel KV 配置检查指南

如果正式网站无法新增或删除保固记录，通常是 Vercel KV 配置问题。请按照以下步骤检查：

## 🔍 检查步骤

### 1. 检查 Vercel KV 数据库

1. 登录 Vercel Dashboard: https://vercel.com/dashboard
2. 选择您的项目（cys-website）
3. 点击左侧菜单的 **"Storage"** 或 **"KV"**
4. 确认是否已创建 KV 数据库
   - 如果没有，点击 **"Create Database"**
   - 选择 **"KV"** 类型
   - 命名（例如：`cys-warranties`）
   - 选择区域并创建

### 2. 检查环境变量

1. 在 Vercel Dashboard 中，进入项目设置
2. 点击 **"Environment Variables"**
3. 确认以下环境变量已设置：

   ```
   KV_REST_API_URL = <从 KV 数据库获取的 URL>
   KV_REST_API_TOKEN = <从 KV 数据库获取的 Token>
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = <您的密码>
   ```

4. 如果环境变量缺失：
   - 点击 **"Add New"**
   - 添加上述环境变量
   - **重要**：确保选择正确的环境（Production、Preview、Development）

### 3. 获取 KV 连接信息

如果 KV 数据库已创建但环境变量未设置：

1. 在 Vercel Dashboard 中，进入 **"Storage"** → 选择您的 KV 数据库
2. 在数据库详情页面，找到 **"REST API"** 部分
3. 复制以下信息：
   - **REST API URL** → 设置为 `KV_REST_API_URL`
   - **REST API Token** → 设置为 `KV_REST_API_TOKEN`

### 4. 使用系统诊断功能

部署完成后，在后台管理页面：

1. 登录后台：`https://your-domain.com/admin/login`
2. 点击 **"系统诊断"** 按钮（蓝色按钮）
3. 查看诊断信息：
   - **存储类型**：应该是 `kv`（不是 `file`）
   - **KV 已配置**：应该是 `是`
   - **KV URL 已设置**：应该是 `是`
   - **KV Token 已设置**：应该是 `是`

如果任何一项显示 `否`，说明配置有问题。

### 5. 重新部署

修改环境变量后：

1. 在 Vercel Dashboard 的 **"Deployments"** 页面
2. 找到最新的部署
3. 点击 **"..."** → **"Redeploy"**
4. 等待部署完成

## ⚠️ 常见问题

### 问题 1: "KV not configured"

**原因**：环境变量未设置或设置错误

**解决方法**：
- 检查 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 是否已设置
- 确认环境变量应用于正确的环境（Production）
- 重新部署项目

### 问题 2: "KV write failed" 或 "KV read failed"

**原因**：KV 连接失败或认证失败

**解决方法**：
- 检查 KV 数据库是否仍然存在
- 验证 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 是否正确
- 确认 KV 数据库的区域设置正确

### 问题 3: 错误信息显示 "存儲服務連接失敗"

**原因**：无法连接到 Vercel KV 服务

**解决方法**：
- 检查网络连接
- 验证 KV_REST_API_URL 格式是否正确（应该是完整的 URL）
- 检查 Vercel KV 服务状态

## 📝 快速检查清单

- [ ] KV 数据库已创建
- [ ] `KV_REST_API_URL` 环境变量已设置
- [ ] `KV_REST_API_TOKEN` 环境变量已设置
- [ ] `ADMIN_USERNAME` 环境变量已设置
- [ ] `ADMIN_PASSWORD` 环境变量已设置
- [ ] 环境变量应用于 Production 环境
- [ ] 已重新部署项目
- [ ] 系统诊断显示所有配置正确

## 🔧 手动测试

部署完成后，可以手动测试：

1. **测试新增**：
   - 在后台添加一条测试保固记录
   - 如果成功，记录应该立即显示在列表中

2. **测试删除**：
   - 删除刚才添加的测试记录
   - 记录应该立即从列表中消失

3. **测试查询**：
   - 在前台保固查询页面
   - 使用测试记录的电话号码查询
   - 应该能查询到记录

## 💡 提示

- 环境变量修改后，**必须重新部署**才能生效
- 如果问题持续，查看 Vercel Dashboard 的 **"Functions"** 或 **"Logs"** 标签获取详细错误信息
- 系统诊断功能可以帮助快速定位问题

---

如果按照以上步骤操作后仍有问题，请检查 Vercel Dashboard 的日志获取详细错误信息。

