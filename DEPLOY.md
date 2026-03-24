# 🚀 SeoulMate 部署指南

## 快速部署到 Vercel（推荐）

### 1️⃣ 准备工作

确保已安装 Git 和 Node.js，并注册以下账号：
- [Vercel](https://vercel.com) - 免费部署平台
- [Stripe](https://stripe.com) - 支付处理（测试/生产密钥）
- [Firebase](https://console.firebase.google.com) - 数据库（可选）

---

### 2️⃣ 本地提交代码

```bash
cd "/Users/tsaishiangen/Desktop/무제 폴더"

# 提交所有修改
git add .
git commit -m "✅ Production ready: Stripe multi-payment + Translation + WeChat Pay fix"

# 推送到 GitHub（如果还没创建仓库）
# git remote add origin https://github.com/你的用户名/seoulmate.git
# git branch -M main
# git push -u origin main
```

---

### 3️⃣ 部署到 Vercel

**方法 A：通过 Vercel CLI（最快）**

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 第一次部署会提示：
# ? Set up and deploy "~/Desktop/무제 폴더"? [Y/n] → 输入 Y
# ? Which scope do you want to deploy to? → 选择你的账号
# ? Link to existing project? [y/N] → 输入 N（创建新项目）
# ? What's your project's name? → 输入 seoulmate
# ? In which directory is your code located? → 直接回车（当前目录）
```

**方法 B：通过 Vercel Dashboard（推荐新手）**

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击「Import Git Repository」
3. 连接你的 GitHub 仓库
4. Vercel 会自动检测 `vercel.json` 配置
5. 点击「Deploy」

---

### 4️⃣ 配置环境变量

部署后在 Vercel Dashboard：

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加以下变量（参考 `.env.production.example`）：

```env
# Stripe 支付（测试环境先用 test key）
STRIPE_SECRET_KEY=sk_test_你的测试密钥
STRIPE_PUBLISHABLE_KEY=pk_test_你的测试密钥

# PayPal 支付（可选）
PAYPAL_CLIENT_ID=你的PayPal客户端ID
PAYPAL_SECRET=你的PayPal密钥
PAYPAL_API=https://api-m.sandbox.paypal.com
PAYPAL_PLAN_ID_STARTER=P-你的入门方案PlanID
PAYPAL_PLAN_ID_PRO=P-你的专业方案PlanID
PAYPAL_PLAN_ID_ENTERPRISE=P-你的企业方案PlanID

# 应用 URL（Vercel 会自动生成，如 https://seoulmate.vercel.app）
APP_BASE_URL=https://seoulmate.vercel.app
```

3. 点击「Save」
4. 点击右上角「Redeploy」重新部署

---

### 4.5️⃣ 当前运行入口说明

当前仓库已统一以 `paypal_server.js` 作为本地与线上主要 API 入口：

- `npm start` / 本地开发入口：`paypal_server.js`
- `vercel.json` 当前线上 API 入口：`paypal_server.js`
- 静态管理后台页面：`stitch_assets/admin.html`

Stripe 结账成功页依赖以下查询接口：

```txt
GET /stripe-api/session/:session_id
```

成功页 `checkout_success.html` 会从 URL 读取 `session_id`，再调用该接口显示方案、金额、币种与订单编号。

PayPal 訂閱頁 `checkout_krhq.html` 會先呼叫：

```txt
GET /paypal-api/subscription/setup
POST /paypal-api/subscriptions/sync
```

前者用來讀取前端所需的 `clientId` 與各方案 `Plan ID`，後者在訂閱核准後同步狀態與訂閱編號。

---

### 5️⃣ 测试生产环境

部署完成后会得到一个 URL，例如：
```
https://seoulmate.vercel.app
```

**测试清单：**

✅ 访问首页：`https://seoulmate.vercel.app/`  
✅ 测试 Quiz：`https://seoulmate.vercel.app/quiz-korea-ready.html`  
✅ 测试模板商店：`https://seoulmate.vercel.app/notion-templates.html`  
✅ 测试转化页面：`https://seoulmate.vercel.app/benefits`  
✅ 测试支付成功页回跳：`/checkout_success.html?session_id=...` 能正确查询订单摘要  
✅ 测试翻译功能：点击右下角语言切换器  
✅ 测试支付：完整走一遍购买流程（用 Stripe 测试卡：`4242 4242 4242 4242`）

---

### 6️⃣ 绑定自定义域名

免费的 `.vercel.app` 域名已经可用，如果要自定义域名：

1. 在 Vercel Dashboard → **Settings** → **Domains**
2. 输入你的域名（例如：`seoulmate.com`）
3. 按提示到你的域名注册商（GoDaddy/Namecheap/Cloudflare）添加 DNS 记录：
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. 等待 DNS 传播（几分钟到几小时）

---

### 7️⃣ 切换到生产环境

测试无误后，更换为 Stripe 生产密钥：

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com)
2. 点击右上角切换到 **Production Mode**
3. 获取生产密钥：
   - **Secret Key**：`sk_live_xxxxxxxxxx`
   - **Publishable Key**：`pk_live_xxxxxxxxxx`
4. 在 Vercel 环境变量中替换测试密钥
5. Redeploy

---

## 🔍 故障排查

### 问题 1：部署成功但页面 404
**原因**：静态文件路径错误  
**解决**：检查 `vercel.json` 的 routes 配置，确认 API 请求仍然指向 `paypal_server.js`，静态资源指向 `stitch_assets/**`

### 问题 2：支付失败
**原因**：环境变量未设置  
**解决**：检查 Vercel 环境变量中 `STRIPE_SECRET_KEY` 是否正确

### 问题 2.5：支付完成后成功页没有订单信息
**原因**：`session_id` 缺失，或 `/stripe-api/session/:session_id` 返回错误  
**解决**：先确认 Stripe Checkout 的 `success_url` 带有 `?session_id={CHECKOUT_SESSION_ID}`，再检查服务端是否能读取对应 Session

### 问题 3：WeChat Pay 不可用
**原因**：需要企业账号  
**解决**：WeChat Pay 需要 Stripe 审核企业资质，测试期间先用卡片支付

## 📊 监控和分析

部署后建议添加：

1. **Google Analytics 4** - 流量追踪
   - 在 Firebase Console 启用 Google Analytics
   - 在 HTML `<head>` 添加 GA4 追踪代码

2. **Stripe Dashboard** - 支付监控
   - 查看支付成功率
   - 追踪收入数据

3. **Vercel Analytics** - 性能监控
   - 免费提供 Core Web Vitals 数据
   - 在项目设置中启用

---

## 🎯 下一步

部署完成后：

1. ✅ **小范围测试**：分享给 5-10 个朋友测试完整流程
2. ✅ **收集反馈**：记录用户在哪一步卡住
3. ✅ **追踪转换率**：Quiz 完成率 → 结账点击率 → 支付成功率
4. ✅ **优化文案**：根据数据调整标题、按钮文字
5. ✅ **开始推广**：Reddit、小红书、Instagram、LinkedIn

---

## 🆘 需要帮助？

- Vercel 文档：https://vercel.com/docs
- Stripe 文档：https://stripe.com/docs
- Firebase 文档：https://firebase.google.com/docs

完整技术栈记录在 `SITE.md` 文件中。
