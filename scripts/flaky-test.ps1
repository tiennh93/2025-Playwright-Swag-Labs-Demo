<#
.SYNOPSIS
    Detect flaky tests by running the test suite multiple times

.DESCRIPTION
    This script runs Playwright tests multiple times to detect flaky tests.
    A test is considered flaky if it passes sometimes and fails other times.

.PARAMETER Iterations
    Number of times to run the test suite
    Default: 5

.PARAMETER Project
    Browser project to run tests on (chromium, firefox, webkit, 'Mobile Chrome')
    Default: chromium

.PARAMETER Tag
    Filter tests by tag (e.g., @smoke, @regression)
    Default: Run all tests

.PARAMETER Workers
    Number of parallel workers per run
    Default: Uses Playwright default

.PARAMETER StopOnFlaky
    Stop immediately when a flaky test is detected
    Default: false (run all iterations)

.EXAMPLE
    .\flaky-test.ps1
    # Run all tests 5 times

.EXAMPLE
    .\flaky-test.ps1 -Iterations 10 -Tag "@smoke"
    # Run smoke tests 10 times

.EXAMPLE
    .\flaky-test.ps1 -StopOnFlaky
    # Stop when first flaky test is found
#>

param(
    [int]$Iterations = 5,
    
    [ValidateSet("chromium", "firefox", "webkit", "Mobile Chrome")]
    [string]$Project = "chromium",
    
    [string]$Tag = "",
    
    [int]$Workers = 0,
    
    [switch]$StopOnFlaky
)

# Store script start time
$startTime = Get-Date

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
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "         Sauce Demo - Flaky Test Detection                  " -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

# Display configuration
Write-ColorOutput "Configuration:" "Yellow"
Write-Host "  Iterations:    $Iterations"
Write-Host "  Project:       $Project"
Write-Host "  Tag:           $(if ($Tag) { $Tag } else { 'All tests' })"
Write-Host "  Workers:       $(if ($Workers -gt 0) { $Workers } else { 'Default' })"
Write-Host "  Stop on Flaky: $StopOnFlaky"
Write-Host ""

# Results tracking
$results = @()
$iterationResults = @{}

# Step 1: Generate BDD tests once
Write-Step "PREP" "Generating BDD test files..."
npx bddgen 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[FAIL] BDD generation failed!" "Red"
    exit 1
}
Write-ColorOutput "[OK] BDD files generated" "Green"

# Build base Playwright command
$playwrightArgs = @("playwright", "test", "--project=$Project", "--reporter=json")
if ($Tag) {
    $playwrightArgs += "--grep"
    $playwrightArgs += $Tag
}
if ($Workers -gt 0) {
    $playwrightArgs += "--workers=$Workers"
}

# Create temp directory for JSON results
$tempDir = Join-Path $env:TEMP "flaky-test-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host ""
Write-ColorOutput "Running $Iterations iterations..." "Cyan"
Write-Host ""

# Step 2: Run tests multiple times
for ($i = 1; $i -le $Iterations; $i++) {
    $progressPercent = [math]::Round(($i / $Iterations) * 100)
    Write-Host "[Run $i/$Iterations] " -ForegroundColor Yellow -NoNewline
    
    # Run tests and capture JSON output
    $jsonFile = Join-Path $tempDir "results-$i.json"
    $env:PLAYWRIGHT_JSON_OUTPUT_NAME = $jsonFile
    
    # Run tests without retries to detect true flaky behavior
    $testArgs = $playwrightArgs + @("--retries=0")
    & npx @testArgs 2>&1 | Out-Null
    
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "PASSED " -ForegroundColor Green -NoNewline
        Write-Host "(100%)" -ForegroundColor DarkGray
        $results += @{ Iteration = $i; Status = "PASSED"; ExitCode = $exitCode }
    } else {
        Write-Host "FAILED " -ForegroundColor Red -NoNewline
        Write-Host "(exit: $exitCode)" -ForegroundColor DarkGray
        $results += @{ Iteration = $i; Status = "FAILED"; ExitCode = $exitCode }
    }
    
    # Parse JSON to get individual test results
    if (Test-Path $jsonFile) {
        try {
            $jsonContent = Get-Content $jsonFile -Raw | ConvertFrom-Json
            foreach ($suite in $jsonContent.suites) {
                foreach ($spec in $suite.specs) {
                    $testName = $spec.title
                    $testStatus = $spec.tests[0].results[0].status
                    
                    if (-not $iterationResults.ContainsKey($testName)) {
                        $iterationResults[$testName] = @()
                    }
                    $iterationResults[$testName] += $testStatus
                }
            }
        } catch {
            # JSON parsing failed, continue
        }
    }
    
    # Check for flaky detection early
    if ($StopOnFlaky -and $i -gt 1) {
        foreach ($testName in $iterationResults.Keys) {
            $statuses = $iterationResults[$testName]
            $uniqueStatuses = $statuses | Select-Object -Unique
            if ($uniqueStatuses.Count -gt 1) {
                Write-Host ""
                Write-ColorOutput "[FLAKY DETECTED] Stopping early!" "Red"
                Write-Host "  Test: $testName" -ForegroundColor Yellow
                Write-Host "  Results: $($statuses -join ', ')" -ForegroundColor DarkGray
                break
            }
        }
        if ($uniqueStatuses.Count -gt 1) { break }
    }
}

# Cleanup temp directory
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

# Step 3: Analyze results
Write-Host ""
Write-Step "ANALYSIS" "Flaky Test Analysis"

$passCount = ($results | Where-Object { $_.Status -eq "PASSED" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAILED" }).Count

Write-Host ""
Write-Host "Run Summary:" -ForegroundColor Yellow
Write-Host "  Total Runs:  $Iterations"
Write-Host "  Passed:      $passCount" -ForegroundColor Green
Write-Host "  Failed:      $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

# Calculate flakiness
$flakyTests = @()
$stableTests = @()

foreach ($testName in $iterationResults.Keys) {
    $statuses = $iterationResults[$testName]
    $uniqueStatuses = $statuses | Select-Object -Unique
    
    if ($uniqueStatuses.Count -gt 1) {
        $passRate = ($statuses | Where-Object { $_ -eq "passed" }).Count / $statuses.Count * 100
        $flakyTests += @{
            Name = $testName
            PassRate = $passRate
            Results = $statuses -join ", "
        }
    } else {
        $stableTests += $testName
    }
}

Write-Host ""
Write-Host "Test Stability:" -ForegroundColor Yellow

if ($flakyTests.Count -gt 0) {
    Write-Host ""
    Write-ColorOutput "FLAKY TESTS DETECTED ($($flakyTests.Count)):" "Red"
    Write-Host ""
    foreach ($test in $flakyTests | Sort-Object { $_.PassRate }) {
        $passRateFormatted = [math]::Round($test.PassRate, 1)
        Write-Host "  [FLAKY] " -ForegroundColor Red -NoNewline
        Write-Host "$($test.Name)" -ForegroundColor Yellow
        Write-Host "          Pass Rate: $passRateFormatted% | Results: $($test.Results)" -ForegroundColor DarkGray
    }
} else {
    Write-ColorOutput "No flaky tests detected!" "Green"
}

Write-Host ""
Write-Host "Stable Tests: $($stableTests.Count)" -ForegroundColor Green

# Calculate flakiness rate
if ($passCount -gt 0 -and $failCount -gt 0) {
    $flakinessRate = [math]::Min($passCount, $failCount) / $Iterations * 100
    Write-Host ""
    Write-ColorOutput "Suite Flakiness Rate: $([math]::Round($flakinessRate, 1))%" $(if ($flakinessRate -gt 10) { "Red" } elseif ($flakinessRate -gt 0) { "Yellow" } else { "Green" })
}

# Elapsed time
$endTime = Get-Date
$elapsed = $endTime - $startTime
Write-Host ""
Write-Host "Time Elapsed: $($elapsed.ToString('mm\:ss'))" -ForegroundColor DarkGray

# Final summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor $(if ($flakyTests.Count -eq 0) { "Green" } else { "Red" })
if ($flakyTests.Count -eq 0) {
    Write-Host "           Test Suite is STABLE                           " -ForegroundColor Green
} else {
    Write-Host "           Flaky Tests Need Attention!                    " -ForegroundColor Red
}
Write-Host "============================================================" -ForegroundColor $(if ($flakyTests.Count -eq 0) { "Green" } else { "Red" })
Write-Host ""

# Recommendations
if ($flakyTests.Count -gt 0) {
    Write-ColorOutput "Recommendations:" "Yellow"
    Write-Host "  1. Review flaky tests for race conditions"
    Write-Host "  2. Add explicit waits or better selectors"
    Write-Host "  3. Check for test isolation issues"
    Write-Host "  4. Consider quarantining flaky tests with @flaky tag"
    Write-Host ""
}

# Exit with appropriate code
if ($flakyTests.Count -gt 0) {
    exit 1
} else {
    exit 0
}
