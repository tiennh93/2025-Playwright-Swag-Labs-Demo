<#
.SYNOPSIS
    Quick smoke test runner with report

.DESCRIPTION
    Runs smoke tests (@smoke tag) - report opens automatically by default

.PARAMETER NoReport
    Skip opening the report

.EXAMPLE
    .\smoke-test.ps1
    # Run smoke tests and open report

.EXAMPLE
    .\smoke-test.ps1 -NoReport
    # Run smoke tests without opening report
#>

param(
    [switch]$Headed,
    [switch]$NoReport
)

Write-Host ""
Write-Host "[SMOKE] Running Smoke Tests..." -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$runTestsScript = Join-Path $scriptPath "run-tests.ps1"

$params = @{
    Tag = "@smoke"
}

if ($Headed) {
    $params.Headed = $true
}

if ($NoReport) {
    $params.NoReport = $true
}

& $runTestsScript @params
