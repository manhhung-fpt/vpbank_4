# Batch Credit Scoring Feature

## Overview
The Batch Scoring feature allows users to upload files containing multiple credit applications and analyze them all at once, providing comprehensive results and statistics.

## Features

### Frontend Components

1. **BatchScoringUpload** (`src/features/batch-scoring/components/batch-scoring-upload.tsx`)
   - File upload interface with drag & drop support
   - Supports CSV, Excel (XLSX, XLS), and JSON formats
   - Progress tracking during upload and processing
   - Download sample template with pre-filled examples
   - Export results to CSV

2. **BatchResultsTable** (`src/features/batch-scoring/components/batch-results-table.tsx`)
   - Display all scored applications in a table
   - Expandable rows showing key factors for each application
   - Color-coded scores and risk categories
   - Recommendation badges (Approve/Manual Review/Reject)

3. **BatchSummaryCards** (`src/features/batch-scoring/components/batch-summary-cards.tsx`)
   - Summary statistics dashboard
   - Total applications, average score
   - Risk distribution (High/Medium/Low)
   - Total loan amount requested
   - Recommended approval count and rate

### Backend API

1. **POST `/api/credit/batch-score`**
   - Upload file for batch processing
   - Accepts CSV, Excel, or JSON files
   - Processes each application and saves to database
   - Returns detailed results and summary statistics

2. **GET `/api/credit/batch-template`**
   - Download sample CSV template
   - Includes 3 pre-filled example applications:
     - Salaried employee (high score scenario)
     - Freelancer (medium score scenario)
     - Student (lower score scenario)

## File Format

### CSV/Excel Columns
```
name,email,phone,age,employment_type,annual_income,years_employed,existing_loans,credit_history_length,has_bank_account,monthly_expenses,loan_amount,loan_purpose
```

### Required Fields
- **name**: Full name of applicant
- **email**: Valid email address
- **phone**: Phone number
- **age**: Age (18-100)
- **employment_type**: One of: Salaried, Freelancer, Self-Employed, Unemployed, Student
- **annual_income**: Annual income in VND
- **years_employed**: Years in current employment
- **existing_loans**: Number of existing loans
- **credit_history_length**: Credit history length in months
- **has_bank_account**: Boolean (true/false)
- **monthly_expenses**: Monthly expenses in VND
- **loan_amount**: Requested loan amount in VND
- **loan_purpose**: Purpose of the loan

### JSON Format
```json
[
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
    "has_bank_account": true,
    "monthly_expenses": 30000000,
    "loan_amount": 200000000,
    "loan_purpose": "Home improvement"
  }
]
```

## Usage

### Access the Feature
1. Navigate to Dashboard → Batch Scoring
2. Or use the URL: `/dashboard/batch-scoring`
3. Or use keyboard shortcut: `Cmd/Ctrl + K`, then type "b s"

### Upload and Analyze
1. Click "Download Template" to get a sample file with examples
2. Fill in your data or modify the template
3. Click the upload area or drag & drop your file
4. Click "Analyze Applications" to start processing
5. View results in the summary cards and detailed table
6. Export results to CSV for further analysis

## Results Interpretation

### Credit Score Ranges
- **700+**: Low risk (Green)
- **600-699**: Medium risk (Yellow)
- **Below 600**: High risk (Red)

### Recommendations
- **Approve**: High approval probability (≥70%)
- **Manual Review**: Medium approval probability (40-69%)
- **Reject**: Low approval probability (<40%)

### Summary Statistics
- **Average Score**: Mean credit score across all applications
- **Risk Distribution**: Count and percentage for each risk category
- **Total Loan Amount**: Sum of all requested loan amounts
- **Approval Rate**: Percentage of applications recommended for approval

## Navigation

The feature is integrated into the main navigation:
- Sidebar menu item with upload icon
- Keyboard shortcut: `b` + `s`
- Located between Credit Scoring and Product sections

## Technical Details

### File Size Limits
- Maximum file size: Typically 10MB (configurable by backend)
- Recommended: Process batches of up to 1000 applications at a time

### Processing
- Each application is scored independently
- Failed applications don't stop the batch process
- All successful applications are saved to the database
- Results include both successful and failed counts

### Error Handling
- Invalid file format: Clear error message with supported formats
- Parse errors: Continue processing valid entries
- Validation errors: Skip invalid applications and report in failed count

## Example Workflow

1. **Download Template**: Get pre-filled sample with 3 examples
2. **Add Your Data**: Modify or add more applications
3. **Upload File**: Drag & drop or click to select
4. **Review Progress**: Watch upload and processing progress
5. **Analyze Summary**: Check overall statistics in summary cards
6. **Review Details**: Expand rows to see factors for each application
7. **Export Results**: Download results as CSV for reporting
