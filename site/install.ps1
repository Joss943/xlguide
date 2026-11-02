# XLGuide - installateur Windows
#   irm https://joss943.github.io/xlguide/install.ps1 | iex
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$url = 'https://github.com/Joss943/xlguide/releases/latest/download/XLGuide-Setup.exe'
$out = Join-Path $env:TEMP 'XLGuide-Setup.exe'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Write-Host '==> Telechargement de XLGuide...' -ForegroundColor Green
Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
Write-Host '==> Installation (sans droits administrateur)...' -ForegroundColor Green
Start-Process -FilePath $out -ArgumentList '/S' -Wait
Remove-Item $out -Force -ErrorAction SilentlyContinue
Write-Host '==> XLGuide est installe : lance-le depuis le menu Demarrer.' -ForegroundColor Green
