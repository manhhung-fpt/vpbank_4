# Batch Credit Scoring - Quick Start Guide

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend

# Install openpyxl for Excel support (NEW)
pip install openpyxl

# Or reinstall all dependencies
pip install -r requirements.txt
```

### Step 2: Verify Installation

```bash
# Test Python imports
python -c "import openpyxl; print('✓ openpyxl installed')"
python -c "import pandas; print('✓ pandas installed')"
python -c "import fastapi; print('✓ fastapi installed')"
```

### Step 3: Start Backend

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
python main.py
```

Expected output:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend

Open a new terminal:

```bash
# Make sure you're in the project root
cd vpbank_4

# Start the development server
pnpm dev
# or
npm run dev
```

Expected output:
```
  ▲ Next.js 15.3.2
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Step 5: Access Batch Scoring

Open your browser and navigate to:
```
http://localhost:3000/dashboard/batch-scoring
```

## Quick Test

### Option 1: Using PowerShell Script (Recommended)

```powershell
# Run the automated test
.\test-batch-scoring.ps1
```

This will:
- Check if backend is running
- Install dependencies if needed
- Run comprehensive tests
- Create sample files
- Show results

### Option 2: Manual Testing

1. **Download Template**
   - Go to http://localhost:3000/dashboard/batch-scoring
   - Click "Download Template" button
   - Open the downloaded CSV file

2. **Upload File**
   - Drag and drop the CSV file to the upload area
   - Or click to select the file
   - Click "Analyze Applications"

3. **View Results**
   - Check summary cards for statistics
   - Browse the results table
   - Expand rows to see details
   - Export results if needed

### Option 3: API Testing

```bash
# Test health check
curl http://localhost:8000/api/health

# Download template
curl -O http://localhost:8000/api/credit/batch-template

# Upload file (after creating/downloading template)
curl -X POST http://localhost:8000/api/credit/batch-score \
  -F "file=@credit_application_template.csv"
```

## Troubleshooting

### Backend Issues

**Problem:** "ModuleNotFoundError: No module named 'openpyxl'"
```bash
pip install openpyxl
```

**Problem:** Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed
taskkill /PID <process_id> /F

# Restart backend
python main.py
```

**Problem:** "Cannot import name 'BatchAnalysisResponse'"
```bash
# Restart the backend server
# The new schemas should be loaded
```

### Frontend Issues

**Problem:** Page shows 404
```bash
# Make sure you're on the correct URL
http://localhost:3000/dashboard/batch-scoring
```

**Problem:** "Module not found" errors
```bash
# Reinstall dependencies
pnpm install
# or
npm install

# Restart the dev server
pnpm dev
```

**Problem:** Upload button disabled
- Make sure you've selected a valid file (CSV, XLSX, XLS, or JSON)
- Check the file size (should be reasonable, < 10MB for testing)

### File Format Issues

**Problem:** "Invalid file type"
- Only CSV, Excel (XLSX, XLS), and JSON are supported
- Check the file extension
- Download the template and use it as reference

**Problem:** "No valid applications found"
- Check if the file has data rows (not just headers)
- Verify all required fields are present
- Compare with the template format

**Problem:** "Validation error"
- Check data types (numbers should be numbers, not text)
- Verify email format
- Check age is between 18-100
- Ensure employment_type matches allowed values

## Verification Checklist

After setup, verify these work:

### Backend
- [ ] Server starts without errors
- [ ] Health check responds: http://localhost:8000/api/health
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Template download works
- [ ] Batch score endpoint listed in docs

### Frontend
- [ ] App loads at http://localhost:3000
- [ ] Dashboard accessible
- [ ] Batch Scoring menu item visible
- [ ] Page loads without errors
- [ ] Upload UI displays correctly

### Integration
- [ ] Template downloads from UI
- [ ] File upload works
- [ ] Progress indicators show
- [ ] Results display correctly
- [ ] Summary cards show data
- [ ] Table is expandable
- [ ] Export works

## Sample Files Location

After running tests, you'll find these files:

```
backend/
├── test_batch_applications.csv      # Test data (5 samples)
├── downloaded_template.csv           # Template from API
└── batch_results.json               # Test results
```

You can use any of these files to test the UI.

## Next Steps

1. **Customize Sample Data**
   - Edit the downloaded template
   - Add your own test cases
   - Try different scenarios

2. **Test Edge Cases**
   - Very high income
   - Very low income
   - Multiple existing loans
   - Young vs old applicants

3. **Explore Features**
   - Try different file formats (CSV, Excel, JSON)
   - Check expandable rows
   - Export and review results
   - Compare scores

4. **Production Preparation**
   - Review error handling
   - Test with real data (sanitized)
   - Check performance with larger files
   - Set up monitoring

## Getting Help

### Check Documentation
- [BATCH_SCORING_IMPLEMENTATION.md](./BATCH_SCORING_IMPLEMENTATION.md) - Technical details
- [BATCH_SCORING_GUIDE_VI.md](./BATCH_SCORING_GUIDE_VI.md) - Vietnamese user guide
- [API_EXAMPLES.md](./API_EXAMPLES.md) - API usage examples

### Common Commands

```bash
# Backend
cd backend
python main.py                    # Start server
python test_batch_scoring.py     # Run tests

# Frontend  
pnpm dev                         # Start dev server
pnpm build                       # Build for production

# Testing
.\test-batch-scoring.ps1        # Run automated tests
```

### Debug Mode

For more detailed logs:

**Backend:**
```python
# In main.py, set log level
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
```bash
# Check browser console for errors
# Open DevTools (F12)
```

## Success!

If you can:
1. ✓ Access the batch scoring page
2. ✓ Download the template
3. ✓ Upload a file
4. ✓ See results in the table
5. ✓ Export results

Then everything is working correctly! 🎉

You can now use the Batch Credit Scoring feature to analyze multiple applications efficiently.
