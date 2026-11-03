# Verification SHA-256 de site/install.ps1, sans reseau ni installation :
# Invoke-WebRequest et Start-Process sont remplaces par des fonctions de test
# (une fonction est prioritaire sur l'applet de commande du meme nom).
#   pwsh -NoProfile -File tests/install-ps1.test.ps1
$ErrorActionPreference = 'Stop'
$installer = "$PSScriptRoot/../site/install.ps1"
$releaseUrl = 'https://github.com/Joss943/xlguide/releases/latest/download/'

function Invoke-WebRequest {
    param([string]$Uri, [string]$OutFile, [switch]$UseBasicParsing)
    $global:Uris += $Uri
    if ($OutFile) {
        $global:Downloaded = $OutFile
        [IO.File]::WriteAllBytes($OutFile, $global:ExeBytes)
        return
    }
    # GitHub sert SHA256SUMS.txt en application/octet-stream : Content est alors un tableau d'octets
    if ($global:SumsAsBytes) { $content = [Text.Encoding]::ASCII.GetBytes($global:Sums) } else { $content = $global:Sums }
    [pscustomobject]@{ Content = $content }
}

function Start-Process {
    param([string]$FilePath, [string[]]$ArgumentList, [switch]$Wait)
    $global:Started = @{ File = $FilePath; Args = ($ArgumentList -join ' '); Existed = (Test-Path -LiteralPath $FilePath) }
}

$failures = 0
# Test-Case <libelle> <octets telecharges> <contenu de SHA256SUMS.txt> <installation attendue> [-AsBytes]
function Test-Case {
    param([string]$Label, [byte[]]$Exe, [string]$Sums, [bool]$Expected, [switch]$AsBytes)
    $global:ExeBytes = $Exe; $global:Sums = $Sums; $global:SumsAsBytes = $AsBytes.IsPresent
    $global:Uris = @(); $global:Downloaded = $null; $global:Started = $null
    $err = ''
    try { & $installer *> $null } catch { $err = $_.Exception.Message }

    $installed = $null -ne $global:Started
    $ranDownload = -not $installed -or ($global:Started.File -eq $global:Downloaded -and $global:Started.Args -eq '/S' -and $global:Started.Existed)
    $cleaned = [bool]$global:Downloaded -and -not (Test-Path -LiteralPath $global:Downloaded)
    $official = $global:Uris.Count -eq 2 -and @($global:Uris | Where-Object { -not $_.StartsWith($releaseUrl) }).Count -eq 0
    $ok = ($installed -eq $Expected) -and $ranDownload -and $cleaned -and $official -and ($Expected -or $err)
    if ($ok) { Write-Host "ok     $Label" }
    else {
        Write-Host ("ECHEC  {0} : installe={1} nettoye={2} urls={3} erreur='{4}'" -f $Label, $installed, $cleaned, ($global:Uris -join ' '), $err)
        $script:failures++
    }
}

$good = [byte[]](1..200)
$bad = [byte[]](2..201)
$h = [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($good)).Replace('-', '').ToLowerInvariant()
$zero = '0' * 64

Test-Case 'fichier intact' $good "$h  XLGuide-Setup.exe`n" $true
Test-Case 'contenu recu en octets' $good "$h  XLGuide-Setup.exe`n" $true -AsBytes
Test-Case 'marqueur binaire *' $good "$h *XLGuide-Setup.exe`n" $true
Test-Case 'fins de ligne Windows, autres fichiers' $good "$zero  xlguide-amd64.deb`r`n$h  XLGuide-Setup.exe`r`n" $true
Test-Case 'somme differente (fichier modifie)' $bad "$h  XLGuide-Setup.exe`n" $false
Test-Case 'absent de SHA256SUMS.txt' $good "$h  autre.exe`n" $false
Test-Case 'nom voisin' $good "$h  XLGuide-Setup.exe.old`n" $false
Test-Case 'nom en minuscules' $good "$h  xlguide-setup.exe`n" $false
Test-Case 'SHA256SUMS.txt vide' $good '' $false

if ($failures -gt 0) { Write-Host "$failures cas en echec"; exit 1 }
Write-Host 'install.ps1 : verification SHA-256 conforme'
