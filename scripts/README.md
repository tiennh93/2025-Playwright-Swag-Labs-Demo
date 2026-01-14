# Sauce Demo - PowerShell Test Scripts

This folder contains PowerShell scripts for running Playwright tests.

## 📁 Scripts

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `run-tests.ps1`   | Main test runner with all options   |
| `smoke-test.ps1`  | Quick smoke tests                   |
| `a11y-test.ps1`   | Accessibility tests with axe-core   |
| `full-test.ps1`   | Full cross-browser test suite       |
| `open-report.ps1` | Open existing reports               |
| `debug-test.ps1`  | Debug specific tests with Inspector |
| `flaky-test.ps1`  | Detect flaky tests by multiple runs |

## 🚀 Quick Start

```powershell
# Run all tests (report opens automatically)
.\scripts\run-tests.ps1

# Run smoke tests
.\scripts\smoke-test.ps1

# Run tests WITHOUT opening report
.\scripts\run-tests.ps1 -NoReport

# Debug a specific test
.\scripts\debug-test.ps1 -TestFile "login.feature"
```

## 📋 run-tests.ps1 Options

| Parameter   | Description                                         | Default                         |
| ----------- | --------------------------------------------------- | ------------------------------- |
| `-Project`  | Browser: chromium, firefox, webkit, 'Mobile Chrome' | chromium                        |
| `-Tag`      | Filter by tag: @smoke, @regression, @accessibility  | All tests                       |
| `-Headed`   | Run with visible browser                            | false                           |
| `-Debug`    | Enable Playwright Inspector                         | false                           |
| `-NoReport` | Skip opening report after tests                     | false (report opens by default) |
| `-Workers`  | Number of parallel workers                          | Default                         |

## 📊 Examples

```powershell
# Run all tests (report opens automatically)
.\scripts\run-tests.ps1

# Run smoke tests on Firefox
.\scripts\run-tests.ps1 -Project firefox -Tag "@smoke"

# Run in headed mode
.\scripts\run-tests.ps1 -Headed

# Run WITHOUT opening report
.\scripts\run-tests.ps1 -NoReport

# Run accessibility tests
.\scripts\a11y-test.ps1

# Full cross-browser test
.\scripts\full-test.ps1

# Debug login feature
.\scripts\debug-test.ps1 -TestFile "login.feature"

# Open Allure report manually
.\scripts\open-report.ps1

# Open HTML report
.\scripts\open-report.ps1 -ReportType html

# Detect flaky tests (runs 5 times by default)
.\scripts\flaky-test.ps1

# Detect flaky tests with 10 iterations
.\scripts\flaky-test.ps1 -Iterations 10

# Detect flaky tests in smoke tests only
.\scripts\flaky-test.ps1 -Tag "@smoke"
```

## ⚠️ Requirements

- PowerShell 5.1+ or PowerShell Core 7+
- Node.js 18+
- npm dependencies installed (`npm install`)
- Allure CLI (installed via npx)

## 🔄 Default Behavior

By default, after running tests:

1. BDD files are generated
2. Tests are executed
3. Allure report is generated
4. **Browser opens automatically with report** ✅

Use `-NoReport` flag to skip opening the browser.
