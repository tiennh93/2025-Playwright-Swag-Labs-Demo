<#
.SYNOPSIS
    Manage quarantined flaky tests

.DESCRIPTION
    This script manages tests tagged with @flaky - these are tests that have been
    identified as unstable and are quarantined from the main test run.

.PARAMETER Action
    The action to perform:
    - list: Show all quarantined tests
    - run: Run only quarantined tests (for debugging)
    - skip: Run all tests EXCEPT quarantined ones (default CI behavior)
    - promote: Remove @flaky tag from a test (mark as stable)

.PARAMETER TestFile
    Optional: Specific test file to check/modify

.EXAMPLE
    .\quarantine.ps1 -Action list
    # List all flaky tests

.EXAMPLE
    .\quarantine.ps1 -Action run
    # Run only flaky tests to debug them

.EXAMPLE
    .\quarantine.ps1 -Action skip
    # Run all tests except flaky ones (for CI)
#>

param(
    [ValidateSet("list", "run", "skip", "stats")]
    [string]$Action = "list",
    
    [string]$Project = "chromium"
)

# Colors for output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "[QUARANTINE] " -ForegroundColor Magenta -NoNewline
    Write-Host $Message -ForegroundColor White
    Write-Host ("-" * 60) -ForegroundColor DarkGray
}

# Banner
Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "         Sauce Demo - Flaky Test Quarantine Manager         " -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

# Find all feature files with @flaky tag
function Get-FlakyTests {
    $featureDir = "tests/features"
    $flakyTests = @()
    
    Get-ChildItem -Path $featureDir -Filter "*.feature" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $lines = Get-Content $_.FullName
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '@flaky') {
                # Find the scenario name (next line that starts with Scenario)
                for ($j = $i + 1; $j -lt $lines.Count; $j++) {
                    if ($lines[$j] -match '^\s*Scenario( Outline)?:\s*(.+)$') {
                        $flakyTests += @{
                            File = $_.Name
                            Line = $i + 1
                            Scenario = $Matches[2].Trim()
                            Tags = $lines[$i].Trim()
                        }
                        break
                    }
                }
            }
        }
    }
    
    return $flakyTests
}

switch ($Action) {
    "list" {
        Write-Step "Listing Quarantined (Flaky) Tests"
        
        $flakyTests = Get-FlakyTests
        
        if ($flakyTests.Count -eq 0) {
            Write-ColorOutput "No flaky tests found!" "Green"
            Write-Host ""
            Write-Host "To quarantine a flaky test, add the @flaky tag above the scenario:" -ForegroundColor DarkGray
            Write-Host "  @flaky" -ForegroundColor Yellow
            Write-Host "  Scenario: My unstable test" -ForegroundColor DarkGray
        } else {
            Write-ColorOutput "Found $($flakyTests.Count) quarantined test(s):" "Yellow"
            Write-Host ""
            
            $groupedByFile = $flakyTests | Group-Object -Property File
            
            foreach ($group in $groupedByFile) {
                Write-Host "  $($group.Name)" -ForegroundColor Cyan
                foreach ($test in $group.Group) {
                    Write-Host "    Line $($test.Line): " -ForegroundColor DarkGray -NoNewline
                    Write-Host "$($test.Scenario)" -ForegroundColor Yellow
                }
            }
        }
    }
    
    "run" {
        Write-Step "Running Quarantined Tests Only (Debug Mode)"
        
        $flakyTests = Get-FlakyTests
        
        if ($flakyTests.Count -eq 0) {
            Write-ColorOutput "No flaky tests to run!" "Green"
            exit 0
        }
        
        Write-Host "Running $($flakyTests.Count) flaky test(s)..." -ForegroundColor Yellow
        Write-Host ""
        
        # Generate BDD and run only @flaky tests
        npx bddgen
        npx playwright test --grep "@flaky" --project=$Project --retries=0
        
        $exitCode = $LASTEXITCODE
        
        Write-Host ""
        if ($exitCode -eq 0) {
            Write-ColorOutput "All flaky tests passed! Consider removing @flaky tag." "Green"
        } else {
            Write-ColorOutput "Some flaky tests still failing. Keep investigating." "Yellow"
        }
        
        exit $exitCode
    }
    
    "skip" {
        Write-Step "Running Tests (Excluding Quarantined)"
        
        $flakyTests = Get-FlakyTests
        
        if ($flakyTests.Count -gt 0) {
            Write-Host "Skipping $($flakyTests.Count) quarantined test(s):" -ForegroundColor Yellow
            foreach ($test in $flakyTests) {
                Write-Host "  - $($test.Scenario)" -ForegroundColor DarkGray
            }
            Write-Host ""
        }
        
        # Generate BDD and run excluding @flaky tests
        npx bddgen
        npx playwright test --grep-invert "@flaky" --project=$Project
        
        exit $LASTEXITCODE
    }
    
    "stats" {
        Write-Step "Flaky Test Statistics"
        
        $flakyTests = Get-FlakyTests
        $featureDir = "tests/features"
        $allScenarios = 0
        
        # Count total scenarios
        Get-ChildItem -Path $featureDir -Filter "*.feature" -Recurse | ForEach-Object {
            $content = Get-Content $_.FullName
            $allScenarios += ($content | Select-String -Pattern '^\s*Scenario( Outline)?:' -AllMatches).Matches.Count
        }
        
        $flakyCount = $flakyTests.Count
        $stableCount = $allScenarios - $flakyCount
        $flakyRate = if ($allScenarios -gt 0) { [math]::Round(($flakyCount / $allScenarios) * 100, 1) } else { 0 }
        
        Write-Host ""
        Write-Host "Test Stability Statistics:" -ForegroundColor Yellow
        Write-Host "  Total Scenarios:    $allScenarios"
        Write-Host "  Stable Tests:       $stableCount" -ForegroundColor Green
        Write-Host "  Quarantined:        $flakyCount" -ForegroundColor $(if ($flakyCount -gt 0) { "Yellow" } else { "Green" })
        Write-Host "  Flaky Rate:         $flakyRate%" -ForegroundColor $(if ($flakyRate -gt 5) { "Red" } elseif ($flakyRate -gt 0) { "Yellow" } else { "Green" })
        Write-Host ""
        
        # Health indicator
        if ($flakyRate -eq 0) {
            Write-ColorOutput "Test Suite Health: EXCELLENT" "Green"
        } elseif ($flakyRate -lt 5) {
            Write-ColorOutput "Test Suite Health: GOOD" "Green"
        } elseif ($flakyRate -lt 10) {
            Write-ColorOutput "Test Suite Health: NEEDS ATTENTION" "Yellow"
        } else {
            Write-ColorOutput "Test Suite Health: CRITICAL" "Red"
        }
    }
}

Write-Host ""
