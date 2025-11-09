"""
AI Explanation Service using OpenAI GPT
Provides human-readable explanations for credit scores
"""
from openai import AsyncOpenAI
from typing import List, Dict
from api.schemas import CreditApplicationRequest, AIExplanation, RiskCategory
from core.config import settings


class AIExplainerService:
    """AI explanation service using OpenAI GPT"""
    
    def __init__(self):
        """Initialize OpenAI client"""
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
    
    async def generate_explanation(
        self,
        application: CreditApplicationRequest,
        credit_score: int,
        risk_category: RiskCategory,
        approval_probability: float,
        key_factors: List[Dict]
    ) -> AIExplanation:
        """Generate AI explanation for credit score"""
        
        if not self.client or not settings.OPENAI_API_KEY:
            # Fallback to rule-based explanation
            return self._generate_fallback_explanation(
                application, credit_score, risk_category, approval_probability, key_factors
            )
        
        try:
            # Create prompt for OpenAI
            prompt = self._create_prompt(
                application, credit_score, risk_category, approval_probability, key_factors
            )
            
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI credit analyst. Provide clear, professional explanations about credit scores in a friendly but informative tone. Focus on actionable insights."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            # Parse response
            explanation_text = response.choices[0].message.content
            return self._parse_ai_response(explanation_text, credit_score, risk_category)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fallback to rule-based
            return self._generate_fallback_explanation(
                application, credit_score, risk_category, approval_probability, key_factors
            )
    
    def _create_prompt(
        self,
        application: CreditApplicationRequest,
        credit_score: int,
        risk_category: RiskCategory,
        approval_probability: float,
        key_factors: List[Dict]
    ) -> str:
        """Create prompt for OpenAI"""
        
        factors_text = "\n".join([
            f"- {f['factor']}: {f['impact']} impact (Score: {f['score']:.0f}/100) - {f['description']}"
            for f in key_factors
        ])
        
        prompt = f"""
Analyze this credit application and provide a detailed explanation:

APPLICANT PROFILE:
- Name: {application.name}
- Age: {application.age}
- Employment: {application.employment_type}
- Annual Income: ${application.annual_income:,.0f}
- Years Employed: {application.years_employed}
- Existing Loans: {application.existing_loans}
- Credit History: {application.credit_history_length} months

LOAN REQUEST:
- Amount: ${application.loan_amount:,.0f}
- Purpose: {application.loan_purpose or 'General purpose'}

ALTERNATIVE DATA (if provided):
- Social Media: {application.social_media_months or 0} months active, {application.social_connections or 0} connections, Activity: {application.social_activity_level or 'None'}
- E-commerce: {application.ecommerce_years or 0} years, {application.monthly_transactions or 0} transactions/month, Success rate: {(application.transaction_success_rate or 0)*100:.0f}%
- Digital Wallet: {'Yes' if application.uses_digital_wallet else 'No'}

CREDIT ASSESSMENT RESULTS:
- Credit Score: {credit_score}/850
- Risk Category: {risk_category.value}
- Approval Probability: {approval_probability*100:.0f}%

KEY FACTORS:
{factors_text}

NOTE: This assessment uses ALTERNATIVE DATA (social media presence and e-commerce activity) alongside traditional credit factors to provide a more comprehensive credit evaluation. Alternative data helps assess financial behavior for applicants with limited credit history.

Please provide:
1. A brief summary (2-3 sentences) of the credit assessment, mentioning if alternative data contributed significantly
2. List of strengths (2-4 points) - highlight any positive alternative data signals
3. List of concerns or areas for improvement (2-4 points)
4. Specific recommendations to improve creditworthiness (3-5 actionable steps) - include suggestions about building digital footprint if relevant
5. A detailed analysis paragraph (3-4 sentences) explaining the overall financial picture and how alternative data influenced the score

Format your response in this structure:
SUMMARY: [your summary]
STRENGTHS: [bullet points]
CONCERNS: [bullet points]
RECOMMENDATIONS: [bullet points]
DETAILED_ANALYSIS: [your analysis]
"""
        return prompt
    
    def _parse_ai_response(self, text: str, credit_score: int, risk_category: RiskCategory) -> AIExplanation:
        """Parse OpenAI response into structured format"""
        
        sections = {
            'summary': '',
            'strengths': [],
            'concerns': [],
            'recommendations': [],
            'detailed_analysis': ''
        }
        
        current_section = None
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect section headers
            if 'SUMMARY:' in line.upper():
                current_section = 'summary'
                sections['summary'] = line.split(':', 1)[1].strip() if ':' in line else ''
            elif 'STRENGTHS:' in line.upper():
                current_section = 'strengths'
            elif 'CONCERNS:' in line.upper():
                current_section = 'concerns'
            elif 'RECOMMENDATIONS:' in line.upper():
                current_section = 'recommendations'
            elif 'DETAILED_ANALYSIS:' in line.upper() or 'ANALYSIS:' in line.upper():
                current_section = 'detailed_analysis'
                sections['detailed_analysis'] = line.split(':', 1)[1].strip() if ':' in line else ''
            elif current_section:
                # Add content to current section
                if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                    cleaned = line[1:].strip()
                    if current_section in ['strengths', 'concerns', 'recommendations']:
                        sections[current_section].append(cleaned)
                elif current_section == 'detailed_analysis':
                    sections['detailed_analysis'] += ' ' + line
                elif current_section == 'summary' and not sections['summary']:
                    sections['summary'] = line
        
        return AIExplanation(
            summary=sections['summary'] or f"Credit score of {credit_score} indicates {risk_category.value.lower()} risk level.",
            strengths=sections['strengths'] or ["Positive credit factors identified"],
            concerns=sections['concerns'] or ["Some areas need improvement"],
            recommendations=sections['recommendations'] or ["Continue building credit history"],
            detailed_analysis=sections['detailed_analysis'] or f"Based on the assessment, this application shows {risk_category.value.lower()} risk characteristics."
        )
    
    def _generate_fallback_explanation(
        self,
        application: CreditApplicationRequest,
        credit_score: int,
        risk_category: RiskCategory,
        approval_probability: float,
        key_factors: List[Dict]
    ) -> AIExplanation:
        """Generate rule-based explanation when OpenAI is unavailable"""
        
        # Summary
        summary = f"Your credit score is {credit_score}/850, placing you in the {risk_category.value} risk category with a {approval_probability*100:.0f}% approval probability."
        
        # Strengths
        strengths = []
        for factor in key_factors:
            if factor['impact'] == 'Positive' and factor['score'] > 70:
                strengths.append(f"Strong {factor['factor'].lower()}: {factor['description']}")
        
        if not strengths:
            strengths = ["You have submitted a complete application", "Basic creditworthiness criteria met"]
        
        # Concerns
        concerns = []
        for factor in key_factors:
            if factor['impact'] == 'Negative':
                concerns.append(f"{factor['factor']}: {factor['description']}")
        
        if not concerns:
            concerns = ["Continue monitoring your credit health", "Maintain current financial discipline"]
        
        # Recommendations
        recommendations = []
        
        if application.employment_type in ["Freelancer", "Unemployed"]:
            recommendations.append("Consider securing stable employment to improve credit standing")
        
        if application.existing_loans > 2:
            recommendations.append("Pay down existing loans to reduce debt burden")
        
        monthly_income = application.annual_income / 12
        dti = application.monthly_expenses / monthly_income if monthly_income > 0 else 1
        if dti > 0.4:
            recommendations.append("Reduce monthly expenses to improve debt-to-income ratio")
        
        if application.credit_history_length < 36:
            recommendations.append("Build longer credit history by maintaining accounts in good standing")
        
        if not application.has_bank_account:
            recommendations.append("Establish banking relationships to strengthen financial profile")
        
        if len(recommendations) < 3:
            recommendations.extend([
                "Make all loan payments on time",
                "Avoid taking on additional debt",
                "Regularly review your credit report"
            ])
        
        # Detailed analysis
        income_loan_ratio = application.annual_income / application.loan_amount
        if income_loan_ratio > 4:
            income_strength = "excellent income coverage"
        elif income_loan_ratio > 3:
            income_strength = "good income coverage"
        elif income_loan_ratio > 2:
            income_strength = "adequate income coverage"
        else:
            income_strength = "limited income coverage"
        
        detailed_analysis = (
            f"Based on your {application.employment_type.lower()} employment status and "
            f"{income_strength} for the requested loan amount, your application shows "
            f"{risk_category.value.lower()} risk characteristics. "
            f"Your {application.credit_history_length}-month credit history and current financial obligations "
            f"indicate a {approval_probability*100:.0f}% likelihood of loan approval. "
            f"Focus on the recommended improvements to enhance your creditworthiness."
        )
        
        return AIExplanation(
            summary=summary,
            strengths=strengths[:4],
            concerns=concerns[:4],
            recommendations=recommendations[:5],
            detailed_analysis=detailed_analysis
        )
