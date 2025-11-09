"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class EmploymentType(str, Enum):
    SALARIED = "Salaried"
    FREELANCER = "Freelancer"
    SELF_EMPLOYED = "Self-Employed"
    UNEMPLOYED = "Unemployed"
    STUDENT = "Student"


class SocialActivityLevel(str, Enum):
    """Social media activity level"""
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class RiskCategory(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    VERY_HIGH = "Very High"


class BatchScoreResult(BaseModel):
    """Single result in batch scoring"""
    application_id: str
    name: str
    credit_score: int
    risk_category: RiskCategory
    approval_probability: float
    recommendation: str
    key_factors: List[Dict[str, Any]]


class BatchSummary(BaseModel):
    """Summary statistics for batch analysis"""
    average_score: float
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    total_loan_amount: float
    recommended_approvals: int


class BatchAnalysisResponse(BaseModel):
    """Response for batch credit scoring"""
    total_applications: int
    processed: int
    success: int
    failed: int
    results: List[BatchScoreResult]
    summary: BatchSummary
    timestamp: datetime


class CreditApplicationRequest(BaseModel):
    """Credit application request schema"""
    # Personal Information
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    age: int = Field(..., ge=18, le=100)
    
    # Employment Information
    employment_type: EmploymentType
    annual_income: float = Field(..., ge=0)
    years_employed: int = Field(..., ge=0, le=50)
    
    # Financial Information
    existing_loans: int = Field(0, ge=0)
    credit_history_length: int = Field(..., ge=0)  # months
    has_bank_account: bool = True
    monthly_expenses: float = Field(..., ge=0)
    
    # Loan Request
    loan_amount: float = Field(..., ge=1000)
    loan_purpose: Optional[str] = Field(None, max_length=255)
    
    # Alternative Data - Social Media
    social_media_months: Optional[int] = Field(0, ge=0, description="Months active on social media")
    social_connections: Optional[int] = Field(0, ge=0, description="Number of connections/followers")
    social_activity_level: Optional[SocialActivityLevel] = SocialActivityLevel.NONE
    verified_social_accounts: Optional[int] = Field(0, ge=0, le=10, description="Number of verified social accounts")
    
    # Alternative Data - E-commerce Activity
    ecommerce_years: Optional[int] = Field(0, ge=0, le=30, description="Years using e-commerce platforms")
    monthly_transactions: Optional[int] = Field(0, ge=0, description="Average monthly e-commerce transactions")
    avg_transaction_value: Optional[float] = Field(0, ge=0, description="Average transaction value in VND")
    transaction_success_rate: Optional[float] = Field(1.0, ge=0, le=1, description="Transaction success rate (0-1)")
    uses_digital_wallet: Optional[bool] = Field(False, description="Uses digital wallet (Momo, ZaloPay, etc.)")
    
    @validator('monthly_expenses')
    def validate_expenses(cls, v, values):
        if 'annual_income' in values:
            annual_income = values['annual_income']
            if v * 12 > annual_income:
                raise ValueError('Monthly expenses cannot exceed annual income')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john.doe@example.com",
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
                "loan_purpose": "Home improvement",
                "social_media_months": 72,
                "social_connections": 850,
                "social_activity_level": "Medium",
                "verified_social_accounts": 3,
                "ecommerce_years": 5,
                "monthly_transactions": 8,
                "avg_transaction_value": 1500000,
                "transaction_success_rate": 0.98,
                "uses_digital_wallet": True
            }
        }


class CreditScoreResult(BaseModel):
    """Credit score calculation result"""
    credit_score: int = Field(..., ge=300, le=850)
    risk_category: RiskCategory
    approval_probability: float = Field(..., ge=0, le=1)
    key_factors: List[Dict[str, Any]]
    recommendation: str


class AIExplanation(BaseModel):
    """AI-generated explanation"""
    summary: str
    strengths: List[str]
    concerns: List[str]
    recommendations: List[str]
    detailed_analysis: str


class CreditApplicationResponse(BaseModel):
    """Complete credit application response"""
    application_id: int
    applicant_name: str
    credit_score_result: CreditScoreResult
    ai_explanation: AIExplanation
    created_at: datetime
    
    class Config:
        from_attributes = True


class DemoScenario(BaseModel):
    """Demo scenario for testing"""
    scenario_name: str
    description: str
    data: CreditApplicationRequest


class HealthCheck(BaseModel):
    """Health check response"""
    status: str
    service: str
    timestamp: datetime
