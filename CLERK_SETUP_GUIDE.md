# 🔐 CLERK AUTHENTICATION SETUP GUIDE

## Lỗi: Missing publishableKey

Nếu bạn gặp lỗi này, có 3 giải pháp:

---

## ✅ **Giải pháp 1: Cấu hình Clerk (Khuyến nghị)**

### Bước 1: Tạo tài khoản Clerk
1. Truy cập: https://clerk.com/
2. Click "Start building for free"
3. Đăng nhập bằng GitHub/Google hoặc email

### Bước 2: Tạo Application
1. Dashboard → "Create application"
2. Chọn tên: "VPBank Credit Scoring"
3. Chọn authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ Phone (optional)
4. Click "Create application"

### Bước 3: Copy API Keys
1. Vào phần "API Keys" trong dashboard
2. Copy 2 keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Bước 4: Cập nhật .env.local
Mở file `.env.local` và thay thế:

```bash
# Before
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# After
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dGVzdC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_4iJKQsxL6Vwrr4hTrGCJRdVnBNmQ7Sk8p3YqP0Zx9y
```

### Bước 5: Restart server
```powershell
# Dừng server (Ctrl + C)
npm run dev
```

### Bước 6: Configure Domains (cho Production)
1. Dashboard → "Domains"
2. Thêm domain của bạn:
   - Development: `http://localhost:3000`
   - Production: `https://your-app.netlify.app`

---

## ⚡ **Giải pháp 2: Bypass Authentication (Development Only)**

Nếu bạn chỉ muốn test tính năng không cần đăng nhập:

### Tạo mock authentication
```typescript
// src/components/layout/providers.tsx
'use client';
import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }) {
  // Tạm thời skip Clerk trong dev mode
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
```

### Comment out auth middleware
```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Tạm thời disable trong dev
export default clerkMiddleware((auth, req) => {
  if (process.env.NODE_ENV === 'development') {
    return; // Skip auth check
  }
  
  // ... rest of code
});
```

⚠️ **CHÚ Ý:** Chỉ dùng trong development, không deploy lên production!

---

## 🌐 **Giải pháp 3: Deploy lên Netlify với Clerk**

### Bước 1: Setup Clerk như Giải pháp 1

### Bước 2: Configure Netlify Environment Variables
1. Netlify Dashboard → Site settings → Environment variables
2. Thêm các biến:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/overview
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/overview
   ```

### Bước 3: Update Clerk Allowed Origins
1. Clerk Dashboard → Settings → Sessions
2. Thêm Netlify URL vào "Allowed origins":
   ```
   https://your-app.netlify.app
   https://your-app--preview.netlify.app
   ```

### Bước 4: Redeploy
```bash
git push
# Netlify sẽ tự động deploy
```

---

## 🔍 **Troubleshooting**

### Lỗi: "Invalid publishableKey"
- ✅ Check key bắt đầu bằng `pk_test_` hoặc `pk_live_`
- ✅ Không có dấu cách thừa
- ✅ Đã restart server

### Lỗi: "Clerk: API request failed"
- ✅ Check internet connection
- ✅ Verify `CLERK_SECRET_KEY` đúng
- ✅ Check Clerk dashboard cho errors

### Lỗi: "Redirect URL not allowed"
- ✅ Add URL vào Clerk Dashboard → Settings → URLs
- ✅ Check CORS settings

### Development không load
- ✅ Clear browser cache
- ✅ Clear Next.js cache: `rm -rf .next`
- ✅ Reinstall dependencies: `npm install`

---

## 📚 **Clerk Features được sử dụng**

Project này sử dụng:
- ✅ Email/Password authentication
- ✅ Social OAuth (Google, GitHub)
- ✅ User management
- ✅ Session management
- ✅ Protected routes
- ✅ Dark/Light theme support

---

## 🎯 **Next Steps**

Sau khi setup Clerk:

1. **Customize Sign-in page:**
   ```
   src/features/auth/components/sign-in-view.tsx
   ```

2. **Customize Sign-up page:**
   ```
   src/features/auth/components/sign-up-view.tsx
   ```

3. **Protected routes:**
   ```
   src/middleware.ts
   ```

4. **User profile:**
   ```
   src/app/dashboard/profile/
   ```

---

## 💡 **Tips**

- 🆓 Clerk có free tier: 5,000 MAU (Monthly Active Users)
- 🔒 Tất cả data được encrypt
- 🌍 Hỗ trợ multi-factor authentication
- 📱 Responsive trên mobile
- 🎨 Tích hợp sẵn Dark mode

---

## 📞 **Support**

- Clerk Docs: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Project Issues: https://github.com/manhhung-fpt/vpbank_4/issues

---

**Happy coding! 🚀**
