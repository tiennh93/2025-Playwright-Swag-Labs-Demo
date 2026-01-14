<#
.SYNOPSIS
    Run Playwright E2E tests and generate Allure report

.DESCRIPTION
    This script runs Playwright tests with BDD generation, generates Allure report,
    and opens the report in browser by default.

.PARAMETER Project
    Browser project to run tests on (chromium, firefox, webkit, 'Mobile Chrome')
    Default: chromium

.PARAMETER Tag
    Filter tests by tag (e.g., @smoke, @regression, @accessibility)
    Default: Run all tests

.PARAMETER Headed
    Run tests in headed mode (visible browser)

.PARAMETER Debug
    Run tests in debug mode with Playwright Inspector

.PARAMETER NoReport
    Skip opening the report in browser after tests complete

.PARAMETER Workers
    Number of parallel workers
    Default: Uses Playwright default

.EXAMPLE
    .\run-tests.ps1
    # Run all tests on chromium

.EXAMPLE
    .\run-tests.ps1 -Tag "@smoke"
    # Run smoke tests (report opens automatically)

.EXAMPLE
    .\run-tests.ps1 -Project firefox -Headed
    # Run tests on Firefox in headed mode

.EXAMPLE
    .\run-tests.ps1 -Debug
    # Run tests with Playwright Inspector
#>

param(
    [ValidateSet("chromium", "firefox", "webkit", "Mobile Chrome")]
    [string]$Project = "chromium",
    
    [string]$Tag = "",
    
    [switch]$Headed,
    
    [switch]$Debug,
    
    # Default: Open report after tests (use -NoReport to skip)
    [switch]$NoReport,
    
    [int]$Workers = 0
)

# Colors for output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host ""
    Write-Host "[$Step] " -ForegroundColor Cyan -NoNewline
    Write-Host $Message -ForegroundColor White
    Write-Host ("-" * 60) -ForegroundColor DarkGray
}

# Banner
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         Sauce Demo - Playwright Test Runner                " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Display configuration
Write-ColorOutput "Configuration:" "Yellow"
Write-Host "  Project:     $Project"
Write-Host "  Tag:         $(if ($Tag) { $Tag } else { 'All tests' })"
Write-Host "  Headed:      $Headed"
Write-Host "  Debug:       $Debug"
Write-Host "  Open Report: $(if (-not $NoReport) { 'Yes (default)' } else { 'No' })"
Write-Host "  Workers:     $(if ($Workers -gt 0) { $Workers } else { 'Default' })"
Write-Host ""

# Step 1: Clean previous results and generate BDD tests
Write-Step "1/5" "Preparing test environment..."

# Clean old allure-results to ensure accurate report
if (Test-Path "./allure-results") {
    Remove-Item -Recurse -Force "./allure-results"
    Write-Host "  Cleaned previous allure-results" -ForegroundColor DarkGray
}
if (Test-Path "./allure-report") {
    Remove-Item -Recurse -Force "./allure-report"
    Write-Host "  Cleaned previous allure-report" -ForegroundColor DarkGray
}

Write-Host "  Generating BDD test files..." -ForegroundColor DarkGray
npx bddgen
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[FAIL] BDD generation failed!" "Red"
    exit 1
}
Write-ColorOutput "[OK] Environment ready" "Green"

# Step 2: Build Playwright command
Write-Step "2/5" "Running Playwright tests..."

$playwrightArgs = @("playwright", "test")
$playwrightArgs += "--project=$Project"

if ($Tag) {
    $playwrightArgs += "--grep"
    $playwrightArgs += $Tag
}

if ($Headed) {
    $playwrightArgs += "--headed"
}

if ($Workers -gt 0) {
    $playwrightArgs += "--workers=$Workers"
}

# Set debug environment if needed
if ($Debug) {
    $env:PWDEBUG = "1"
    Write-ColorOutput "[DEBUG] Debug mode enabled - Playwright Inspector will open" "Yellow"
}

# Run tests
Write-Host "Command: npx $($playwrightArgs -join ' ')" -ForegroundColor DarkGray
& npx @playwrightArgs

$testExitCode = $LASTEXITCODE

# Clear debug env
if ($Debug) {
    Remove-Item Env:\PWDEBUG -ErrorAction SilentlyContinue
}

# Display test result
if ($testExitCode -eq 0) {
    Write-ColorOutput "[OK] All tests passed!" "Green"
} else {
    Write-ColorOutput "[FAIL] Some tests failed (exit code: $testExitCode)" "Red"
}

# Step 3: Generate Allure report
Write-Step "3/5" "Generating Allure report..."

# Check if allure-results exists
if (Test-Path "./allure-results") {
    npx allure generate ./allure-results -o ./allure-report
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "[OK] Allure report generated at ./allure-report" "Green"
    } else {
        Write-ColorOutput "[WARN] Failed to generate Allure report" "Yellow"
    }
} else {
    Write-ColorOutput "[WARN] No allure-results directory found" "Yellow"
}

# Step 4: Open report (default behavior, skip with -NoReport)
if (-not $NoReport) {
    Write-Step "4/5" "Opening Allure report in browser..."
    
    if (Test-Path "./allure-report/index.html") {
        npx allure open ./allure-report
    } else {
        Write-ColorOutput "[WARN] Allure report not found, opening HTML report instead..." "Yellow"
        npx playwright show-report
    }
} else {
    Write-Step "4/5" "Report generation complete (skipped opening)"
    Write-Host ""
    Write-ColorOutput "To open reports manually:" "Yellow"
    Write-Host "  Allure:     npx allure open ./allure-report"
    Write-Host "  HTML:       npx playwright show-report"
}

# Step 5: Summary
Write-Step "5/5" "Test run summary"
Write-Host ""
Write-Host "============================================================" -ForegroundColor $(if ($testExitCode -eq 0) { "Green" } else { "Red" })
Write-Host "                    Test Run Complete                       " -ForegroundColor $(if ($testExitCode -eq 0) { "Green" } else { "Red" })
Write-Host "============================================================" -ForegroundColor $(if ($testExitCode -eq 0) { "Green" } else { "Red" })
Write-Host ""

exit $testExitCode
