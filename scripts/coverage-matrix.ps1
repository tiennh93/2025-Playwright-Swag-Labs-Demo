<#
.SYNOPSIS
    Generate Test Coverage Matrix from feature files

.DESCRIPTION
    This script scans all feature files and generates a markdown document
    showing the mapping between features, scenarios, and tags.

.PARAMETER Output
    Output file path. Default: docs/test-coverage-matrix.md

.EXAMPLE
    .\coverage-matrix.ps1
    # Generate coverage matrix to default location

.EXAMPLE
    .\coverage-matrix.ps1 -Output "./reports/coverage.md"
    # Generate to custom location
#>

param(
    [string]$Output = "docs/test-coverage-matrix.md"
)

# Ensure output directory exists
$outputDir = Split-Path -Parent $Output
if ($outputDir -and -not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         Sauce Demo - Test Coverage Matrix Generator        " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$featureDir = "tests/features"
$features = @()
$allTags = @{}
$totalScenarios = 0

# Parse feature files
Get-ChildItem -Path $featureDir -Filter "*.feature" -Recurse | ForEach-Object {
    $fileName = $_.Name
    $content = Get-Content $_.FullName
    
    $featureData = @{
        File = $fileName
        Name = ""
        Tags = @()
        Scenarios = @()
    }
    
    $currentTags = @()
    $featureTags = @()
    
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i].Trim()
        
        # Collect tags
        if ($line -match '^@') {
            $tags = $line -split '\s+' | Where-Object { $_ -match '^@' }
            $currentTags = $tags
            
            # Track all tags
            foreach ($tag in $tags) {
                if (-not $allTags.ContainsKey($tag)) {
                    $allTags[$tag] = 0
                }
                $allTags[$tag]++
            }
        }
        
        # Feature line
        if ($line -match '^Feature:\s*(.+)$') {
            $featureData.Name = $Matches[1]
            $featureData.Tags = $currentTags
            $featureTags = $currentTags
            $currentTags = @()
        }
        
        # Scenario line
        if ($line -match '^Scenario( Outline)?:\s*(.+)$') {
            $scenarioType = if ($Matches[1]) { "Outline" } else { "Scenario" }
            $scenarioName = $Matches[2]
            
            # Combine feature tags with scenario tags
            $scenarioTags = $currentTags
            if ($scenarioTags.Count -eq 0) {
                $scenarioTags = $featureTags
            }
            
            $featureData.Scenarios += @{
                Name = $scenarioName
                Type = $scenarioType
                Tags = $scenarioTags
                Line = $i + 1
            }
            
            $totalScenarios++
            $currentTags = @()
        }
    }
    
    $features += $featureData
}

# Sort features by name
$features = $features | Sort-Object -Property Name

# Generate Markdown
$markdown = @"
# Test Coverage Matrix

> **Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
> **Total Features:** $($features.Count)  
> **Total Scenarios:** $totalScenarios

This document provides a comprehensive view of all test scenarios in the Sauce Demo project.

---

## 📊 Summary

### By Feature

| Feature | Scenarios | Tags |
| ------- | --------- | ---- |
"@

foreach ($feature in $features) {
    $tags = ($feature.Tags + ($feature.Scenarios | ForEach-Object { $_.Tags }) | Select-Object -Unique) -join ", "
    $markdown += "`n| $($feature.Name) | $($feature.Scenarios.Count) | $tags |"
}

$markdown += @"


### By Tag

| Tag | Count | Percentage |
| --- | ----- | ---------- |
"@

$sortedTags = $allTags.GetEnumerator() | Sort-Object -Property Value -Descending
foreach ($tag in $sortedTags) {
    $percentage = [math]::Round(($tag.Value / $totalScenarios) * 100, 1)
    $markdown += "`n| $($tag.Key) | $($tag.Value) | $percentage% |"
}

$markdown += @"


---

## 📋 Detailed Coverage

"@

foreach ($feature in $features) {
    $markdown += @"

### $($feature.Name)

**File:** ``$($feature.File)``  
**Feature Tags:** $($feature.Tags -join ", ")  
**Scenarios:** $($feature.Scenarios.Count)

| # | Scenario | Type | Tags | Line |
| - | -------- | ---- | ---- | ---- |
"@
    
    $scenarioNum = 1
    foreach ($scenario in $feature.Scenarios) {
        $tags = $scenario.Tags -join ", "
        $markdown += "`n| $scenarioNum | $($scenario.Name) | $($scenario.Type) | $tags | $($scenario.Line) |"
        $scenarioNum++
    }
    
    $markdown += "`n"
}

$markdown += @"

---

## 🏷️ Tag Reference

| Tag | Purpose |
| --- | ------- |
| ``@smoke`` | Critical path tests, run on every commit |
| ``@regression`` | Full regression suite |
| ``@accessibility`` / ``@a11y`` | Accessibility testing with axe-core |
| ``@keyboard`` | Keyboard navigation tests |
| ``@authentication`` | Login/logout related tests |
| ``@shopping`` | Shopping cart and checkout flow |
| ``@storage`` | Cookie and storage management |
| ``@session`` | Session handling tests |
| ``@negative`` | Negative/error case testing |
| ``@flaky`` | Quarantined unstable tests |
| ``@critical`` | Critical business functionality |
| ``@aria`` | ARIA labels and accessibility attributes |

---

## 📈 Coverage Gaps

To identify potential coverage gaps, review:

1. **Features without @smoke tests** - Critical paths may be missing
2. **Low scenario count features** - May need more test cases
3. **Missing @negative tests** - Error handling coverage

---

*This matrix is auto-generated by ``scripts/coverage-matrix.ps1``*
"@

# Write output
$markdown | Out-File -FilePath $Output -Encoding UTF8

Write-Host "Coverage matrix generated!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Features:  $($features.Count)"
Write-Host "  Scenarios: $totalScenarios"
Write-Host "  Tags:      $($allTags.Count)"
Write-Host ""
Write-Host "Output: $Output" -ForegroundColor Cyan
Write-Host ""
