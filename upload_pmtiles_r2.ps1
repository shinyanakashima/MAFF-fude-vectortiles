# PMTiles を Cloudflare R2 (geo-opendata バケット) へアップロードします。
# Windows(PowerShell)用。Linux/macOS では upload_pmtiles_r2.sh を使用してください。
#
# 使い方:
#   .\upload_pmtiles_r2.ps1 [-Year 2025] [-Pref 01] [-Path <PMTilesのパス>] [-DryRun]
#     Year : 年度 (例: 2024, 2025, 2026)。省略時は 2025
#     Pref : 都道府県コード2桁 (例: 01)。省略時は 01
#     Path : アップロードするPMTilesのパス。省略時は output\maff-fude-<Year>.pmtiles
#            (pipeline.sh の出力先)
#     DryRun: 転送せずに宛先だけ確認する
#
# 事前準備(いずれか):
#   A) rclone に remote を作成しておく(既定の remote 名は "r2"、環境変数 R2_REMOTE で変更可)
#        rclone config create r2 s3 provider=Cloudflare region=auto `
#          access_key_id=<KEY> secret_access_key=<SECRET> `
#          endpoint=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
#   B) 環境変数で remote を注入する(CI向け。rclone.conf 不要)
#        $env:RCLONE_CONFIG_R2_TYPE = "s3"
#        $env:RCLONE_CONFIG_R2_PROVIDER = "Cloudflare"
#        $env:RCLONE_CONFIG_R2_ENDPOINT = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
#        $env:RCLONE_CONFIG_R2_ACCESS_KEY_ID = "<KEY>"
#        $env:RCLONE_CONFIG_R2_SECRET_ACCESS_KEY = "<SECRET>"
#        $env:RCLONE_CONFIG_R2_REGION = "auto"
#
# 配置先キー(全フォーマット共通の階層):
#   <bucket>/maff-fude/pmtiles/<Year>/fude_<Year>_<Pref>.pmtiles
#
# 注: ファイル名にズーム範囲を含めない(URLの安定性のため)。ズーム範囲は
#     PMTiles のメタデータに保持される。

param(
    [string]$Year = "2025",
    [string]$Pref = "01",
    [string]$Path = "",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# 引数チェック
if ($Year -notmatch '^\d{4}$') { Write-Host "❌ Year は4桁で指定してください: $Year"; exit 1 }
if ($Pref -notmatch '^\d{2}$') { Write-Host "❌ Pref は2桁で指定してください: $Pref"; exit 1 }

if ([string]::IsNullOrEmpty($Path)) { $Path = Join-Path "output" "maff-fude-$Year.pmtiles" }

$remote  = if ($env:R2_REMOTE) { $env:R2_REMOTE } else { "r2" }
$bucket  = if ($env:R2_BUCKET) { $env:R2_BUCKET } else { "geo-opendata" }
$dataset = "maff-fude"
$destKey = "$dataset/pmtiles/$Year/fude_${Year}_${Pref}.pmtiles"
$dest    = "${remote}:${bucket}/${destKey}"

# 前提ツール・入力の存在確認
if (-not (Get-Command rclone -ErrorAction SilentlyContinue)) {
    Write-Host "❌ rclone が見つかりません。winget install Rclone.Rclone でインストールしてください"
    exit 1
}
if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    Write-Host "❌ 入力PMTilesが存在しません: $Path"
    exit 1
}

Write-Host "🚀 R2 へアップロードします"
Write-Host "   from: $Path"
Write-Host "   to  : $dest"

$rcloneArgs = @("copyto", "--progress")
if ($DryRun) { $rcloneArgs += "--dry-run" }
$rcloneArgs += @($Path, $dest)

& rclone @rcloneArgs
if ($LASTEXITCODE -ne 0) { Write-Host "❌ アップロードに失敗しました (exit=$LASTEXITCODE)"; exit $LASTEXITCODE }

Write-Host "✅ アップロード完了: $destKey"
Write-Host "🔎 確認: rclone ls ${remote}:${bucket}/${dataset}/pmtiles/${Year}/"
