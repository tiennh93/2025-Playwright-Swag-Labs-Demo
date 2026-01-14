param (
    [string]$JsonReportPath = "test-results.json",
    [string]$OutputPath = "dashboard.html"
)

if (-not (Test-Path $JsonReportPath)) {
    Write-Error "JSON Report file not found at $JsonReportPath"
    exit 1
}

$jsonInfo = Get-Content $JsonReportPath | ConvertFrom-Json

# Calculate Metrics
$totalTests = 0
$passed = 0
$failed = 0
$skipped = 0
$flaky = 0
$duration = 0

foreach ($suite in $jsonInfo.suites) {
    foreach ($spec in $suite.specs) {
        $totalTests++
        $ok = $true
        foreach ($test in $spec.tests) {
            foreach ($result in $test.results) {
                $duration += $result.duration
                if ($result.status -eq "passed") {
                    # passed
                } elseif ($result.status -eq "failed") {
                    $ok = $false
                } elseif ($result.status -eq "skipped") {
                    $skipped++
                    $ok = $true # treat skipped as neutral or separate
                }
            }
        }
        
        # Simplified logic: Playwright JSON structure is nested.
        # Check actual suite stats if available or iterate deeply.
        # Actually playwright JSON root objects has 'stats'
    }
}

# Playwright JSON has a 'stats' object at root level
$stats = $jsonInfo.stats
$startTime = $stats.startTime
$totalDuration = $stats.duration
$expected = $stats.expected
$unexpected = $stats.unexpected
$flakyCount = $stats.flaky

# Format Duration
$durationSpan = New-TimeSpan -Milliseconds $totalDuration
$durationStr = "{0:D2}m {1:D2}s" -f $durationSpan.Minutes, $durationSpan.Seconds

$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Dashboard</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --success: #22c55e;
            --error: #ef4444;
            --warning: #eab308;
            --info: #3b82f6;
        }
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            margin: 0;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 1000px;
            width: 100%;
        }
        h1 {
            text-align: center;
            margin-bottom: 2rem;
            font-weight: 300;
            letter-spacing: -1px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .card {
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid #334155;
            text-align: center;
            transition: transform 0.2s;
        }
        .card:hover {
            transform: translateY(-2px);
        }
        .card h3 {
            margin: 0;
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .card .value {
            font-size: 2.5rem;
            font-weight: 700;
            margin-top: 0.5rem;
        }
        .success { color: var(--success); }
        .error { color: var(--error); }
        .warning { color: var(--warning); }
        .info { color: var(--info); }
        
        .footer {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-top: 3rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Test Execution Dashboard</h1>
        
        <div class="grid">
            <div class="card">
                <h3>Total Tests</h3>
                <div class="value">$($expected + $unexpected + $flakyCount)</div>
            </div>
            <div class="card">
                <h3>Passed</h3>
                <div class="value success">$expected</div>
            </div>
            <div class="card">
                <h3>Failed</h3>
                <div class="value error">$unexpected</div>
            </div>
            <div class="card">
                <h3>Flaky</h3>
                <div class="value warning">$flakyCount</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Duration</h3>
                <div class="value info">$durationStr</div>
            </div>
            <div class="card">
                <h3>Pass Rate</h3>
                <div class="value info">$([math]::Round(($expected / ($expected + $unexpected + $flakyCount)) * 100, 1))%</div>
            </div>
        </div>

        <div class="footer">
            Generated at $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        </div>
    </div>
</body>
</html>
"@

$htmlContent | Out-File $OutputPath -Encoding UTF8
Write-Host "Dashboard generated at $OutputPath"
