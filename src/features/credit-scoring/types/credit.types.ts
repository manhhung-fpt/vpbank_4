/**
 * Credit Scoring Types
 * Type definitions for credit scoring feature
 */

export enum EmploymentType {
  SALARIED = 'Salaried',
  FREELANCER = 'Freelancer',
  SELF_EMPLOYED = 'Self-Employed',
  UNEMPLOYED = 'Unemployed',
  STUDENT = 'Student'
}

export enum RiskCategory {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  VERY_HIGH = 'Very High'
}

export enum SocialActivityLevel {
  NONE = 'None',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface CreditApplicationForm {
  // Personal Information
  name: string;
  email: string;
  phone?: string;
  age: number;

  // Employment Information
  employment_type: EmploymentType;
  annual_income: number;
  years_employed: number;

  // Financial Information
  existing_loans: number;
  credit_history_length: number;
  has_bank_account: boolean;
  monthly_expenses: number;

  // Loan Request
  loan_amount: number;
  loan_purpose?: string;

  // Alternative Data - Social Media
  social_media_months?: number;
  social_connections?: number;
  social_activity_level?: SocialActivityLevel;
  verified_social_accounts?: number;

  // Alternative Data - E-commerce Activity
  ecommerce_years?: number;
  monthly_transactions?: number;
  avg_transaction_value?: number;
  transaction_success_rate?: number;
  uses_digital_wallet?: boolean;
}

export interface KeyFactor {
  factor: string;
  impact: 'Positive' | 'Negative';
  score: number;
  description: string;
}

export interface CreditScoreResult {
  credit_score: number;
  risk_category: RiskCategory;
  approval_probability: number;
  key_factors: KeyFactor[];
  recommendation: string;
}

export interface AIExplanation {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  detailed_analysis: string;
}

export interface CreditApplicationResponse {
  application_id: number;
  applicant_name: string;
  credit_score_result: CreditScoreResult;
  ai_explanation: AIExplanation;
  created_at: string;
}

export interface DemoScenario {
  scenario_name: string;
  description: string;
  data: CreditApplicationForm;
}

export interface CreditApplication {
  id: number;
  name: string;
  email: string;
  credit_score: number;
  risk_category: string;
  loan_amount: number;
  created_at: string;
}
