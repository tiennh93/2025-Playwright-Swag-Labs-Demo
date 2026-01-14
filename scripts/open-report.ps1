<#
.SYNOPSIS
    Open existing test reports

.DESCRIPTION
    Opens Allure report or Playwright HTML report in browser

.PARAMETER ReportType
    Type of report to open: allure or html
    Default: allure

.EXAMPLE
    .\open-report.ps1
    # Opens Allure report

.EXAMPLE
    .\open-report.ps1 -ReportType html
    # Opens Playwright HTML report
#>

param(
    [ValidateSet("allure", "html")]
    [string]$ReportType = "allure"
)

Write-Host ""
Write-Host "[REPORT] Opening Test Report..." -ForegroundColor Cyan
Write-Host ""

switch ($ReportType) {
    "allure" {
        if (Test-Path "./allure-report/index.html") {
            Write-Host "[OPEN] Opening Allure Report..." -ForegroundColor Green
            npx allure open ./allure-report
        } else {
            Write-Host "[WARN] Allure report not found. Generating from results..." -ForegroundColor Yellow
            if (Test-Path "./allure-results") {
                npx allure generate ./allure-results -o ./allure-report
                npx allure open ./allure-report
            } else {
                Write-Host "[FAIL] No allure-results found. Run tests first!" -ForegroundColor Red
                exit 1
            }
        }
    }
    "html" {
        if (Test-Path "./playwright-report/index.html") {
            Write-Host "[OPEN] Opening Playwright HTML Report..." -ForegroundColor Green
            npx playwright show-report
        } else {
            Write-Host "[FAIL] Playwright HTML report not found. Run tests first!" -ForegroundColor Red
            exit 1
        }
    }
}
