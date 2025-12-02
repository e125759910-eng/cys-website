# DNS 验证指南

您的域名 `cyswrap.com.tw` 已在 Vercel 配置完成，现在等待 DNS 生效。

## 如何检查 DNS 是否生效

### 方法 1：使用在线工具（推荐）

1. **DNS Checker**
   - 访问：https://dnschecker.org
   - 输入域名：`cyswrap.com.tw`
   - 选择记录类型：`A` 或 `CNAME`
   - 查看全球 DNS 传播状态

2. **What's My DNS**
   - 访问：https://www.whatsmydns.net
   - 输入域名：`cyswrap.com.tw`
   - 查看 DNS 记录

### 方法 2：使用命令行

**Windows (PowerShell):**
```powershell
nslookup cyswrap.com.tw
```

**或使用：**
```powershell
Resolve-DnsName cyswrap.com.tw -Type A
```

**Mac/Linux:**
```bash
nslookup cyswrap.com.tw
# 或
dig cyswrap.com.tw
```

### 方法 3：直接访问网站

尝试访问：
- `https://cyswrap.com.tw`
- `http://cyswrap.com.tw`

如果看到您的网站内容，说明 DNS 已生效！

## DNS 生效时间

- **通常时间**：5 分钟到 2 小时
- **最长可能**：最多 48 小时（罕见）
- **TTL 设置**：如果 TTL 设置为 3600（1小时），更改可能需要 1 小时才能完全传播

## 验证 Vercel 配置

### 在 Vercel Dashboard 检查

1. 登录 Vercel：https://vercel.com
2. 进入您的项目
3. 点击 **Settings** → **Domains**
4. 查看域名状态：
   - ✅ **Valid** - 域名已配置成功
   - ⏳ **Pending** - 等待 DNS 生效
   - ❌ **Invalid** - 需要检查 DNS 配置

### 检查 SSL 证书

DNS 生效后，Vercel 会自动配置 SSL 证书：
- 通常需要 5-10 分钟
- 在 Domains 页面可以看到 SSL 状态
- 证书状态显示为 **Valid** 时，HTTPS 即可使用

## DNS 生效后的步骤

### 1. 验证网站访问
- [ ] 访问 `https://cyswrap.com.tw` 确认网站正常显示
- [ ] 检查所有页面是否正常加载
- [ ] 确认 HTTPS 正常工作（浏览器显示锁图标）

### 2. 更新 Google Search Console
1. 访问：https://search.google.com/search-console
2. 添加新属性：`https://cyswrap.com.tw`
3. 验证域名所有权（使用 HTML 标签或文件验证）
4. 提交网站地图：`https://cyswrap.com.tw/sitemap.xml`
5. 请求索引首页

### 3. 测试 SEO 功能
- [ ] 访问 `https://cyswrap.com.tw/sitemap.xml` 确认网站地图正常
- [ ] 访问 `https://cyswrap.com.tw/robots.txt` 确认 robots.txt 正常
- [ ] 使用 Google Rich Results Test 测试结构化数据

### 4. 检查重定向（如果配置了 www）
如果同时配置了 `www.cyswrap.com.tw`：
- [ ] 确认 `www` 版本可以访问
- [ ] 确认重定向规则正常工作

## 常见问题排查

### 问题 1：DNS 已生效但网站无法访问

**可能原因：**
- Vercel 项目部署失败
- DNS 记录配置错误
- 域名未正确添加到 Vercel

**解决方法：**
1. 检查 Vercel 项目部署状态
2. 确认域名在 Vercel Domains 页面显示为 Valid
3. 检查浏览器控制台是否有错误

### 问题 2：HTTPS 证书未生效

**可能原因：**
- DNS 刚生效，SSL 证书还在配置中
- 证书配置失败

**解决方法：**
1. 等待 10-15 分钟
2. 在 Vercel Domains 页面检查 SSL 状态
3. 如果超过 1 小时仍未生效，联系 Vercel 支持

### 问题 3：部分地区无法访问

**可能原因：**
- DNS 传播未完成
- 某些 DNS 服务器缓存了旧记录

**解决方法：**
1. 使用 DNS Checker 检查全球传播状态
2. 等待更长时间（最多 48 小时）
3. 清除本地 DNS 缓存

## 清除本地 DNS 缓存

如果本地显示旧记录，可以清除缓存：

**Windows:**
```powershell
ipconfig /flushdns
```

**Mac:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
# 或
sudo /etc/init.d/nscd restart
```

## 验证清单

DNS 生效后，请完成以下检查：

- [ ] 网站可以通过 `https://cyswrap.com.tw` 访问
- [ ] 所有页面正常加载
- [ ] HTTPS 证书有效（浏览器显示锁图标）
- [ ] 网站地图可访问：`https://cyswrap.com.tw/sitemap.xml`
- [ ] Robots.txt 可访问：`https://cyswrap.com.tw/robots.txt`
- [ ] 在 Google Search Console 添加新域名
- [ ] 提交新的网站地图
- [ ] 测试所有功能（作品集、保固查询、联络我们等）

## 需要帮助？

如果遇到问题：
1. 检查 Vercel Dashboard 的错误信息
2. 查看 Vercel 文档：https://vercel.com/docs/concepts/projects/domains
3. 联系您的域名注册商技术支持
4. 检查 DNS 记录是否正确配置

祝您配置顺利！🎉

