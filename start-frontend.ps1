# Start Frontend Development Server
Write-Host "🚀 Starting Next.js Frontend..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not found. Installing..." -ForegroundColor Yellow
    pnpm install
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "  🚀 Starting Next.js Development Server" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "  📡 Local:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  🌐 Network:   Available on your network" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🎯 Credit Scoring: /dashboard/credit-scoring" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚡ Status:    Starting..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Start development server
pnpm dev
