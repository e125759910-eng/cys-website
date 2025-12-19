# Google Search Console 更新指南

由于您的域名已从 `cys-website-tau.vercel.app` 更改为 `cyswrap.com.tw`，需要更新 Google Search Console 配置。

## 步骤 1：访问 Google Search Console

1. 访问：https://search.google.com/search-console
2. 使用您的 Google 账号登录

## 步骤 2：添加新域名属性

### 2.1 添加新属性
1. 在左侧菜单点击 **"添加属性"** 或 **"Add property"**
2. 选择 **"网址前缀"** (URL prefix)
3. 输入新域名：`https://cyswrap.com.tw`
4. 点击 **"继续"** (Continue)

### 2.2 验证域名所有权

Google 会提供几种验证方式，推荐使用以下方法：

#### 方法 1：HTML 标签验证（推荐，最简单）

1. **复制验证代码**
   - Google 会显示类似这样的代码：
   ```html
   <meta name="google-site-verification" content="您的验证码" />
   ```

2. **添加到网站**
   - 打开 `app/layout.tsx`
   - 在 `<head>` 标签内添加验证代码
   - 示例：
   ```tsx
   <head>
     <link rel="canonical" href="https://cyswrap.com.tw" />
     <meta name="google-site-verification" content="您的验证码" />
   </head>
   ```

3. **部署并验证**
   - 提交代码到 GitHub（Vercel 会自动部署）
   - 等待部署完成后，回到 Google Search Console
   - 点击 **"验证"** (Verify) 按钮

#### 方法 2：HTML 文件验证

1. **下载验证文件**
   - Google 会提供 HTML 文件下载
   - 文件名类似：`google1234567890abcdef.html`

2. **上传到网站**
   - 将文件放在 `public/` 目录下
   - 提交代码并部署

3. **验证**
   - 确保可以通过 `https://cyswrap.com.tw/google1234567890abcdef.html` 访问
   - 回到 Google Search Console 点击 **"验证"**

#### 方法 3：DNS 记录验证（如果其他方法失败）

1. **添加 TXT 记录**
   - 在您的域名注册商添加 DNS TXT 记录
   - 记录值：Google 提供的验证码
   - 等待 DNS 传播（可能需要几小时）

2. **验证**
   - 在 Google Search Console 点击 **"验证"**

## 步骤 3：提交网站地图

### 3.1 添加网站地图
1. 在左侧菜单选择 **"网站地图"** (Sitemaps)
2. 在 "新网站地图" 输入框中输入：
   ```
   https://cyswrap.com.tw/sitemap.xml
   ```
3. 点击 **"提交"** (Submit)

### 3.2 验证网站地图
- Google 会显示网站地图状态
- 如果显示 **"成功"**，说明网站地图已提交
- 如果显示错误，检查 `https://cyswrap.com.tw/sitemap.xml` 是否可以访问

## 步骤 4：请求索引（可选但推荐）

### 4.1 索引首页
1. 在左侧菜单选择 **"网址检查"** (URL Inspection)
2. 输入首页地址：`https://cyswrap.com.tw`
3. 点击 **"请求编入索引"** (Request Indexing)

### 4.2 索引重要页面
建议也请求索引以下页面：
- `https://cyswrap.com.tw/portfolio`
- `https://cyswrap.com.tw/warranty`
- `https://cyswrap.com.tw/contact`

## 步骤 5：处理旧域名（可选）

### 5.1 保留旧域名属性
- 如果旧域名 `cys-website-tau.vercel.app` 仍在使用，可以保留
- 这样可以监控两个域名的搜索表现

### 5.2 设置重定向（如果旧域名不再使用）
如果旧域名不再使用，建议在 Vercel 设置重定向：

1. **在 Vercel 添加旧域名**
   - 在 Vercel 项目设置中添加 `cys-website-tau.vercel.app`
   - 设置重定向到新域名

2. **在代码中设置重定向**（可选）
   - 可以在 `next.config.js` 中添加重定向规则

### 5.3 移除旧域名（如果不再需要）
1. 在 Google Search Console 选择旧域名属性
2. 进入 **"设置"** (Settings) → **"移除网站"** (Remove property)
3. 确认移除

## 步骤 6：验证配置

### 6.1 检查网站地图
- 访问：`https://cyswrap.com.tw/sitemap.xml`
- 确认可以正常访问并显示所有页面

### 6.2 检查 Robots.txt
- 访问：`https://cyswrap.com.tw/robots.txt`
- 确认内容正确

### 6.3 使用 Google 工具测试
1. **Rich Results Test**
   - 访问：https://search.google.com/test/rich-results
   - 输入：`https://cyswrap.com.tw`
   - 检查结构化数据是否正确

2. **Mobile-Friendly Test**
   - 访问：https://search.google.com/test/mobile-friendly
   - 输入：`https://cyswrap.com.tw`
   - 确认移动端友好

3. **PageSpeed Insights**
   - 访问：https://pagespeed.web.dev/
   - 输入：`https://cyswrap.com.tw`
   - 检查页面速度

## 步骤 7：监控索引状态

### 7.1 检查索引状态
1. 在 Google Search Console 选择新域名属性
2. 在左侧菜单选择 **"索引"** (Indexing) → **"网页"** (Pages)
3. 查看已编入索引的页面数量

### 7.2 查看搜索表现
- 在 **"效果"** (Performance) 中查看搜索数据
- 注意：新域名可能需要几周时间才开始有搜索数据

## 常见问题

### Q1: 验证失败怎么办？
**A:** 
- 确保验证代码已正确添加到网站
- 等待网站部署完成（可能需要几分钟）
- 清除浏览器缓存后重试
- 尝试其他验证方法

### Q2: 网站地图显示错误？
**A:**
- 确认 `https://cyswrap.com.tw/sitemap.xml` 可以访问
- 检查网站地图格式是否正确
- 等待几分钟后重试

### Q3: 多久能看到搜索结果？
**A:**
- 索引通常需要几天到几周
- 新域名可能需要更长时间
- 定期更新内容有助于加快索引

### Q4: 需要移除旧域名吗？
**A:**
- 如果旧域名仍在使用，可以保留
- 如果不再使用，建议移除或设置重定向
- 设置重定向有助于将旧域名的 SEO 价值传递给新域名

### Q5: 如何检查网站是否被索引？
**A:**
在 Google 搜索框中输入：
```
site:cyswrap.com.tw
```

## 重要提示

1. **保持耐心**：Google 索引需要时间，通常需要几天到几周
2. **定期检查**：每周检查一次索引状态和搜索表现
3. **更新内容**：定期更新网站内容有助于提高搜索排名
4. **监控错误**：定期检查 Google Search Console 中的错误和警告

## 验证清单

完成以下所有步骤：

- [ ] 在 Google Search Console 添加新域名属性
- [ ] 验证域名所有权（使用 HTML 标签或文件）
- [ ] 提交网站地图：`https://cyswrap.com.tw/sitemap.xml`
- [ ] 请求索引首页和重要页面
- [ ] 检查网站地图可正常访问
- [ ] 检查 robots.txt 可正常访问
- [ ] 使用 Google 工具测试网站
- [ ] 在 Google 搜索 `site:cyswrap.com.tw` 检查索引状态
- [ ] 定期监控索引状态和搜索表现

## 需要帮助？

如果遇到问题：
1. 查看 Google Search Console 帮助文档
2. 检查网站是否可以正常访问
3. 确认所有配置步骤都已完成
4. 等待一段时间后重试

祝您配置顺利！🎉

