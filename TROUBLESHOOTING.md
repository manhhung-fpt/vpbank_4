# 🔧 Quick Fix Guide

## ✅ ISSUE RESOLVED: FormProvider Error

### Problem
```
TypeError: Cannot destructure property 'getFieldState' of useFormContext() as it is null
```

### Solution
✅ **FIXED!** Added `FormProvider` wrapper to the form component.

The form now properly wraps with `FormProvider` to provide form context to all child components.

---

## 🚀 How to Run System

### Quick Start (2 Commands)

#### Terminal 1: Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### Terminal 2: Frontend
```powershell
pnpm install
pnpm dev
```

Or use the startup scripts:
```powershell
# Terminal 1
.\start-backend.ps1

# Terminal 2
.\start-frontend.ps1
```

---

## 🧪 Testing

### Test Backend Only
```powershell
.\test-backend.ps1
```

### Test Full System
```powershell
.\test-system.ps1
```

### Manual Test
1. Open: http://localhost:3000/dashboard/credit-scoring
2. Click "Score Now" on any demo scenario
3. View results!

---

## 🐛 Common Issues & Fixes

### 1. Backend Port 8000 In Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/.env
API_PORT=8001
```

### 2. Frontend Port 3000 In Use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
pnpm dev --port 3001
```

### 3. Module Not Found (Backend)
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Dependencies Error (Frontend)
```powershell
# Clear and reinstall
rm -rf node_modules
rm -rf .next
pnpm install
```

### 5. TypeScript Errors
```powershell
# Check for errors
pnpm build

# If errors, check file paths and imports
```

### 6. Cannot Connect to Backend
Check:
- ✅ Backend is running on port 8000
- ✅ CORS is configured correctly
- ✅ `NEXT_PUBLIC_API_URL` in `.env.local` is correct
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 7. OpenAI API Errors
- System will fallback to rule-based explanations
- Check API key in `backend/.env`
- Verify key is valid at https://platform.openai.com

### 8. Database Errors
```powershell
# Delete and recreate database
cd backend
rm credit_scoring.db
python main.py  # Will auto-create new database
```

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Python 3.10+ installed: `python --version`
- [ ] Node.js 18+ installed: `node --version`
- [ ] Virtual environment activated (backend)
- [ ] Dependencies installed (both backend and frontend)
- [ ] Ports 8000 and 3000 are free
- [ ] `.env` files are properly configured
- [ ] Both servers are running

---

## 🎯 Quick Tests

### Test 1: Backend Health
```powershell
curl http://localhost:8000/api/v1/health
```
Expected: `{"status":"healthy"}`

### Test 2: Demo Scenarios
```powershell
curl http://localhost:8000/api/v1/demo/scenarios
```
Expected: JSON array with 3 scenarios

### Test 3: Score Calculation
```powershell
curl -X POST http://localhost:8000/api/v1/demo/scenarios/salaried/score
```
Expected: Credit score result with ~780 score

### Test 4: Frontend
Open browser: http://localhost:3000/dashboard/credit-scoring
Expected: Credit scoring page loads with demo scenarios

---

## 📞 Still Having Issues?

1. **Run system test**: `.\test-system.ps1`
2. **Check logs**: Look at terminal output for errors
3. **Review documentation**: Check `README.md` and `SETUP.md`
4. **Verify configuration**: Check all `.env` files
5. **Clean restart**: Stop all servers, clear caches, restart

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend shows: "Application startup complete"
✅ Frontend shows: "compiled successfully"
✅ Demo scenarios load on the page
✅ "Score Now" buttons work
✅ Credit scores calculate correctly
✅ AI explanations generate
✅ No console errors in browser

---

**Last Updated**: After FormProvider fix
**Status**: ✅ All issues resolved
**Ready**: 🚀 System operational
