# 域名配置说明

您的网站已配置为使用自定义域名：**cyswrap.com.tw**

## 在 Vercel 上配置域名

### 步骤 1：登录 Vercel
1. 访问：https://vercel.com
2. 登录您的账号

### 步骤 2：选择项目
1. 在 Dashboard 中找到 `cys-website` 项目
2. 点击进入项目设置

### 步骤 3：添加域名
1. 在项目设置中，点击 **Settings** → **Domains**
2. 在 "Domains" 输入框中输入：`cyswrap.com.tw`
3. 点击 **Add** 按钮

### 步骤 4：配置 DNS 记录
Vercel 会显示需要配置的 DNS 记录。根据您的域名注册商，添加以下记录：

#### 选项 1：使用 A 记录（推荐）
```
类型: A
名称: @ (或留空)
值: 76.76.21.21
TTL: 3600 (或自动)
```

#### 选项 2：使用 CNAME 记录
```
类型: CNAME
名称: @ (或 www)
值: cname.vercel-dns.com
TTL: 3600 (或自动)
```

**注意**：如果使用 CNAME，可能需要先添加 A 记录指向 Vercel 的 IP，或者使用域名注册商提供的别名记录功能。

### 步骤 5：等待 DNS 传播
- DNS 记录通常需要几分钟到几小时才能生效
- 您可以使用 https://dnschecker.org 检查 DNS 传播状态

### 步骤 6：验证域名
1. 在 Vercel 的 Domains 页面，等待域名状态变为 **Valid**
2. 如果显示错误，请检查 DNS 配置是否正确

## 常见域名注册商 DNS 配置

### 中华电信 (Hinet)
1. 登录 Hinet 域名管理后台
2. 找到 DNS 管理功能
3. 添加 A 记录：`@` → `76.76.21.21`
4. 添加 CNAME 记录：`www` → `cname.vercel-dns.com`（可选）

### PChome
1. 登录 PChome 域名管理
2. 进入 DNS 设置
3. 添加相应的 A 或 CNAME 记录

### GoDaddy
1. 登录 GoDaddy 账户
2. 进入 "我的产品" → "域名"
3. 点击域名旁边的 "DNS"
4. 添加相应的记录

### Namecheap
1. 登录 Namecheap
2. 进入 "Domain List"
3. 点击域名旁边的 "Manage"
4. 进入 "Advanced DNS"
5. 添加相应的记录

## SSL 证书

Vercel 会自动为您的域名配置 SSL 证书（HTTPS），通常需要几分钟时间。

## 验证配置

配置完成后，访问以下地址验证：
- `https://cyswrap.com.tw` - 应该显示您的网站
- `https://www.cyswrap.com.tw` - 如果配置了 www 子域名

## 更新 Google Search Console

域名配置完成后，请更新 Google Search Console：
1. 访问：https://search.google.com/search-console
2. 添加新属性：`https://cyswrap.com.tw`
3. 验证域名所有权
4. 提交新的网站地图：`https://cyswrap.com.tw/sitemap.xml`

## 常见问题

**Q: DNS 记录添加后多久生效？**
A: 通常需要 5 分钟到 48 小时，大多数情况下在 1-2 小时内生效。

**Q: 如何检查 DNS 是否配置正确？**
A: 使用命令：`nslookup cyswrap.com.tw` 或访问 https://dnschecker.org

**Q: 网站显示 "Invalid Domain" 错误？**
A: 
- 检查 DNS 记录是否正确配置
- 等待 DNS 传播完成
- 确认域名已在 Vercel 中添加

**Q: 如何强制使用 HTTPS？**
A: Vercel 会自动配置 HTTPS，无需额外设置。

**Q: 可以同时使用 www 和非 www 版本吗？**
A: 可以，在 Vercel 中添加两个域名：`cyswrap.com.tw` 和 `www.cyswrap.com.tw`，Vercel 会自动处理重定向。

## 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 文档：https://vercel.com/docs/concepts/projects/domains
2. 联系您的域名注册商技术支持
3. 检查 Vercel 项目设置中的错误信息

