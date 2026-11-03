# XLGuide - installateur Windows
#   irm https://joss943.github.io/xlguide/install.ps1 | iex
# Securite : https uniquement (TLS 1.2 minimum), fichier temporaire au nom unique, somme SHA-256
# comparee a SHA256SUMS.txt de la release AVANT de lancer l'installateur.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$base = 'https://github.com/Joss943/xlguide/releases/latest/download'
$name = 'XLGuide-Setup.exe'
$out = Join-Path ([IO.Path]::GetTempPath()) ('XLGuide-Setup-' + [guid]::NewGuid().ToString('N') + '.exe')

try {
    Write-Host '==> Telechargement de XLGuide...' -ForegroundColor Green
    Invoke-WebRequest -Uri "$base/$name" -OutFile $out -UseBasicParsing
    $sums = (Invoke-WebRequest -Uri "$base/SHA256SUMS.txt" -UseBasicParsing).Content
    if ($sums -is [byte[]]) { $sums = [Text.Encoding]::ASCII.GetString($sums) }

    $expected = $null
    foreach ($line in ($sums -split "`r?`n")) {
        $parts = $line.Trim() -split '\s+'
        if ($parts.Count -eq 2 -and $parts[1].TrimStart('*') -ceq $name) { $expected = $parts[0]; break }
    }
    if (-not $expected) { throw "$name absent de SHA256SUMS.txt : installation annulee." }
    $actual = (Get-FileHash -Path $out -Algorithm SHA256).Hash
    if ($actual -ne $expected) { throw "Somme SHA-256 incorrecte pour $name (fichier corrompu ou modifie) : installation annulee." }
    Write-Host "==> Somme SHA-256 verifiee : $name" -ForegroundColor Green

    Write-Host '==> Installation (sans droits administrateur)...' -ForegroundColor Green
    Start-Process -FilePath $out -ArgumentList '/S' -Wait
    Write-Host '==> XLGuide est installe : lance-le depuis le menu Demarrer.' -ForegroundColor Green
}
finally {
    Remove-Item -LiteralPath $out -Force -ErrorAction SilentlyContinue
}
