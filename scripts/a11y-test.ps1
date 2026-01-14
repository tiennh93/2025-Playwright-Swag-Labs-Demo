<#
.SYNOPSIS
    Run accessibility tests with detailed report

.DESCRIPTION
    Runs all accessibility tests (@accessibility, @a11y tags) and opens report

.EXAMPLE
    .\a11y-test.ps1
#>

Write-Host ""
Write-Host "[A11Y] Running Accessibility Tests..." -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$runTestsScript = Join-Path $scriptPath "run-tests.ps1"

& $runTestsScript -Tag "@accessibility" -OpenReport
