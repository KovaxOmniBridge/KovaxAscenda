# Script para iniciar o servidor e o frontend simultaneamente

Write-Host "🚀 Iniciando projeto Ascenda..." -ForegroundColor Green
Write-Host ""

# Verifica se as dependências estão instaladas
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

if (-not (Test-Path "servidor\node_modules")) {
    Write-Host "⚠️  Instalando dependências do servidor..." -ForegroundColor Yellow
    Set-Location servidor
    npm install
    Set-Location ..
}

if (-not (Test-Path "CompanyManagement\node_modules")) {
    Write-Host "⚠️  Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location CompanyManagement
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Dependências verificadas!" -ForegroundColor Green
Write-Host ""

# Inicia o servidor em background
Write-Host "🔧 Iniciando servidor na porta 3001..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd servidor; npm run dev"

# Aguarda 3 segundos para o servidor iniciar
Start-Sleep -Seconds 3

# Inicia o frontend
Write-Host "🎨 Iniciando frontend na porta 3000..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd CompanyManagement; npm run dev"

Write-Host ""
Write-Host "✨ Projeto iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Servidor API: http://localhost:3001" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para parar os servidores, feche as janelas do terminal que foram abertas." -ForegroundColor Yellow
