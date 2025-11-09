# AI/ML Enhanced Credit Scoring System 🚀

A full-stack intelligent credit scoring system powered by AI/ML technologies, featuring XGBoost machine learning models and OpenAI GPT for explainable credit assessments.

## 🎯 Features

- **AI-Powered Credit Scoring**: XGBoost ML model for accurate credit score calculation (300-850 range)
- **Batch Credit Scoring**: Upload and analyze multiple applications at once (CSV, Excel, JSON)
- **Explainable AI**: OpenAI GPT-3.5 generates human-readable explanations for credit decisions
- **Risk Assessment**: Automatic categorization into Low/Medium/High/Very High risk
- **Key Factors Analysis**: Detailed breakdown of factors affecting credit score
- **Demo Scenarios**: 3 pre-configured test cases for quick evaluation
- **Export Results**: Download batch analysis results as CSV
- **Modern UI**: Beautiful, responsive dashboard built with Next.js 15 and Tailwind CSS
- **Real-time Processing**: Fast credit score calculation and AI explanation generation

## 🏗️ Architecture

### Frontend (Next.js 15 + TypeScript)
- **Framework**: Next.js 15 with App Router
- **UI**: Shadcn/ui + Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State**: React hooks and Zustand
- **Auth**: Clerk authentication

### Backend (FastAPI + Python)
- **Framework**: FastAPI with async support
- **ML Model**: XGBoost for credit scoring
- **AI**: OpenAI GPT-3.5 for explanations
- **Database**: SQLite with SQLAlchemy
- **Validation**: Pydantic schemas

## 📦 Tech Stack

### Frontend
- Next.js 15.3.2
- React 19
- TypeScript 5.7
- Tailwind CSS 4.0
- Shadcn/ui
- React Hook Form + Zod
- Lucide Icons

### Backend
- FastAPI 0.115.0
- XGBoost 2.1.1
- OpenAI 1.54.3
- SQLAlchemy 2.0.35
- Pydantic 2.9.2
- Python 3.10+

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- pnpm or npm (for frontend package management)
- pip (for backend package management)

### 1. Clone Repository
```bash
git clone https://github.com/manhhung-fpt/vpbank_4.git
cd vpbank_4
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (add your OpenAI API key)
# Edit .env file and add:
# OPENAI_API_KEY=your_openai_api_key_here

# Run backend server
python main.py
```

Backend will start at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### 3. Setup Frontend

```bash
# Open new terminal, navigate to project root
cd vpbank_4

# Install dependencies
pnpm install
# or
npm install

# Configure environment
# .env.local is already configured with default values

# Run development server
pnpm dev
# or
npm run dev
```

Frontend will start at `http://localhost:3000`

## 🎪 Demo Scenarios

The system includes 3 pre-configured scenarios for testing:

### 1. 👨‍💼 Salaried Employee (Score: ~780 - Low Risk)
- **Profile**: 35 years old, stable employment
- **Income**: 800M VND/year (~$33k USD)
- **Employment**: 8 years as salaried employee
- **Credit History**: 96 months (8 years)
- **Result**: Excellent credit profile, high approval probability

### 2. 💼 Freelancer (Score: ~625 - Medium Risk)
- **Profile**: 28 years old, freelance work
- **Income**: 450M VND/year (~$18.7k USD)
- **Employment**: 4 years freelancing
- **Credit History**: 48 months (4 years)
- **Result**: Good credit profile, moderate approval chance

### 3. 🎓 New to Bank (Score: ~450 - High Risk)
- **Profile**: 23 years old, recent graduate
- **Income**: 300M VND/year (~$12.5k USD)
- **Employment**: 1 year salaried
- **Credit History**: 12 months (1 year)
- **Result**: Limited history, needs improvement

## 📊 API Endpoints

### Credit Scoring
```bash
# Calculate credit score
POST /api/v1/credit/score
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyen.vana@example.com",
  "age": 35,
  "employment_type": "Salaried",
  "annual_income": 800000000,
  "years_employed": 8,
  "existing_loans": 1,
  "credit_history_length": 96,
  "has_bank_account": true,
  "monthly_expenses": 25000000,
  "loan_amount": 200000000,
  "loan_purpose": "Home improvement"
}
```

### Demo Scenarios
```bash
# Get all demo scenarios
GET /api/v1/demo/scenarios

# Score specific demo scenario
POST /api/v1/demo/scenarios/salaried/score
```

### Application Management
```bash
# Get application by ID
GET /api/v1/applications/{id}

# List all applications
GET /api/v1/applications?skip=0&limit=10
```

## 🎨 UI Components

### Main Pages
- **Credit Scoring Dashboard**: `/dashboard/credit-scoring`
- **Application Form**: Multi-step form with validation
- **Results Display**: Score gauge, risk category, approval probability
- **AI Explanation**: Strengths, concerns, recommendations
- **Key Factors**: Visual breakdown of score factors

### Features
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Real-time form validation
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Demo scenario quick-load
- ✅ Smooth scrolling to results

## 🔐 Environment Variables

### Frontend (.env.local)
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

### Backend (.env)
```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Database
DATABASE_URL=sqlite+aiosqlite:///./credit_scoring.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

## 📁 Project Structure

```
vpbank_4/
├── backend/                    # FastAPI Backend
│   ├── main.py                # Application entry
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment config
│   ├── core/
│   │   └── config.py         # Settings
│   ├── database/
│   │   ├── db.py             # Database connection
│   │   └── models.py         # SQLAlchemy models
│   ├── api/
│   │   ├── routes.py         # API endpoints
│   │   └── schemas.py        # Pydantic schemas
│   └── services/
│       ├── credit_scoring.py # XGBoost model
│       ├── ai_explainer.py   # OpenAI integration
│       └── demo_scenarios.py # Test scenarios
│
├── src/                       # Next.js Frontend
│   ├── app/                   # App Router
│   │   └── dashboard/
│   │       └── credit-scoring/
│   │           └── page.tsx   # Main page
│   ├── features/
│   │   └── credit-scoring/
│   │       ├── components/    # React components
│   │       ├── api/          # API client
│   │       ├── types/        # TypeScript types
│   │       └── utils/        # Utilities
│   ├── components/           # Shared components
│   └── lib/                  # Utilities
│
└── README.md                 # This file
```

## 🧪 Testing

### Test Backend
```bash
cd backend
python main.py

# Visit http://localhost:8000/docs
# Try demo scenarios via Swagger UI
```

### Test Frontend
```bash
pnpm dev

# Visit http://localhost:3000/dashboard/credit-scoring
# Try demo scenarios by clicking "Score Now" buttons
```

## 🔧 Development

### Adding New Features
1. **Backend**: Add routes in `backend/api/routes.py`
2. **Frontend**: Add components in `src/features/credit-scoring/components/`
3. **Types**: Update types in `src/features/credit-scoring/types/`

### Modifying ML Model
Edit `backend/services/credit_scoring.py` to adjust:
- Feature weights
- Score calculation logic
- Risk thresholds

### Customizing AI Explanations
Edit `backend/services/ai_explainer.py` to modify:
- OpenAI prompts
- Explanation format
- Fallback logic

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Author

**Manh Hung**
- GitHub: [@manhhung-fpt](https://github.com/manhhung-fpt)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check API documentation at `/docs`

---

**Built with ❤️ using Next.js, FastAPI, XGBoost, and OpenAI GPT**
