param(
  [string]$RepoRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (!$npm) {
  throw "npm.cmd was not found on Thunderobot. Install Node.js or add it to PATH."
}

function Assert-LastExitCode {
  param([string]$Step)
  if ($LASTEXITCODE -ne 0) {
    throw "$Step failed with exit code $LASTEXITCODE"
  }
}

Set-Location $RepoRoot

Write-Host "[1/5] Preparing KL_WEB dependencies on Thunderobot..." -ForegroundColor Cyan
$nodeModules = Join-Path $RepoRoot "node_modules"
$lockFile = Join-Path $RepoRoot "package-lock.json"
$marker = Join-Path $nodeModules ".klweb-lock-sha256"
$currentHash = (Get-FileHash $lockFile -Algorithm SHA256).Hash
$installedHash = if (Test-Path $marker) { (Get-Content $marker -Raw).Trim() } else { "" }

if (!(Test-Path $nodeModules) -or $installedHash -ne $currentHash) {
  & $npm.Source ci --no-audit --no-fund
  Assert-LastExitCode "npm ci"
  Set-Content -Path $marker -Value $currentHash -NoNewline
} else {
  Write-Host "Dependencies are current; skipping npm ci." -ForegroundColor DarkGray
}

Write-Host "[2/5] Linting KL_WEB on Thunderobot..." -ForegroundColor Cyan
& $npm.Source run lint
Assert-LastExitCode "npm run lint"

Write-Host "[3/5] Building KL_WEB standalone bundle on Thunderobot..." -ForegroundColor Cyan
& $npm.Source run build
Assert-LastExitCode "npm run build"

$standalone = Join-Path $RepoRoot ".next\standalone"
$server = Join-Path $standalone "server.js"
if (!(Test-Path $server)) {
  throw "Standalone server was not created: $server"
}

Write-Host "[4/5] Adding KL_WEB public and static assets..." -ForegroundColor Cyan
$publicSource = Join-Path $RepoRoot "public"
$publicTarget = Join-Path $standalone "public"
if (Test-Path $publicSource) {
  New-Item -ItemType Directory -Force -Path $publicTarget | Out-Null
  & robocopy.exe $publicSource $publicTarget /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP
  if ($LASTEXITCODE -gt 7) { throw "robocopy public failed with exit code $LASTEXITCODE" }
}

$staticSource = Join-Path $RepoRoot ".next\static"
$staticTarget = Join-Path $standalone ".next\static"
New-Item -ItemType Directory -Force -Path $staticTarget | Out-Null
& robocopy.exe $staticSource $staticTarget /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -gt 7) { throw "robocopy static failed with exit code $LASTEXITCODE" }

Write-Host "[5/5] Packing KL_WEB release..." -ForegroundColor Cyan
$archive = Join-Path $RepoRoot "klweb-standalone-release.zip"
if (Test-Path $archive) { Remove-Item $archive -Force }
Compress-Archive -Path (Join-Path $standalone "*") -DestinationPath $archive -CompressionLevel Optimal

Write-Host "KL_WEB release ready: $archive" -ForegroundColor Green
