# API Testing with Postman/Thunder Client

## Base URL
```
http://localhost:8000/api/v1
```

---

## 1. Health Check

### GET /health
```http
GET http://localhost:8000/api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "credit-scoring-api",
  "timestamp": "2025-10-10T10:00:00.000Z"
}
```

---

## 2. Calculate Credit Score

### POST /credit/score

```http
POST http://localhost:8000/api/v1/credit/score
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyen.vana@example.com",
  "phone": "+84901234567",
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

**Response:**
```json
{
  "application_id": 1,
  "applicant_name": "Nguyễn Văn A",
  "credit_score_result": {
    "credit_score": 780,
    "risk_category": "Low",
    "approval_probability": 0.95,
    "key_factors": [
      {
        "factor": "Employment Status",
        "impact": "Positive",
        "score": 90,
        "description": "Employment score: 90/100"
      },
      // ... more factors
    ],
    "recommendation": "Excellent credit profile. High approval probability."
  },
  "ai_explanation": {
    "summary": "Your credit score is 780/850...",
    "strengths": ["Strong employment status", "..."],
    "concerns": ["..."],
    "recommendations": ["..."],
    "detailed_analysis": "..."
  },
  "created_at": "2025-10-10T10:00:00.000Z"
}
```

---

## 3. Get Demo Scenarios

### GET /demo/scenarios

```http
GET http://localhost:8000/api/v1/demo/scenarios
```

**Response:**
```json
[
  {
    "scenario_name": "Salaried Employee - Low Risk",
    "description": "35-year-old salaried employee...",
    "data": {
      "name": "Nguyễn Văn A",
      // ... complete application data
    }
  },
  // ... more scenarios
]
```

---

## 4. Get Specific Demo Scenario

### GET /demo/scenarios/{scenario_name}

```http
GET http://localhost:8000/api/v1/demo/scenarios/salaried
```

Available scenarios:
- `salaried` - Salaried Employee
- `freelancer` - Freelancer
- `new-to-bank` - New to Bank

---

## 5. Score Demo Scenario

### POST /demo/scenarios/{scenario_name}/score

```http
POST http://localhost:8000/api/v1/demo/scenarios/salaried/score
```

Returns same response as `/credit/score`

---

## 6. Get Application by ID

### GET /applications/{id}

```http
GET http://localhost:8000/api/v1/applications/1
```

---

## 7. List All Applications

### GET /applications

```http
GET http://localhost:8000/api/v1/applications?skip=0&limit=10
```

**Query Parameters:**
- `skip` (optional, default: 0) - Number of records to skip
- `limit` (optional, default: 10) - Number of records to return

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "nguyen.vana@example.com",
    "credit_score": 780,
    "risk_category": "Low",
    "loan_amount": 200000000,
    "created_at": "2025-10-10T10:00:00.000Z"
  },
  // ... more applications
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 404 Not Found
```json
{
  "detail": "Application 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error calculating credit score: ..."
}
```

---

## cURL Examples

### Calculate Credit Score
```bash
curl -X POST "http://localhost:8000/api/v1/credit/score" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 30,
    "employment_type": "Salaried",
    "annual_income": 500000000,
    "years_employed": 5,
    "existing_loans": 0,
    "credit_history_length": 60,
    "has_bank_account": true,
    "monthly_expenses": 20000000,
    "loan_amount": 150000000
  }'
```

### Score Demo Scenario
```bash
curl -X POST "http://localhost:8000/api/v1/demo/scenarios/salaried/score"
```

### Get All Applications
```bash
curl "http://localhost:8000/api/v1/applications?skip=0&limit=5"
```

---

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "Credit Scoring API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Calculate Credit Score",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"age\": 30,\n  \"employment_type\": \"Salaried\",\n  \"annual_income\": 500000000,\n  \"years_employed\": 5,\n  \"existing_loans\": 0,\n  \"credit_history_length\": 60,\n  \"has_bank_account\": true,\n  \"monthly_expenses\": 20000000,\n  \"loan_amount\": 150000000\n}"
        },
        "url": {
          "raw": "http://localhost:8000/api/v1/credit/score",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "v1", "credit", "score"]
        }
      }
    }
  ]
}
```
