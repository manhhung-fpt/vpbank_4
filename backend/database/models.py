"""
SQLAlchemy database models
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database.db import Base


class CreditApplication(Base):
    """Credit application model"""
    __tablename__ = "credit_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Personal Information
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    age = Column(Integer, nullable=False)
    
    # Employment Information
    employment_type = Column(String(100), nullable=False)  # Salaried, Freelancer, Self-Employed
    annual_income = Column(Float, nullable=False)
    years_employed = Column(Integer, nullable=False)
    
    # Financial Information
    existing_loans = Column(Integer, default=0)
    credit_history_length = Column(Integer, nullable=False)  # months
    has_bank_account = Column(Boolean, default=True)
    monthly_expenses = Column(Float, nullable=False)
    
    # Loan Request
    loan_amount = Column(Float, nullable=False)
    loan_purpose = Column(String(255))
    
    # Credit Score Results
    credit_score = Column(Integer)  # 300-850
    risk_category = Column(String(50))  # Low, Medium, High
    approval_probability = Column(Float)  # 0-1
    
    # AI Explanation
    ai_explanation = Column(Text)
    key_factors = Column(Text)  # JSON string
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<CreditApplication {self.id}: {self.name} - Score: {self.credit_score}>"
