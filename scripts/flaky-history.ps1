<#
.SYNOPSIS
    Track flaky test rate over time

.DESCRIPTION
    This script tracks flaky test detection results over time,
    storing history in a JSON file and generating trend reports.

.PARAMETER Action
    - record: Save current flaky test results to history
    - report: Show flaky test trends over time
    - clear: Clear history

.PARAMETER FlakyTests
    Array of flaky test names to record (used with -Action record)

.PARAMETER TotalTests
    Total number of tests (used with -Action record)

.EXAMPLE
    .\flaky-history.ps1 -Action report
    # Show flaky test trends

.EXAMPLE  
    .\flaky-history.ps1 -Action record -FlakyTests @("Test1", "Test2") -TotalTests 50
    # Record flaky test data
#>

param(
    [ValidateSet("record", "report", "clear")]
    [string]$Action = "report",
    
    [string[]]$FlakyTests = @(),
    
    [int]$TotalTests = 0
)

$historyFile = "reports/flaky-history.json"
$historyDir = Split-Path -Parent $historyFile

# Ensure directory exists
if (-not (Test-Path $historyDir)) {
    New-Item -ItemType Directory -Path $historyDir -Force | Out-Null
}

# Load or initialize history
function Get-History {
    if (Test-Path $historyFile) {
        return Get-Content $historyFile -Raw | ConvertFrom-Json
    }
    return @{
        entries = @()
        lastUpdated = $null
    }
}

function Save-History {
    param($history)
    $history | ConvertTo-Json -Depth 10 | Out-File -FilePath $historyFile -Encoding UTF8
}

# Colors
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Banner
Write-Host ""
Write-Host "============================================================" -ForegroundColor Blue
Write-Host "         Sauce Demo - Flaky Test Rate Tracker               " -ForegroundColor Blue
Write-Host "============================================================" -ForegroundColor Blue
Write-Host ""

switch ($Action) {
    "record" {
        if ($TotalTests -eq 0) {
            Write-ColorOutput "Error: -TotalTests is required for recording" "Red"
            exit 1
        }
        
        $history = Get-History
        
        $flakyRate = if ($TotalTests -gt 0) { 
            [math]::Round(($FlakyTests.Count / $TotalTests) * 100, 2) 
        } else { 0 }
        
        $entry = @{
            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            date = (Get-Date).ToString("yyyy-MM-dd")
            totalTests = $TotalTests
            flakyCount = $FlakyTests.Count
            flakyRate = $flakyRate
            flakyTests = $FlakyTests
        }
        
        # Convert to proper array if needed
        if ($history.entries -eq $null) {
            $history = @{
                entries = @($entry)
                lastUpdated = $entry.timestamp
            }
        } else {
            $history.entries = @($history.entries) + $entry
            $history.lastUpdated = $entry.timestamp
        }
        
        Save-History $history
        
        Write-ColorOutput "Recorded flaky test data:" "Green"
        Write-Host "  Date:        $($entry.date)"
        Write-Host "  Total Tests: $TotalTests"
        Write-Host "  Flaky Count: $($FlakyTests.Count)"
        Write-Host "  Flaky Rate:  $flakyRate%"
        Write-Host ""
        Write-Host "History saved to: $historyFile" -ForegroundColor DarkGray
    }
    
    "report" {
        $history = Get-History
        
        if ($history.entries.Count -eq 0) {
            Write-ColorOutput "No flaky test history found." "Yellow"
            Write-Host ""
            Write-Host "To start tracking, run flaky-test.ps1 which will auto-record results."
            Write-Host "Or manually record: .\flaky-history.ps1 -Action record -FlakyTests @() -TotalTests 50"
            exit 0
        }
        
        Write-Host "Flaky Test History Report" -ForegroundColor Yellow
        Write-Host "=========================" -ForegroundColor Yellow
        Write-Host ""
        
        # Show last 10 entries
        $recentEntries = $history.entries | Select-Object -Last 10
        
        Write-Host "Recent History (last 10 runs):" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "| Date       | Total | Flaky | Rate   | Status |" -ForegroundColor DarkGray
        Write-Host "|------------|-------|-------|--------|--------|" -ForegroundColor DarkGray
        
        foreach ($entry in $recentEntries) {
            $status = if ($entry.flakyRate -eq 0) { "OK" } 
                      elseif ($entry.flakyRate -lt 5) { "WARN" } 
                      else { "FAIL" }
            $statusColor = if ($entry.flakyRate -eq 0) { "Green" } 
                          elseif ($entry.flakyRate -lt 5) { "Yellow" } 
                          else { "Red" }
            
            Write-Host "| $($entry.date) | " -NoNewline
            Write-Host "$($entry.totalTests.ToString().PadLeft(5)) | " -NoNewline
            Write-Host "$($entry.flakyCount.ToString().PadLeft(5)) | " -NoNewline
            Write-Host "$($entry.flakyRate.ToString().PadLeft(5))% | " -NoNewline
            Write-Host "$status".PadLeft(6) -ForegroundColor $statusColor -NoNewline
            Write-Host " |"
        }
        
        Write-Host ""
        
        # Calculate trends
        if ($recentEntries.Count -ge 2) {
            $firstRate = $recentEntries[0].flakyRate
            $lastRate = $recentEntries[-1].flakyRate
            $trend = $lastRate - $firstRate
            
            Write-Host "Trend Analysis:" -ForegroundColor Yellow
            if ($trend -lt 0) {
                Write-ColorOutput "  Improving: Flaky rate decreased by $([math]::Abs($trend))%" "Green"
            } elseif ($trend -gt 0) {
                Write-ColorOutput "  Degrading: Flaky rate increased by $trend%" "Red"
            } else {
                Write-ColorOutput "  Stable: No change in flaky rate" "Cyan"
            }
            
            # Average flaky rate
            $avgRate = ($recentEntries | Measure-Object -Property flakyRate -Average).Average
            Write-Host "  Average Rate: $([math]::Round($avgRate, 2))%"
        }
        
        # Most common flaky tests
        $allFlakyTests = @{}
        foreach ($entry in $history.entries) {
            foreach ($test in $entry.flakyTests) {
                if (-not $allFlakyTests.ContainsKey($test)) {
                    $allFlakyTests[$test] = 0
                }
                $allFlakyTests[$test]++
            }
        }
        
        if ($allFlakyTests.Count -gt 0) {
            Write-Host ""
            Write-Host "Most Frequent Flaky Tests:" -ForegroundColor Yellow
            $sortedFlaky = $allFlakyTests.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 5
            foreach ($test in $sortedFlaky) {
                Write-Host "  [$($test.Value)x] " -ForegroundColor Red -NoNewline
                Write-Host "$($test.Key)"
            }
        }
        
        Write-Host ""
        Write-Host "Total recorded runs: $($history.entries.Count)" -ForegroundColor DarkGray
        Write-Host "Last updated: $($history.lastUpdated)" -ForegroundColor DarkGray
    }
    
    "clear" {
        if (Test-Path $historyFile) {
            Remove-Item $historyFile -Force
            Write-ColorOutput "Flaky test history cleared." "Green"
        } else {
            Write-ColorOutput "No history file found." "Yellow"
        }
    }
}

Write-Host ""
