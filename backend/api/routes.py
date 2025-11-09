"""
API Routes for Credit Scoring System
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import json
import csv
import io
from datetime import datetime

from database.db import get_db
from database.models import CreditApplication
from api.schemas import (
    CreditApplicationRequest,
    CreditApplicationResponse,
    CreditScoreResult,
    AIExplanation,
    DemoScenario,
    HealthCheck,
    BatchAnalysisResponse,
    BatchScoreResult,
    BatchSummary,
    RiskCategory
)
from services.credit_scoring import CreditScoringService
from services.ai_explainer import AIExplainerService
from services.demo_scenarios import get_demo_scenarios, get_scenario_by_name

router = APIRouter()

# Initialize services
credit_scorer = CreditScoringService()
ai_explainer = AIExplainerService()


@router.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        service="credit-scoring-api",
        timestamp=datetime.now()
    )


@router.post("/credit/score", response_model=CreditApplicationResponse, status_code=status.HTTP_201_CREATED)
async def calculate_credit_score(
    application: CreditApplicationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Calculate credit score for an application
    
    This endpoint:
    1. Validates the application data
    2. Calculates credit score using XGBoost model
    3. Generates AI explanation using OpenAI GPT
    4. Saves results to database
    5. Returns comprehensive response
    """
    try:
        # Calculate credit score
        credit_score, risk_category, approval_probability, key_factors = \
            credit_scorer.calculate_credit_score(application)
        
        # Generate AI explanation
        ai_explanation = await ai_explainer.generate_explanation(
            application=application,
            credit_score=credit_score,
            risk_category=risk_category,
            approval_probability=approval_probability,
            key_factors=key_factors
        )
        
        # Determine recommendation
        if credit_score >= 750:
            recommendation = "Excellent credit profile. High approval probability."
        elif credit_score >= 650:
            recommendation = "Good credit profile. Likely to be approved with standard terms."
        elif credit_score >= 550:
            recommendation = "Fair credit profile. May require additional documentation or higher interest rate."
        else:
            recommendation = "Credit profile needs improvement. Consider strengthening financial position before reapplying."
        
        # Save to database
        db_application = CreditApplication(
            name=application.name,
            email=application.email,
            phone=application.phone,
            age=application.age,
            employment_type=application.employment_type.value,
            annual_income=application.annual_income,
            years_employed=application.years_employed,
            existing_loans=application.existing_loans,
            credit_history_length=application.credit_history_length,
            has_bank_account=application.has_bank_account,
            monthly_expenses=application.monthly_expenses,
            loan_amount=application.loan_amount,
            loan_purpose=application.loan_purpose,
            credit_score=credit_score,
            risk_category=risk_category.value,
            approval_probability=approval_probability,
            ai_explanation=json.dumps(ai_explanation.dict()),
            key_factors=json.dumps(key_factors)
        )
        
        db.add(db_application)
        await db.commit()
        await db.refresh(db_application)
        
        # Build response
        response = CreditApplicationResponse(
            application_id=db_application.id,
            applicant_name=application.name,
            credit_score_result=CreditScoreResult(
                credit_score=credit_score,
                risk_category=risk_category,
                approval_probability=approval_probability,
                key_factors=key_factors,
                recommendation=recommendation
            ),
            ai_explanation=ai_explanation,
            created_at=db_application.created_at
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating credit score: {str(e)}"
        )


@router.get("/demo/scenarios", response_model=List[DemoScenario])
async def get_available_demo_scenarios():
    """
    Get all available demo scenarios
    
    Returns pre-configured test cases:
    - Salaried Employee (High Score ~780)
    - Freelancer (Medium Score ~625)
    - New to Bank (Low Score ~450)
    """
    return get_demo_scenarios()


@router.get("/demo/scenarios/{scenario_name}", response_model=DemoScenario)
async def get_demo_scenario(scenario_name: str):
    """
    Get specific demo scenario
    
    Available scenarios:
    - salaried: Salaried employee with excellent credit
    - freelancer: Freelancer with moderate credit
    - new-to-bank: New customer with limited history
    """
    return get_scenario_by_name(scenario_name)


@router.post("/demo/scenarios/{scenario_name}/score", response_model=CreditApplicationResponse)
async def score_demo_scenario(
    scenario_name: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Calculate credit score for a demo scenario
    
    Convenient endpoint to test with pre-configured scenarios
    """
    scenario = get_scenario_by_name(scenario_name)
    return await calculate_credit_score(scenario.data, db)


@router.get("/applications/{application_id}", response_model=CreditApplicationResponse)
async def get_application(
    application_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get credit application by ID"""
    from sqlalchemy import select
    
    result = await db.execute(
        select(CreditApplication).where(CreditApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application {application_id} not found"
        )
    
    # Parse stored JSON data
    ai_explanation = AIExplanation(**json.loads(application.ai_explanation))
    key_factors = json.loads(application.key_factors)
    
    return CreditApplicationResponse(
        application_id=application.id,
        applicant_name=application.name,
        credit_score_result=CreditScoreResult(
            credit_score=application.credit_score,
            risk_category=application.risk_category,
            approval_probability=application.approval_probability,
            key_factors=key_factors,
            recommendation=f"Risk category: {application.risk_category}"
        ),
        ai_explanation=ai_explanation,
        created_at=application.created_at
    )


@router.get("/applications", response_model=List[dict])
async def list_applications(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """List all credit applications"""
    from sqlalchemy import select, desc
    
    result = await db.execute(
        select(CreditApplication)
        .order_by(desc(CreditApplication.created_at))
        .offset(skip)
        .limit(limit)
    )
    applications = result.scalars().all()
    
    return [
        {
            "id": app.id,
            "name": app.name,
            "email": app.email,
            "credit_score": app.credit_score,
            "risk_category": app.risk_category,
            "loan_amount": app.loan_amount,
            "created_at": app.created_at
        }
        for app in applications
    ]


@router.post("/credit/batch-score", response_model=BatchAnalysisResponse)
async def batch_credit_score(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Batch credit scoring from uploaded file
    
    Supports CSV, Excel (XLSX, XLS), and JSON formats
    Expected columns/fields:
    - name, email, phone, age, employment_type, annual_income, years_employed
    - existing_loans, credit_history_length, has_bank_account, monthly_expenses
    - loan_amount, loan_purpose
    """
    try:
        # Read file content
        content = await file.read()
        
        # Parse based on file type
        applications = []
        if file.filename.endswith('.csv'):
            applications = _parse_csv(content)
        elif file.filename.endswith(('.xlsx', '.xls')):
            applications = _parse_excel(content)
        elif file.filename.endswith('.json'):
            applications = _parse_json(content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload CSV, Excel, or JSON file."
            )
        
        if not applications:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid applications found in file"
            )
        
        # Process each application
        results = []
        total = len(applications)
        success = 0
        failed = 0
        
        total_loan_amount = 0
        risk_counts = {"High": 0, "Medium": 0, "Low": 0}
        total_score = 0
        approved_count = 0
        
        for idx, app_data in enumerate(applications):
            try:
                # Create application request
                application = CreditApplicationRequest(**app_data)
                
                # Calculate credit score
                credit_score, risk_category, approval_probability, key_factors = \
                    credit_scorer.calculate_credit_score(application)
                
                # Determine recommendation
                if approval_probability >= 0.7:
                    recommendation = "Approve"
                elif approval_probability >= 0.4:
                    recommendation = "Manual Review"
                else:
                    recommendation = "Reject"
                
                # Save to database
                db_application = CreditApplication(
                    name=application.name,
                    email=application.email,
                    phone=application.phone,
                    age=application.age,
                    employment_type=application.employment_type.value,
                    annual_income=application.annual_income,
                    years_employed=application.years_employed,
                    existing_loans=application.existing_loans,
                    credit_history_length=application.credit_history_length,
                    has_bank_account=application.has_bank_account,
                    monthly_expenses=application.monthly_expenses,
                    loan_amount=application.loan_amount,
                    loan_purpose=application.loan_purpose or "",
                    credit_score=credit_score,
                    risk_category=risk_category.value,
                    approval_probability=approval_probability,
                    key_factors=json.dumps(key_factors),
                    ai_explanation=json.dumps({"summary": "Batch processed"})
                )
                
                db.add(db_application)
                await db.flush()
                
                # Add to results
                result = BatchScoreResult(
                    application_id=str(db_application.id or idx),
                    name=application.name,
                    credit_score=credit_score,
                    risk_category=risk_category,
                    approval_probability=approval_probability,
                    recommendation=recommendation,
                    key_factors=key_factors
                )
                results.append(result)
                
                # Update statistics
                success += 1
                total_score += credit_score
                total_loan_amount += application.loan_amount
                risk_counts[risk_category.value] += 1
                if recommendation == "Approve":
                    approved_count += 1
                    
            except Exception as e:
                failed += 1
                # Continue processing other applications
                continue
        
        await db.commit()
        
        # Calculate summary
        avg_score = total_score / success if success > 0 else 0
        summary = BatchSummary(
            average_score=avg_score,
            high_risk_count=risk_counts["High"],
            medium_risk_count=risk_counts["Medium"],
            low_risk_count=risk_counts["Low"],
            total_loan_amount=total_loan_amount,
            recommended_approvals=approved_count
        )
        
        return BatchAnalysisResponse(
            total_applications=total,
            processed=success + failed,
            success=success,
            failed=failed,
            results=results,
            summary=summary,
            timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing batch file: {str(e)}"
        )


@router.get("/credit/batch-template")
async def download_batch_template():
    """
    Download CSV template with sample data for batch upload
    """
    # Sample data with 3 examples
    sample_data = [
        {
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "phone": "+84123456789",
            "age": 35,
            "employment_type": "Salaried",
            "annual_income": 800000000,
            "years_employed": 8,
            "existing_loans": 1,
            "credit_history_length": 96,
            "has_bank_account": True,
            "monthly_expenses": 30000000,
            "loan_amount": 200000000,
            "loan_purpose": "Home improvement"
        },
        {
            "name": "Trần Thị B",
            "email": "tranthib@example.com",
            "phone": "+84987654321",
            "age": 28,
            "employment_type": "Freelancer",
            "annual_income": 450000000,
            "years_employed": 4,
            "existing_loans": 0,
            "credit_history_length": 48,
            "has_bank_account": True,
            "monthly_expenses": 20000000,
            "loan_amount": 100000000,
            "loan_purpose": "Business expansion"
        },
        {
            "name": "Lê Văn C",
            "email": "levanc@example.com",
            "phone": "+84912345678",
            "age": 22,
            "employment_type": "Student",
            "annual_income": 150000000,
            "years_employed": 1,
            "existing_loans": 0,
            "credit_history_length": 12,
            "has_bank_account": True,
            "monthly_expenses": 10000000,
            "loan_amount": 50000000,
            "loan_purpose": "Education"
        }
    ]
    
    # Create CSV
    output = io.StringIO()
    if sample_data:
        writer = csv.DictWriter(output, fieldnames=sample_data[0].keys())
        writer.writeheader()
        writer.writerows(sample_data)
    
    # Create response
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=credit_application_template.csv"
        }
    )


def _parse_csv(content: bytes) -> List[dict]:
    """Parse CSV file content"""
    text = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(text))
    applications = []
    
    for row in reader:
        app = _normalize_application_data(row)
        if app:
            applications.append(app)
    
    return applications


def _parse_excel(content: bytes) -> List[dict]:
    """Parse Excel file content"""
    try:
        import pandas as pd
        df = pd.read_excel(io.BytesIO(content))
        applications = []
        
        for _, row in df.iterrows():
            app = _normalize_application_data(row.to_dict())
            if app:
                applications.append(app)
        
        return applications
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Excel support not available. Please install openpyxl: pip install openpyxl"
        )


def _parse_json(content: bytes) -> List[dict]:
    """Parse JSON file content"""
    data = json.loads(content.decode('utf-8'))
    
    if isinstance(data, list):
        return [_normalize_application_data(item) for item in data]
    elif isinstance(data, dict):
        return [_normalize_application_data(data)]
    else:
        return []


def _normalize_application_data(row: dict) -> dict:
    """Normalize and validate application data from file"""
    try:
        # Convert string booleans
        if isinstance(row.get('has_bank_account'), str):
            row['has_bank_account'] = row['has_bank_account'].lower() in ('true', '1', 'yes')
        
        # Convert numeric fields
        numeric_fields = [
            'age', 'annual_income', 'years_employed', 'existing_loans',
            'credit_history_length', 'monthly_expenses', 'loan_amount'
        ]
        for field in numeric_fields:
            if field in row and row[field]:
                try:
                    if field in ['age', 'years_employed', 'existing_loans', 'credit_history_length']:
                        row[field] = int(float(row[field]))
                    else:
                        row[field] = float(row[field])
                except (ValueError, TypeError):
                    pass
        
        return row
    except Exception:
        return None
