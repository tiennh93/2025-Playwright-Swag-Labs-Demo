<#
.SYNOPSIS
    Debug a specific test file or scenario

.DESCRIPTION
    Runs tests in debug mode with Playwright Inspector for step-by-step debugging

.PARAMETER TestFile
    Feature file or test file to debug (e.g., "login.feature", "shopping")

.PARAMETER Headed
    Run in headed mode (default: true for debug)

.EXAMPLE
    .\debug-test.ps1 -TestFile "login.feature"
    # Debug login feature

.EXAMPLE
    .\debug-test.ps1 -TestFile "accessibility"
    # Debug accessibility tests
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$TestFile
)

Write-Host ""
Write-Host "[DEBUG] Debug Mode - Playwright Inspector" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor DarkGray
Write-Host "  Test: $TestFile" -ForegroundColor White
Write-Host "===========================================================" -ForegroundColor DarkGray
Write-Host ""

Write-Host "[BDD] Generating BDD files..." -ForegroundColor DarkGray
npx bddgen

Write-Host ""
Write-Host "[START] Starting Playwright Inspector..." -ForegroundColor Cyan
Write-Host "   Use the Inspector to step through tests" -ForegroundColor DarkGray
Write-Host ""

$env:PWDEBUG = "1"
npx playwright test $TestFile --project=chromium --headed
Remove-Item Env:\PWDEBUG -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "[OK] Debug session complete" -ForegroundColor Green
