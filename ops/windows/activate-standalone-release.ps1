param(
  [string]$ArchivePath = "$env:USERPROFILE\klweb-standalone-release.zip",
  [string]$BaseRoot = "C:\Users\LenovoC440\KL_WEB",
  [string]$NodeHome = "C:\Users\LenovoC440\KL_WEB\runtime\node",
  [int]$Port = 3100
)

$ErrorActionPreference = "Stop"

$node = Join-Path $NodeHome "node.exe"
$releaseRoot = Join-Path $BaseRoot "release"
$stageRoot = Join-Path $BaseRoot "release.next"
$runner = Join-Path $BaseRoot "run-release.ps1"
$logDir = Join-Path $BaseRoot "logs"
$taskName = "KL_WEB"

if (!(Test-Path $ArchivePath)) { throw "Release archive not found: $ArchivePath" }
if (!(Test-Path $node)) { throw "Node runtime not found: $node" }

$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
  Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $owner = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  if ($owner -and $owner.ProcessName -eq "node") {
    Stop-Process -Id $owner.Id -Force
    Start-Sleep -Milliseconds 500
  } else {
    $ownerName = if ($owner) { $owner.ProcessName } else { "unknown" }
    throw "Port $Port is occupied by PID $($listener.OwningProcess) ($ownerName), not by Node."
  }
}

if (Test-Path $stageRoot) { Remove-Item $stageRoot -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null
Expand-Archive -Path $ArchivePath -DestinationPath $stageRoot -Force

if (!(Test-Path (Join-Path $stageRoot "server.js"))) {
  throw "Invalid KL_WEB release: server.js is missing."
}

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
& robocopy.exe $stageRoot $releaseRoot /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -gt 7) { throw "robocopy release failed with exit code $LASTEXITCODE" }

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$runnerContent = @'
$ErrorActionPreference = "Stop"

$env:NODE_ENV = "production"
$env:HOSTNAME = "127.0.0.1"
$env:PORT = "3100"

$envFiles = @(
  "C:\Users\LenovoC440\KL_WEB\app\.env",
  "C:\Users\LenovoC440\KL_WEB\app\.env.local",
  "C:\Users\LenovoC440\KL_WEB\app\.env.production",
  "C:\Users\LenovoC440\KL_WEB\app\.env.production.local"
)

foreach ($envFile in $envFiles) {
  if (!(Test-Path $envFile)) { continue }

  foreach ($line in Get-Content $envFile) {
    $trimmed = $line.Trim()
    if (!$trimmed -or $trimmed.StartsWith("#")) { continue }

    $separator = $trimmed.IndexOf("=")
    if ($separator -lt 1) { continue }

    $name = $trimmed.Substring(0, $separator).Trim()
    $value = $trimmed.Substring($separator + 1).Trim()

    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

$node = "C:\Users\LenovoC440\KL_WEB\runtime\node\node.exe"
$server = "C:\Users\LenovoC440\KL_WEB\release\server.js"
$stdout = "C:\Users\LenovoC440\KL_WEB\logs\server.out.log"
$stderr = "C:\Users\LenovoC440\KL_WEB\logs\server.err.log"

Set-Location "C:\Users\LenovoC440\KL_WEB\release"
& $node $server 1>> $stdout 2>> $stderr
exit $LASTEXITCODE
'@

Set-Content -Path $runner -Value $runnerContent -Encoding UTF8

$pwsh = "C:\Program Files\PowerShell\7\pwsh.exe"
if (!(Test-Path $pwsh)) {
  $pwsh = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
}

$actionArgs = '-NoProfile -ExecutionPolicy Bypass -File "' + $runner + '"'
$action = New-ScheduledTaskAction -Execute $pwsh -Argument $actionArgs
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
Start-ScheduledTask -TaskName $taskName

$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep -Seconds 1
  $ready = [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
  if ($ready) { break }
}

if (!$ready) {
  Write-Host "KL_WEB did not start. Last stderr lines:" -ForegroundColor Red
  $stderr = Join-Path $logDir "server.err.log"
  if (Test-Path $stderr) { Get-Content $stderr -Tail 60 }
  throw "KL_WEB failed to listen on port $Port."
}

$response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port" -TimeoutSec 15
if ($response.StatusCode -ne 200) { throw "KL_WEB health check returned HTTP $($response.StatusCode)." }

Remove-Item $stageRoot -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ArchivePath -Force -ErrorAction SilentlyContinue
Write-Host "KL_WEB release is live on 127.0.0.1:$Port." -ForegroundColor Green
