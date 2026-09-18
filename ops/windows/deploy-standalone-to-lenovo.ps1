param(
  [Parameter(Mandatory = $true)]
  [string]$ServerHost,
  [string]$ServerUser = "LenovoC440",
  [string]$RepoRoot = "",
  [string]$IdentityFile = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

$ssh = Get-Command ssh.exe -ErrorAction SilentlyContinue
$scp = Get-Command scp.exe -ErrorAction SilentlyContinue
if (!$ssh -or !$scp) { throw "OpenSSH client is required on Thunderobot." }

& (Join-Path $PSScriptRoot "build-standalone-on-thunderobot.ps1") -RepoRoot $RepoRoot

$archive = Join-Path $RepoRoot "klweb-standalone-release.zip"
$activator = Join-Path $PSScriptRoot "activate-standalone-release.ps1"
$target = "$ServerUser@$ServerHost"

$common = @()
if (![string]::IsNullOrWhiteSpace($IdentityFile)) { $common += @("-i", $IdentityFile) }

& $scp.Source @common $archive ($target + ":klweb-standalone-release.zip")
if ($LASTEXITCODE -ne 0) { throw "SCP KL_WEB release upload failed." }

& $scp.Source @common $activator ($target + ":klweb-activate-standalone.ps1")
if ($LASTEXITCODE -ne 0) { throw "SCP KL_WEB activator upload failed." }

$remote = 'powershell -NoProfile -ExecutionPolicy Bypass -File "%USERPROFILE%\klweb-activate-standalone.ps1"'
& $ssh.Source @common $target $remote
if ($LASTEXITCODE -ne 0) { throw "Remote KL_WEB activation failed." }

Write-Host "KL_WEB deployment completed: Thunderobot built it, Lenovo only activated it." -ForegroundColor Green
