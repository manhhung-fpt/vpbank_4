"""
Demo Scenarios for Credit Scoring System
Provides pre-configured test cases
"""
from api.schemas import CreditApplicationRequest, EmploymentType, DemoScenario
from typing import List


def get_demo_scenarios() -> List[DemoScenario]:
    """Get all available demo scenarios"""
    return [
        get_salaried_employee_scenario(),
        get_freelancer_scenario(),
        get_new_to_bank_scenario()
    ]


def get_salaried_employee_scenario() -> DemoScenario:
    """
    Scenario 1: Salaried Employee (High Score ~780)
    - Stable employment
    - Good income
    - Long credit history
    - Low debt
    """
    data = CreditApplicationRequest(
        name="Nguyễn Văn A",
        email="nguyen.vana@example.com",
        phone="+84901234567",
        age=35,
        employment_type=EmploymentType.SALARIED,
        annual_income=800_000_000,  # 800M VND/year (~$33k USD)
        years_employed=8,
        existing_loans=1,
        credit_history_length=96,  # 8 years
        has_bank_account=True,
        monthly_expenses=25_000_000,  # 25M VND/month
        loan_amount=200_000_000,  # 200M VND (~$8.3k USD)
        loan_purpose="Home improvement"
    )
    
    return DemoScenario(
        scenario_name="Salaried Employee - Low Risk",
        description="35-year-old salaried employee with stable income, 8 years employment, excellent credit history. Expected score: ~780 (Low Risk)",
        data=data
    )


def get_freelancer_scenario() -> DemoScenario:
    """
    Scenario 2: Freelancer (Medium Score ~625)
    - Freelance work
    - Variable income
    - Moderate credit history
    - Some existing debt
    """
    data = CreditApplicationRequest(
        name="Trần Thị B",
        email="tran.thib@example.com",
        phone="+84912345678",
        age=28,
        employment_type=EmploymentType.FREELANCER,
        annual_income=450_000_000,  # 450M VND/year (~$18.7k USD)
        years_employed=4,
        existing_loans=2,
        credit_history_length=48,  # 4 years
        has_bank_account=True,
        monthly_expenses=20_000_000,  # 20M VND/month
        loan_amount=150_000_000,  # 150M VND (~$6.2k USD)
        loan_purpose="Business expansion"
    )
    
    return DemoScenario(
        scenario_name="Freelancer - Medium Risk",
        description="28-year-old freelancer with variable income, 4 years experience, moderate credit history. Expected score: ~625 (Medium Risk)",
        data=data
    )


def get_new_to_bank_scenario() -> DemoScenario:
    """
    Scenario 3: New to Bank (Low Score ~450)
    - Young professional
    - Limited credit history
    - Recent employment
    - No banking relationship
    """
    data = CreditApplicationRequest(
        name="Lê Văn C",
        email="le.vanc@example.com",
        phone="+84923456789",
        age=23,
        employment_type=EmploymentType.SALARIED,
        annual_income=300_000_000,  # 300M VND/year (~$12.5k USD)
        years_employed=1,
        existing_loans=0,
        credit_history_length=12,  # 1 year
        has_bank_account=False,
        monthly_expenses=15_000_000,  # 15M VND/month
        loan_amount=100_000_000,  # 100M VND (~$4.2k USD)
        loan_purpose="Motorcycle purchase"
    )
    
    return DemoScenario(
        scenario_name="New to Bank - High Risk",
        description="23-year-old recent graduate with limited credit history, only 1 year employment, no bank account. Expected score: ~450 (High Risk)",
        data=data
    )


def get_scenario_by_name(scenario_name: str) -> DemoScenario:
    """Get specific demo scenario by name"""
    scenarios = {
        "salaried": get_salaried_employee_scenario(),
        "freelancer": get_freelancer_scenario(),
        "new-to-bank": get_new_to_bank_scenario()
    }
    
    key = scenario_name.lower().replace(" ", "-").replace("_", "-")
    
    # Try exact match first
    if key in scenarios:
        return scenarios[key]
    
    # Try partial match
    for k, v in scenarios.items():
        if k in key or key in k:
            return v
    
    # Default to salaried
    return scenarios["salaried"]
