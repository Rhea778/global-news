$ErrorActionPreference = "Stop"

# Pull the public GitHub Actions result back into the local copy after the
# cloud job has had time to finish and Pages has started deploying it.
$ProjectDir = $PSScriptRoot
$LogFile = Join-Path -Path $ProjectDir -ChildPath "update.log"
$Target = Join-Path -Path $ProjectDir -ChildPath "data\stories.json"
$Temp = Join-Path -Path $ProjectDir -ChildPath "data\stories.remote.tmp.json"
$Remote = "https://raw.githubusercontent.com/Rhea778/global-news/main/data/stories.json"

Set-Location -LiteralPath $ProjectDir
try {
    Invoke-WebRequest -UseBasicParsing -Uri $Remote -OutFile $Temp -TimeoutSec 60
    $json = Get-Content -Raw -LiteralPath $Temp -Encoding UTF8 | ConvertFrom-Json
    if (@($json).Count -lt 1) {
        throw "Remote stories.json is empty."
    }
    Move-Item -LiteralPath $Temp -Destination $Target -Force
    $message = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] remote stories synced"
    Add-Content -LiteralPath $LogFile -Value $message -Encoding UTF8
    Write-Output $message
}
catch {
    if (Test-Path -LiteralPath $Temp) {
        Remove-Item -LiteralPath $Temp -Force -ErrorAction SilentlyContinue
    }
    $message = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] remote sync failed: $($_.Exception.Message)"
    Add-Content -LiteralPath $LogFile -Value $message -Encoding UTF8
    throw
}
