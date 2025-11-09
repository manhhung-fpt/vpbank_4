# 🚀 DEPLOY TO NETLIFY GUIDE - VPBANK CREDIT SCORING

## 📋 Yêu cầu trước khi deploy

- ✅ Git repository (GitHub/GitLab/Bitbucket)
- ✅ Netlify account (miễn phí)
- ✅ Clerk account đã setup (cho authentication)
- ✅ OpenAI API key (cho AI features)
- ✅ Backend API đã deploy (hoặc dùng local)

---

## 🎯 PHẦN 1: CHUẨN BỊ PROJECT

### 1.1. Kiểm tra cấu hình build

Đảm bảo `package.json` có:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "export": "next export"
  }
}
```

### 1.2. Tạo file netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirect rules
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 1.3. Cập nhật next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Cho Netlify
  eslint: {
    ignoreDuringBuilds: true, // Optional: skip linting during build
  },
  typescript: {
    ignoreBuildErrors: false, // Khuyến nghị: false
  },
  images: {
    domains: ['img.clerk.com'], // Cho Clerk avatars
    unoptimized: true, // Cho Netlify
  },
};

export default nextConfig;
```

---

## 🌐 PHẦN 2: DEPLOY LÊN NETLIFY

### 2.1. Push code lên GitHub

```powershell
# Nếu chưa init git
git init
git add .
git commit -m "Initial commit for Netlify deployment"

# Tạo repo trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/vpbank_4.git
git branch -M main
git push -u origin main
```

### 2.2. Connect Netlify với GitHub

1. **Đăng nhập Netlify:** https://app.netlify.com/
2. **Click "Add new site"** → "Import an existing project"
3. **Chọn GitHub** → Authorize Netlify
4. **Chọn repository:** `vpbank_4`
5. **Configure site:**
   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: .next
   ```

### 2.3. Thêm Environment Variables

Trong Netlify Dashboard → Site settings → Environment variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/overview
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/overview

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend-api.herokuapp.com/api/v1

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_ORG=your-org
NEXT_PUBLIC_SENTRY_PROJECT=your-project

# Build config
NODE_VERSION=18
NPM_VERSION=9
```

### 2.4. Deploy

Click **"Deploy site"** → Netlify sẽ:
1. Clone repository
2. Install dependencies
3. Run build
4. Deploy

**Build time:** ~3-5 phút

---

## 🔧 PHẦN 3: DEPLOY BACKEND API

### Option 1: Deploy backend lên Railway (Khuyến nghị)

**Railway.app** - Dễ dùng, free tier tốt:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Init project
cd backend
railway init

# 4. Add environment variables
railway variables set OPENAI_API_KEY=sk-...
railway variables set DATABASE_URL=postgresql://...

# 5. Deploy
railway up
```

**Railway sẽ tạo URL:** `https://your-app.up.railway.app`

### Option 2: Deploy lên Render.com

1. Truy cập: https://render.com/
2. Connect GitHub repo
3. Create new **Web Service**
4. Configure:
   ```
   Name: vpbank-backend
   Environment: Python
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add environment variables
6. Deploy

### Option 3: Deploy lên Heroku

```bash
# 1. Install Heroku CLI
# Download: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
cd backend
heroku create vpbank-credit-scoring

# 4. Add buildpack
heroku buildpacks:set heroku/python

# 5. Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set DATABASE_URL=sqlite:///./credit_scoring.db

# 6. Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# 7. Deploy
git push heroku main
```

---

## 🔗 PHẦN 4: KẾT NỐI FRONTEND VÀ BACKEND

### 4.1. Cập nhật CORS trong backend

File `backend/core/config.py`:

```python
class Settings(BaseSettings):
    # ... other settings
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://vpbank-credit-scoring.netlify.app",  # Thêm Netlify URL
        "https://deploy-preview-*--vpbank-credit-scoring.netlify.app"  # Preview URLs
    ]
```

### 4.2. Cập nhật API URL trong Netlify

Netlify → Environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

### 4.3. Redeploy Netlify

Trigger new deploy để apply changes:
```bash
git commit --allow-empty -m "Trigger Netlify redeploy"
git push
```

---

## 🔐 PHẦN 5: CẤU HÌNH CLERK CHO PRODUCTION

### 5.1. Update Clerk Allowed Origins

Clerk Dashboard → Settings:

**Allowed origins:**
```
https://vpbank-credit-scoring.netlify.app
https://deploy-preview-*--vpbank-credit-scoring.netlify.app
```

**Redirect URLs:**
```
https://vpbank-credit-scoring.netlify.app/auth/sign-in
https://vpbank-credit-scoring.netlify.app/auth/sign-up
```

### 5.2. Switch to Production Keys (Optional)

Nếu muốn dùng production keys:

1. Clerk Dashboard → API Keys
2. Copy production keys (bắt đầu với `pk_live_` và `sk_live_`)
3. Update trong Netlify environment variables

---

## ✅ PHẦN 6: TESTING DEPLOYMENT

### 6.1. Kiểm tra Frontend

- ✅ Mở Netlify URL
- ✅ Test authentication (sign in/sign up)
- ✅ Test navigation giữa các pages
- ✅ Test responsive design

### 6.2. Kiểm tra API Connection

```javascript
// Test trong browser console
fetch('https://your-backend.railway.app/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

### 6.3. Kiểm tra Credit Scoring

1. Navigate to `/dashboard/credit-scoring`
2. Fill form
3. Submit
4. Check kết quả có hiển thị đúng

### 6.4. Kiểm tra Batch Scoring

1. Navigate to `/dashboard/batch-scoring`
2. Upload Excel file
3. Process
4. Check results

---

## 🐛 TROUBLESHOOTING

### Build Failed

**Lỗi:** `Type errors in production build`
```typescript
// next.config.ts
typescript: {
  ignoreBuildErrors: true, // Tạm thời ignore
}
```

**Lỗi:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### API Connection Failed

**Lỗi:** `CORS error`
- ✅ Check backend CORS settings
- ✅ Add Netlify URL vào allowed origins
- ✅ Restart backend

**Lỗi:** `Network error`
- ✅ Check `NEXT_PUBLIC_API_URL` đúng
- ✅ Verify backend đang chạy
- ✅ Check backend logs

### Authentication Issues

**Lỗi:** `Clerk session invalid`
- ✅ Clear browser cookies
- ✅ Check Clerk keys trong env variables
- ✅ Verify Clerk allowed origins

### Database Issues

**Lỗi:** `SQLite not supported in production`
- ❌ SQLite không hoạt động tốt trên Netlify/Railway
- ✅ Switch to PostgreSQL:

```python
# Update DATABASE_URL
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Update requirements.txt
# Remove: aiosqlite
# Add: asyncpg
```

---

## 📊 PHẦN 7: MONITORING & ANALYTICS

### 7.1. Netlify Analytics

Netlify Dashboard → Analytics (Paid feature)

### 7.2. Sentry Error Tracking

Already configured trong project!

Update Netlify env:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 7.3. Backend Monitoring

Railway/Render có built-in monitoring:
- CPU usage
- Memory usage
- Request logs
- Error rates

---

## 💰 COST ESTIMATE

### Free Tier Usage:

**Netlify:**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites

**Railway:**
- ✅ $5 free credit/month
- ✅ ~500 hours runtime

**Clerk:**
- ✅ 5,000 MAU free

**OpenAI:**
- 💵 Pay-as-you-go
- ~$0.002 per request

**Total:** ~$0-10/month cho development

---

## 🚀 PHẦN 8: CUSTOM DOMAIN (OPTIONAL)

### 8.1. Add Custom Domain

Netlify → Domain settings → Add custom domain:

```
vpbank-credit-scoring.com
```

### 8.2. Configure DNS

Point domain to Netlify:
```
CNAME: www → vpbank-credit-scoring.netlify.app
A: @ → 75.2.60.5 (Netlify IP)
```

### 8.3. Enable HTTPS

Netlify tự động provision SSL certificate (Let's Encrypt)

### 8.4. Update Clerk

Add custom domain vào Clerk allowed origins

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Git repository đã push
- [ ] Clerk keys đã setup
- [ ] Backend API đã deploy
- [ ] Environment variables đã config
- [ ] CORS settings đã update
- [ ] Build locally thành công
- [ ] Tests đều pass
- [ ] README.md đã update
- [ ] .env.example đã có

---

## 🎯 NEXT STEPS SAU KHI DEPLOY

1. **Setup CI/CD:**
   - Auto deploy khi push lên main
   - Preview deploys cho PRs

2. **Add Monitoring:**
   - Sentry cho errors
   - Analytics cho user behavior

3. **Performance Optimization:**
   - Enable Netlify CDN
   - Optimize images
   - Add caching headers

4. **Security:**
   - Add rate limiting
   - Enable 2FA cho Netlify
   - Review permissions

---

## 📞 SUPPORT

**Netlify Issues:**
- Docs: https://docs.netlify.com/
- Community: https://answers.netlify.com/

**Railway Issues:**
- Docs: https://docs.railway.app/
- Discord: https://discord.gg/railway

**Project Issues:**
- GitHub: https://github.com/manhhung-fpt/vpbank_4/issues

---

**Good luck với deployment! 🚀🎉**

Sau khi deploy xong, share link để team test nhé! 😊
