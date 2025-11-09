# AI/ML Enhanced Credit Scoring System - Backend

FastAPI backend with XGBoost ML model and OpenAI GPT integration for intelligent credit scoring.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env` and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run Server
```bash
python main.py
```

Server will start at `http://localhost:8000`

### 4. API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📊 Demo Scenarios

The system includes 3 pre-configured scenarios:

### 1. Salaried Employee (Score: ~780)
- 35 years old, stable employment
- 800M VND annual income
- 8 years credit history
- **Risk: LOW**

### 2. Freelancer (Score: ~625)
- 28 years old, freelance work
- 450M VND annual income
- 4 years credit history
- **Risk: MEDIUM**

### 3. New to Bank (Score: ~450)
- 23 years old, recent graduate
- 300M VND annual income
- 1 year credit history
- **Risk: HIGH**

## 🔌 API Endpoints

### Calculate Credit Score
```bash
POST /api/v1/credit/score
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
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

### Get Demo Scenarios
```bash
GET /api/v1/demo/scenarios
```

### Test Demo Scenario
```bash
POST /api/v1/demo/scenarios/salaried/score
```

## 🧠 Features

- **XGBoost ML Model**: Advanced credit scoring algorithm
- **OpenAI GPT Integration**: AI-powered explanations
- **SQLite Database**: Persistent storage
- **3 Demo Scenarios**: Pre-configured test cases
- **Comprehensive API**: RESTful endpoints
- **Auto Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
├── core/
│   └── config.py       # Configuration settings
├── database/
│   ├── db.py           # Database connection
│   └── models.py       # SQLAlchemy models
├── api/
│   ├── routes.py       # API endpoints
│   └── schemas.py      # Pydantic schemas
└── services/
    ├── credit_scoring.py    # XGBoost scoring
    ├── ai_explainer.py      # OpenAI integration
    └── demo_scenarios.py    # Test scenarios
```

## 🛠️ Tech Stack

- **FastAPI**: Modern Python web framework
- **XGBoost**: Machine learning library
- **OpenAI GPT-3.5**: AI explanations
- **SQLAlchemy**: ORM
- **Pydantic**: Data validation
- **SQLite**: Database

## 📝 License

MIT
