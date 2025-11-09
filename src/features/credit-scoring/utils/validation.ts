/**
 * Credit Scoring Form Validation Schema
 */
import { z } from 'zod';

export const creditApplicationSchema = z
  .object({
    // Personal Information
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(255, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    age: z
      .number()
      .int('Age must be a whole number')
      .min(18, 'Must be at least 18 years old')
      .max(100, 'Age must be less than 100'),

    // Employment Information
    employment_type: z.enum([
      'Salaried',
      'Freelancer',
      'Self-Employed',
      'Unemployed',
      'Student'
    ]),
    annual_income: z
      .number()
      .min(0, 'Annual income cannot be negative')
      .max(100000000000, 'Annual income is too high'),
    years_employed: z
      .number()
      .int('Years employed must be a whole number')
      .min(0, 'Years employed cannot be negative')
      .max(50, 'Years employed cannot exceed 50'),

    // Financial Information
    existing_loans: z
      .number()
      .int('Number of loans must be a whole number')
      .min(0, 'Cannot have negative loans')
      .max(20, 'Too many loans'),
    credit_history_length: z
      .number()
      .int('Credit history length must be a whole number')
      .min(0, 'Credit history cannot be negative')
      .max(600, 'Credit history is too long'),
    has_bank_account: z.boolean(),
    monthly_expenses: z
      .number()
      .min(0, 'Monthly expenses cannot be negative')
      .max(10000000000, 'Monthly expenses are too high'),

    // Loan Request
    loan_amount: z
      .number()
      .min(1000, 'Loan amount must be at least 1,000')
      .max(10000000000, 'Loan amount is too high'),
    loan_purpose: z.string().max(255, 'Purpose is too long').optional(),

    // Alternative Data - Social Media
    social_media_months: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(360, 'Too many months')
      .optional(),
    social_connections: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(1000000, 'Too many connections')
      .optional(),
    social_activity_level: z.enum(['None', 'Low', 'Medium', 'High']).optional(),
    verified_social_accounts: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(10, 'Maximum 10 accounts')
      .optional(),

    // Alternative Data - E-commerce Activity
    ecommerce_years: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(30, 'Too many years')
      .optional(),
    monthly_transactions: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(1000, 'Too many transactions')
      .optional(),
    avg_transaction_value: z
      .number()
      .min(0, 'Cannot be negative')
      .max(1000000000, 'Transaction value too high')
      .optional(),
    transaction_success_rate: z
      .number()
      .min(0, 'Rate must be between 0 and 1')
      .max(1, 'Rate must be between 0 and 1')
      .optional(),
    uses_digital_wallet: z.boolean().optional()
  })
  .refine(
    (data) => {
      const monthlyIncome = data.annual_income / 12;
      return data.monthly_expenses <= monthlyIncome;
    },
    {
      message: 'Monthly expenses cannot exceed monthly income',
      path: ['monthly_expenses']
    }
  );

export type CreditApplicationFormData = z.infer<typeof creditApplicationSchema>;
