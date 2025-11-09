# Start Backend Server
Write-Host "🚀 Starting AI Credit Scoring Backend..." -ForegroundColor Green
Write-Host ""

Set-Location backend

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "⚠️  Virtual environment not found. Creating..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "📦 Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

# Check if requirements are installed
Write-Host "📚 Checking dependencies..." -ForegroundColor Cyan
$installed = pip list
if ($installed -notmatch "fastapi") {
    Write-Host "⚠️  Dependencies not found. Installing..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

# Check OpenAI API key
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Copying from template..." -ForegroundColor Yellow
    Copy-Item ".env" ".env"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "  🚀 Starting FastAPI Backend Server" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "  📡 Server:    http://localhost:8000" -ForegroundColor Cyan
Write-Host "  📖 API Docs:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  🔧 ReDoc:     http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚡ Status:    Starting..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Start server
python main.py
