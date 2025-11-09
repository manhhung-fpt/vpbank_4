# AI/ML Enhanced Credit Scoring System - Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure OpenAI API Key
Edit `backend\.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Don't have an OpenAI API key?** No problem! The system will work with rule-based explanations instead of AI-generated ones.

### Step 3: Start Backend Server
```powershell
cd backend
python main.py
```

Backend runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Step 4: Install Frontend Dependencies (New Terminal)
```powershell
cd vpbank_4
pnpm install
```

### Step 5: Start Frontend
```powershell
pnpm dev
```

Frontend runs at: http://localhost:3000

## 🎯 Quick Test

1. Open http://localhost:3000/dashboard/credit-scoring
2. Click "Score Now" on any demo scenario
3. View instant credit score results with AI explanations!

## 📊 Demo Scenarios

Try these 3 scenarios:
- 👨‍💼 **Salaried Employee** → Score ~780 (Low Risk)
- 💼 **Freelancer** → Score ~625 (Medium Risk)
- 🎓 **New to Bank** → Score ~450 (High Risk)

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change `API_PORT` in `backend\.env`
- **OpenAI errors**: System falls back to rule-based explanations
- **Database errors**: Delete `backend\credit_scoring.db` and restart

### Frontend Issues
- **Can't connect to API**: Check backend is running on port 8000
- **Build errors**: Run `pnpm install` again
- **Port 3000 in use**: Stop other Next.js apps or change port

## 📚 Next Steps

1. **Customize ML Model**: Edit `backend\services\credit_scoring.py`
2. **Modify UI**: Update components in `src\features\credit-scoring\components\`
3. **Add Features**: Extend API routes in `backend\api\routes.py`

## 🔑 Environment Variables

### Required
- `OPENAI_API_KEY` (backend) - Optional, enables AI explanations

### Optional
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - For authentication
- `CLERK_SECRET_KEY` - For authentication
- `NEXT_PUBLIC_SENTRY_DSN` - For error tracking

## 📞 Need Help?

- Check `/docs` for API documentation
- See README.md for detailed information
- Open GitHub issue for bugs

---

**Ready to go!** 🎉
