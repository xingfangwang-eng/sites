$ErrorActionPreference = "SilentlyContinue"
$links = @(
"https://agents.wangdadi.xyz",
"https://artemisreentry.wangdadi.xyz",
"https://billripper.wangdadi.xyz",
"https://boothell.wangdadi.xyz",
"https://capsule-factory-saas.wangdadi.xyz",
"https://chapterpredictor.wangdadi.xyz",
"https://cineskin.wangdadi.xyz",
"https://cleancsvai.wangdadi.xyz",
"https://cronguard.wangdadi.xyz",
"https://crosspostfast.wangdadi.xyz",
"https://deadliner.wangdadi.xyz",
"https://deployguard.wangdadi.xyz",
"https://deshaefrost.wangdadi.xyz",
"https://fanguard.wangdadi.xyz",
"https://dossierpro.wangdadi.xyz",
"https://apismash.wangdadi.xyz",
"https://figmarip.wangdadi.xyz",
"https://webhookreaper.wangdadi.xyz",
"https://supaleak.wangdadi.xyz",
"https://giveawaytracker.wangdadi.xyz",
"https://gmailretrybeast.wangdadi.xyz",
"https://hooksurgeon.wangdadi.xyz",
"https://killbillcard.wangdadi.xyz",
"https://killsaas.wangdadi.xyz",
"https://killsubscription.wangdadi.xyz",
"https://killswitchapi.wangdadi.xyz",
"https://laravelboilerplateslayer.wangdadi.xyz",
"https://linguisticdnaextractor.wangdadi.xyz",
"https://manualslib.wangdadi.xyz",
"https://mememooncalculator.wangdadi.xyz",
"https://mockupnuke.wangdadi.xyz",
"https://navslayer.wangdadi.xyz",
"https://neverexplain.wangdadi.xyz",
"https://neveruploadio.wangdadi.xyz",
"https://nichecalccrusher.wangdadi.xyz",
"https://noaimd.wangdadi.xyz",
"https://noseotop.wangdadi.xyz",
"https://notiontablecleaner.wangdadi.xyz",
"https://office-sync.wangdadi.xyz",
"https://oneclickapi.wangdadi.xyz",
"https://onecommand.wangdadi.xyz",
"https://onepagesaas.wangdadi.xyz",
"https://pingthemio.wangdadi.xyz",
"https://postgresroast.wangdadi.xyz",
"https://postgressurgeon.wangdadi.xyz",
"https://receptionkiller.wangdadi.xyz",
"https://rugradar.wangdadi.xyz",
"https://pricecrush.wangdadi.xyz",
"https://contextlock.wangdadi.xyz",
"https://noisekiller.wangdadi.xyz"
)

$results = @()
foreach($link in $links) {
    $status = "UNKNOWN"
    try {
        $resp = Invoke-WebRequest -Uri $link -Method Head -TimeoutSec 15 -UseBasicParsing -MaximumRedirection 0
        $status = $resp.StatusCode
    } catch {
        if ($_.Exception.Message -match "404") {
            $status = "404"
        } elseif ($_.Exception.Message -match "超时") {
            $status = "TIMEOUT"
        } else {
            $status = "ERROR: " + $_.Exception.Message.Substring(0, [Math]::Min(50, $_.Exception.Message.Length))
        }
    }
    $results += "$link | $status"
}

$results | Out-File -FilePath "E:\kaifa\saas\link_check_results.txt" -Encoding UTF8
Write-Host "Done. Found $($results.Count) results."
$results