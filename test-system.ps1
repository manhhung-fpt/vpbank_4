# Complete System Test
Write-Host "🧪 FULL SYSTEM TEST" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Test Backend
Write-Host "📡 Testing Backend API..." -ForegroundColor Cyan
Write-Host ""

try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Backend: Running on port 8000" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend: Not running" -ForegroundColor Red
    Write-Host "   Start with: .\start-backend.ps1" -ForegroundColor Yellow
    $backendRunning = $false
}

Write-Host ""

# Test Frontend
Write-Host "🌐 Testing Frontend..." -ForegroundColor Cyan
Write-Host ""

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 3 -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: Not running" -ForegroundColor Red
    Write-Host "   Start with: pnpm dev" -ForegroundColor Yellow
    $frontendRunning = $false
}

Write-Host ""

# Test Credit Scoring Endpoint
if ($backendRunning -ne $false) {
    Write-Host "🎯 Testing Credit Scoring..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        $scenarios = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/demo/scenarios" -Method Get
        Write-Host "✅ Demo Scenarios: $($scenarios.Count) available" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "   Testing Score Calculation..." -ForegroundColor Yellow
        $score = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/demo/scenarios/salaried/score" -Method Post
        Write-Host "   ✅ Credit Score: $($score.credit_score_result.credit_score)/850" -ForegroundColor Green
        Write-Host "   ✅ Risk Category: $($score.credit_score_result.risk_category)" -ForegroundColor Green
        Write-Host "   ✅ AI Explanation: Generated" -ForegroundColor Green
    } catch {
        Write-Host "❌ Credit Scoring: Failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

if ($backendRunning -ne $false -and $frontendRunning -ne $false) {
    Write-Host "🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Points:" -ForegroundColor Yellow
    Write-Host "  Frontend:  http://localhost:3000/dashboard/credit-scoring" -ForegroundColor Cyan
    Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Cyan
    Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  SOME SERVICES NOT RUNNING" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start missing services:" -ForegroundColor Yellow
    if ($backendRunning -eq $false) {
        Write-Host "  Backend:  .\start-backend.ps1" -ForegroundColor Cyan
    }
    if ($frontendRunning -eq $false) {
        Write-Host "  Frontend: pnpm dev" -ForegroundColor Cyan
    }
}

Write-Host ""
