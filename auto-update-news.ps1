$ErrorActionPreference = "Stop"

# Keep this script ASCII-only for Windows PowerShell 5.x compatibility.
$ProjectDir = $PSScriptRoot
$LogFile = Join-Path -Path $ProjectDir -ChildPath "update.log"
Set-Location -LiteralPath $ProjectDir

function Find-Python {
    $command = Get-Command python.exe -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    $candidates = @(
        "C:\Users\chen\AppData\Local\Python\pythoncore-3.14-64\python.exe",
        "C:\Users\chen\AppData\Local\Programs\Python\Python312\python.exe",
        "C:\Users\chen\AppData\Local\Programs\Python\Python311\python.exe"
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }
    throw "Python was not found. Install Python or add it to PATH."
}

$apiKey = [Environment]::GetEnvironmentVariable("LLM_API_KEY", "User")
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "User-level LLM_API_KEY was not found. Configure it with setx, then sign in again."
}

$python = Find-Python
$started = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$startedMessage = "[$started] update started"
Add-Content -LiteralPath $LogFile -Value $startedMessage -Encoding UTF8
Write-Output $startedMessage

# Start Python as a child process so RSS warnings on stderr do not become
# PowerShell NativeCommandError records.
$stdoutPath = Join-Path $env:TEMP ("global-briefing-stdout-{0}.log" -f $PID)
$stderrPath = Join-Path $env:TEMP ("global-briefing-stderr-{0}.log" -f $PID)
$process = Start-Process -FilePath $python `
    -ArgumentList @(".\collector.py", "--max-stories", "40") `
    -WorkingDirectory $ProjectDir `
    -Wait -PassThru `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath

if (Test-Path -LiteralPath $stdoutPath) {
    Get-Content -Raw -LiteralPath $stdoutPath | Add-Content -LiteralPath $LogFile -Encoding UTF8
}
if (Test-Path -LiteralPath $stderrPath) {
    Get-Content -Raw -LiteralPath $stderrPath | Add-Content -LiteralPath $LogFile -Encoding UTF8
}
$collectorExitCode = $process.ExitCode
Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
if ($collectorExitCode -ne 0) {
    throw "collector.py failed with exit code $collectorExitCode. See $LogFile"
}

$finished = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$finishedMessage = "[$finished] update completed"
Add-Content -LiteralPath $LogFile -Value $finishedMessage -Encoding UTF8
Write-Output $finishedMessage
