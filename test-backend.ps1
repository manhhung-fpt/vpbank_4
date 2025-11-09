# Test Backend Quick Script
Write-Host "🧪 Testing Backend API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method Get
    Write-Host "   ✅ Health Check: " -ForegroundColor Green -NoNewline
    Write-Host $response.status -ForegroundColor White
} catch {
    Write-Host "   ❌ Backend not running or health check failed" -ForegroundColor Red
    Write-Host "   Please start backend first: .\start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Get Demo Scenarios
Write-Host "2. Testing Demo Scenarios Endpoint..." -ForegroundColor Yellow
try {
    $scenarios = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/demo/scenarios" -Method Get
    Write-Host "   ✅ Demo Scenarios: " -ForegroundColor Green -NoNewline
    Write-Host "$($scenarios.Count) scenarios available" -ForegroundColor White
    foreach ($scenario in $scenarios) {
        Write-Host "      - $($scenario.scenario_name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Failed to get demo scenarios" -ForegroundColor Red
}

Write-Host ""

# Test 3: Score a Demo Scenario
Write-Host "3. Testing Credit Score Calculation..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/demo/scenarios/salaried/score" -Method Post
    Write-Host "   ✅ Credit Score Calculated!" -ForegroundColor Green
    Write-Host "      Applicant: $($result.applicant_name)" -ForegroundColor Cyan
    Write-Host "      Score: $($result.credit_score_result.credit_score)/850" -ForegroundColor Cyan
    Write-Host "      Risk: $($result.credit_score_result.risk_category)" -ForegroundColor Cyan
    Write-Host "      Approval: $([math]::Round($result.credit_score_result.approval_probability * 100))%" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Failed to calculate credit score" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "✅ Backend API is working correctly!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start frontend: pnpm dev" -ForegroundColor Cyan
Write-Host "  2. Open: http://localhost:3000/dashboard/credit-scoring" -ForegroundColor Cyan
Write-Host "  3. Try demo scenarios!" -ForegroundColor Cyan
Write-Host ""
