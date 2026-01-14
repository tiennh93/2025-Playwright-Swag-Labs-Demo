<#
.SYNOPSIS
    Run all tests across all browsers

.DESCRIPTION
    Runs the full test suite on all configured browser projects (chromium, firefox, webkit, Mobile Chrome)

.PARAMETER OpenReport
    Open Allure report after tests complete

.EXAMPLE
    .\full-test.ps1 -OpenReport
#>

param(
    [switch]$OpenReport
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "           Full Cross-Browser Test Suite                    " -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

# Clean previous results
if (Test-Path "./allure-results") {
    Remove-Item -Recurse -Force "./allure-results"
    Write-Host "[CLEAN] Cleaned previous allure-results" -ForegroundColor DarkGray
}

# Generate BDD files once
Write-Host ""
Write-Host "[BDD] Generating BDD test files..." -ForegroundColor Yellow
npx bddgen
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] BDD generation failed!" -ForegroundColor Red
    exit 1
}

# Run tests on all browsers
$browsers = @("chromium", "firefox", "webkit", "Mobile Chrome")
$results = @{}
$startTime = Get-Date

foreach ($browser in $browsers) {
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor DarkGray
    Write-Host "[TEST] Running tests on: $browser" -ForegroundColor Cyan
    Write-Host "===========================================================" -ForegroundColor DarkGray
    
    npx playwright test --project="$browser"
    $results[$browser] = $LASTEXITCODE
    
    if ($results[$browser] -eq 0) {
        Write-Host "[OK] $browser : PASSED" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $browser : FAILED" -ForegroundColor Red
    }
}

$endTime = Get-Date
$duration = $endTime - $startTime

# Summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "                   Test Results Summary                     " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true
foreach ($browser in $browsers) {
    $status = if ($results[$browser] -eq 0) { "[OK] PASSED" } else { "[FAIL] FAILED"; $allPassed = $false }
    $color = if ($results[$browser] -eq 0) { "Green" } else { "Red" }
    Write-Host "  $browser : " -NoNewline
    Write-Host $status -ForegroundColor $color
}

Write-Host ""
Write-Host "  Duration: $($duration.ToString('hh\:mm\:ss'))" -ForegroundColor DarkGray
Write-Host ""

# Generate combined report
Write-Host "[REPORT] Generating Allure report..." -ForegroundColor Yellow
npx allure generate ./allure-results -o ./allure-report

if ($OpenReport) {
    Write-Host "[OPEN] Opening Allure report..." -ForegroundColor Yellow
    npx allure open ./allure-report
}

# Exit with appropriate code
if ($allPassed) {
    Write-Host "[SUCCESS] All browsers passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[WARN] Some browsers failed. Check the report for details." -ForegroundColor Yellow
    exit 1
}
