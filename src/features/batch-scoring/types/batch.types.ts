/**
 * Types for Batch Credit Scoring
 */

export interface BatchApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  employment_type: string;
  annual_income: number;
  years_employed: number;
  existing_loans: number;
  credit_history_length: number;
  has_bank_account: boolean;
  monthly_expenses: number;
  loan_amount: number;
  loan_purpose: string;
}

export interface BatchScoreResult {
  application_id: string;
  name: string;
  credit_score: number;
  risk_category: string;
  approval_probability: number;
  recommendation: string;
  key_factors: Array<{
    factor: string;
    impact: string;
    value: string | number;
  }>;
}

export interface BatchAnalysisResponse {
  total_applications: number;
  processed: number;
  success: number;
  failed: number;
  results: BatchScoreResult[];
  summary: {
    average_score: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    total_loan_amount: number;
    recommended_approvals: number;
  };
  timestamp: string;
}

export interface FileUploadStatus {
  file: File | null;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
}
