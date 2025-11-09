# Test Batch Scoring Feature
# This script tests the batch scoring functionality

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testing Batch Scoring Feature" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1. Checking backend status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -Method GET -ErrorAction Stop
    Write-Host "   ✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend is not running" -ForegroundColor Red
    Write-Host "   Please start the backend first:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   python main.py" -ForegroundColor White
    exit 1
}

Write-Host ""

# Install Python dependencies if needed
Write-Host "2. Checking Python dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    python -c "import openpyxl" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Installing openpyxl for Excel support..." -ForegroundColor Yellow
        pip install openpyxl
    }
    Write-Host "   ✓ Dependencies OK" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Could not verify dependencies" -ForegroundColor Yellow
}
Set-Location ..

Write-Host ""

# Run the test script
Write-Host "3. Running batch scoring tests..." -ForegroundColor Yellow
Set-Location backend
python test_batch_scoring.py
Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Test Results" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if test files were created
if (Test-Path "backend\test_batch_applications.csv") {
    Write-Host "✓ Test CSV created successfully" -ForegroundColor Green
}

if (Test-Path "backend\downloaded_template.csv") {
    Write-Host "✓ Template downloaded successfully" -ForegroundColor Green
}

if (Test-Path "backend\batch_results.json") {
    Write-Host "✓ Batch results saved successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "View results:" -ForegroundColor Yellow
    Write-Host "  backend\batch_results.json" -ForegroundColor White
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open the frontend:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/dashboard/batch-scoring" -ForegroundColor White
Write-Host ""
Write-Host "2. Try uploading the test file:" -ForegroundColor Yellow
Write-Host "   backend\test_batch_applications.csv" -ForegroundColor White
Write-Host ""
Write-Host "3. Or download the template from the UI and fill it with your data" -ForegroundColor Yellow
Write-Host ""
