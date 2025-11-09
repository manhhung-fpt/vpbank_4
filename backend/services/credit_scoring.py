"""
Credit Scoring Service using XGBoost
Implements ML-based credit score calculation
"""
import numpy as np
import xgboost as xgb
from typing import Dict, List, Tuple
from api.schemas import CreditApplicationRequest, RiskCategory


class CreditScoringService:
    """Credit scoring service using XGBoost model"""
    
    def __init__(self):
        """Initialize the credit scoring model"""
        self.model = self._create_model()
        self.feature_importance = {}
    
    def _create_model(self) -> xgb.XGBRegressor:
        """
        Create and train a simple XGBoost model
        In production, load a pre-trained model
        """
        # For demo purposes, using a simple weighted model
        # In production, replace with trained XGBoost model
        model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        return model
    
    def calculate_credit_score(
        self, 
        application: CreditApplicationRequest
    ) -> Tuple[int, RiskCategory, float, List[Dict]]:
        """
        Calculate credit score based on application data
        Returns: (credit_score, risk_category, approval_probability, key_factors)
        """
        # Extract features
        features = self._extract_features(application)
        
        # Calculate base score using weighted features
        base_score = self._calculate_base_score(features)
        
        # Apply adjustments
        final_score = self._apply_adjustments(base_score, features)
        
        # Ensure score is within valid range
        credit_score = max(300, min(850, int(final_score)))
        
        # Determine risk category
        risk_category = self._determine_risk_category(credit_score)
        
        # Calculate approval probability
        approval_probability = self._calculate_approval_probability(credit_score)
        
        # Extract key factors
        key_factors = self._extract_key_factors(features, credit_score)
        
        return credit_score, risk_category, approval_probability, key_factors
    
    def _extract_features(self, application: CreditApplicationRequest) -> Dict:
        """Extract and normalize features from application"""
        
        # Employment score (0-100)
        employment_scores = {
            "Salaried": 90,
            "Self-Employed": 75,
            "Freelancer": 60,
            "Unemployed": 20,
            "Student": 30
        }
        employment_score = employment_scores.get(application.employment_type, 50)
        
        # Income to loan ratio
        income_to_loan = application.annual_income / application.loan_amount if application.loan_amount > 0 else 0
        
        # Debt to income ratio
        monthly_income = application.annual_income / 12
        debt_to_income = application.monthly_expenses / monthly_income if monthly_income > 0 else 1
        
        # Credit history score (longer is better)
        credit_history_score = min(100, (application.credit_history_length / 120) * 100)
        
        # Age factor (peak at 35-50)
        age_score = 100
        if application.age < 25:
            age_score = 70
        elif application.age > 60:
            age_score = 80
        
        # === NEW: Alternative Data Features ===
        
        # Social Media Score (0-100)
        social_score = 0
        if application.social_media_months:
            # Longer social presence = more trust
            social_score += min(40, (application.social_media_months / 60) * 40)  # Max 40 points for 5+ years
        
        if application.social_connections:
            # More connections = better social proof (diminishing returns)
            connection_score = min(30, (application.social_connections / 1000) * 30)  # Max 30 for 1000+ connections
            social_score += connection_score
        
        # Social activity level
        activity_scores = {"None": 0, "Low": 10, "Medium": 20, "High": 25}
        social_score += activity_scores.get(application.social_activity_level, 0)
        
        # Verified accounts boost
        social_score += min(5, application.verified_social_accounts * 1.5)  # Up to 5 points
        
        social_score = min(100, social_score)
        
        # E-commerce Score (0-100)
        ecommerce_score = 0
        if application.ecommerce_years:
            # E-commerce experience
            ecommerce_score += min(30, (application.ecommerce_years / 5) * 30)  # Max 30 for 5+ years
        
        if application.monthly_transactions:
            # Transaction frequency (active user = trustworthy)
            transaction_freq_score = min(25, (application.monthly_transactions / 15) * 25)  # Max 25 for 15+ transactions
            ecommerce_score += transaction_freq_score
        
        if application.avg_transaction_value:
            # Higher transaction values = more purchasing power
            # Normalize based on income
            if application.annual_income > 0:
                transaction_to_income = application.avg_transaction_value / (application.annual_income / 12)
                value_score = min(20, transaction_to_income * 100)
                ecommerce_score += value_score
        
        # Success rate (very important indicator)
        if application.transaction_success_rate:
            success_bonus = application.transaction_success_rate * 20  # Up to 20 points
            ecommerce_score += success_bonus
        
        # Digital wallet usage (modern financial behavior)
        if application.uses_digital_wallet:
            ecommerce_score += 5
        
        ecommerce_score = min(100, ecommerce_score)
        
        # === END Alternative Data ===
        
        return {
            'employment_score': employment_score,
            'income_to_loan': income_to_loan,
            'debt_to_income': debt_to_income,
            'credit_history_score': credit_history_score,
            'age_score': age_score,
            'annual_income': application.annual_income,
            'years_employed': application.years_employed,
            'existing_loans': application.existing_loans,
            'has_bank_account': application.has_bank_account,
            'loan_amount': application.loan_amount,
            'social_score': social_score,  # NEW
            'ecommerce_score': ecommerce_score,  # NEW
        }
    
    def _calculate_base_score(self, features: Dict) -> float:
        """Calculate base credit score using weighted features"""
        
        # Updated weights including Alternative Data (total = 100)
        weights = {
            'employment_score': 0.20,      # 20% (reduced from 25%)
            'income_to_loan': 0.18,        # 18% (reduced from 20%)
            'debt_to_income': 0.18,        # 18% (reduced from 20%)
            'credit_history_score': 0.18,  # 18% (reduced from 20%)
            'age_score': 0.08,             # 8% (reduced from 10%)
            'years_employed': 0.04,        # 4% (reduced from 5%)
            'social_score': 0.07,          # 7% (NEW - Alternative Data)
            'ecommerce_score': 0.07        # 7% (NEW - Alternative Data)
        }
        
        # Calculate weighted score
        score = 300  # Base score
        
        # Traditional factors
        score += features['employment_score'] * weights['employment_score'] * 5.5
        
        # Income to loan ratio (higher is better)
        income_loan_score = min(100, features['income_to_loan'] * 20)
        score += income_loan_score * weights['income_to_loan'] * 5.5
        
        # Debt to income ratio (lower is better)
        dti_score = max(0, 100 - (features['debt_to_income'] * 100))
        score += dti_score * weights['debt_to_income'] * 5.5
        
        # Credit history
        score += features['credit_history_score'] * weights['credit_history_score'] * 5.5
        
        # Age score
        score += features['age_score'] * weights['age_score'] * 5.5
        
        # Years employed (up to 20 years)
        years_score = min(100, (features['years_employed'] / 20) * 100)
        score += years_score * weights['years_employed'] * 5.5
        
        # === NEW: Alternative Data Contribution ===
        # Social Media Score (can add up to ~40 points to final score)
        score += features.get('social_score', 0) * weights['social_score'] * 5.5
        
        # E-commerce Score (can add up to ~40 points to final score)
        score += features.get('ecommerce_score', 0) * weights['ecommerce_score'] * 5.5
        
        return score
    
    def _apply_adjustments(self, base_score: float, features: Dict) -> float:
        """Apply adjustments based on risk factors"""
        adjusted_score = base_score
        
        # Penalty for existing loans
        if features['existing_loans'] > 2:
            adjusted_score -= 30
        elif features['existing_loans'] > 0:
            adjusted_score -= 10
        
        # Bonus for bank account
        if features['has_bank_account']:
            adjusted_score += 20
        
        # Penalty for high loan amount relative to income
        if features['income_to_loan'] < 2:
            adjusted_score -= 40
        elif features['income_to_loan'] < 3:
            adjusted_score -= 20
        
        return adjusted_score
    
    def _determine_risk_category(self, credit_score: int) -> RiskCategory:
        """Determine risk category based on credit score"""
        if credit_score >= 750:
            return RiskCategory.LOW
        elif credit_score >= 650:
            return RiskCategory.MEDIUM
        elif credit_score >= 550:
            return RiskCategory.HIGH
        else:
            return RiskCategory.VERY_HIGH
    
    def _calculate_approval_probability(self, credit_score: int) -> float:
        """Calculate loan approval probability"""
        # Logistic function for probability
        if credit_score >= 750:
            return 0.95
        elif credit_score >= 700:
            return 0.85
        elif credit_score >= 650:
            return 0.70
        elif credit_score >= 600:
            return 0.50
        elif credit_score >= 550:
            return 0.30
        else:
            return 0.10
    
    def _extract_key_factors(self, features: Dict, credit_score: int) -> List[Dict]:
        """Extract key factors affecting the credit score"""
        factors = []
        
        # Employment factor
        emp_impact = "Positive" if features['employment_score'] > 70 else "Negative"
        factors.append({
            "factor": "Employment Status",
            "impact": emp_impact,
            "score": features['employment_score'],
            "description": f"Employment score: {features['employment_score']:.0f}/100"
        })
        
        # Income to loan ratio
        itl_impact = "Positive" if features['income_to_loan'] > 3 else "Negative"
        factors.append({
            "factor": "Income to Loan Ratio",
            "impact": itl_impact,
            "score": min(100, features['income_to_loan'] * 20),
            "description": f"Ratio: {features['income_to_loan']:.2f}x"
        })
        
        # Debt to income
        dti_impact = "Positive" if features['debt_to_income'] < 0.4 else "Negative"
        factors.append({
            "factor": "Debt to Income Ratio",
            "impact": dti_impact,
            "score": max(0, 100 - (features['debt_to_income'] * 100)),
            "description": f"{features['debt_to_income']*100:.1f}% of income"
        })
        
        # Credit history
        ch_impact = "Positive" if features['credit_history_score'] > 60 else "Negative"
        factors.append({
            "factor": "Credit History Length",
            "impact": ch_impact,
            "score": features['credit_history_score'],
            "description": f"{features['credit_history_score']:.0f}/100 score"
        })
        
        # Bank account
        factors.append({
            "factor": "Banking Relationship",
            "impact": "Positive" if features['has_bank_account'] else "Negative",
            "score": 100 if features['has_bank_account'] else 0,
            "description": "Active bank account" if features['has_bank_account'] else "No bank account"
        })
        
        # === NEW: Alternative Data Factors ===
        
        # Social Media Presence
        if features.get('social_score', 0) > 0:
            social_impact = "Positive" if features['social_score'] > 50 else "Neutral"
            factors.append({
                "factor": "Social Media Presence",
                "impact": social_impact,
                "score": features['social_score'],
                "description": f"Social trust score: {features['social_score']:.0f}/100"
            })
        
        # E-commerce Activity
        if features.get('ecommerce_score', 0) > 0:
            ecom_impact = "Positive" if features['ecommerce_score'] > 50 else "Neutral"
            factors.append({
                "factor": "E-commerce Activity",
                "impact": ecom_impact,
                "score": features['ecommerce_score'],
                "description": f"Digital transaction score: {features['ecommerce_score']:.0f}/100"
            })
        
        return factors
