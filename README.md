# MAFF-fude-vectortiles
農水省の[筆ポリゴン](https://www.maff.go.jp/j/tokei/porigon/)の`vectortiles`による可視化、データセット。

# Data
2024 / 2025 / 2026年度の**北海道（`01`）**を整備済み。ビューアの地図左上の年度セレクタで
切り替えられる。

PMTilesは Cloudflare R2（`geo-opendata` バケット）に置き、
[MAFF-fude-API](https://github.com/shinyanakashima/MAFF-fude-API) がZXYタイルに変換して配信する。

```
配信: https://maff-fude-api.it-zukosha.workers.dev/tiles/<YEAR>/<PREF>/{z}/{x}/{y}.mvt
実体: geo-opendata/maff-fude/pmtiles/<YEAR>/fude_<YEAR>_<PREF>.pmtiles
```

タイルのレイヤー名は年度を含まない固定名 `fude`。年度はURLで切り替えるため、
スタイル定義の`source-layer`を年度ごとに書き換える必要はない。

## 対応するVector Tiles
- MVT
- mbtiles
- pmtiles

## タイル生成
`pipeline.sh` は第1引数で年度を指定する（省略時は 2024）。

```bash
# 例: 2026年度のタイルを生成（input/2026/01/merged_01.ndjson を入力）
./pipeline.sh 2026
# 入力パスを明示する場合
./pipeline.sh 2026 input/2026/01/merged_01.ndjson
```

## R2のFGBからPMTilesを生成（GitHub Actions）
既に R2 へ配置済みの FGB を入力に、PMTiles を生成して R2 へ戻すワークフロー
（`.github/workflows/build-pmtiles-from-fgb.yml`）。農水省からの元データ再取得は不要。

```
R2の FGB → ogr2ogr(NDJSON) → tippecanoe(MBTiles) → pmtiles convert → R2
```

Actions タブから `Build PMTiles from FGB` を実行し、年度と都道府県コードを指定する。

| 入力 | 例 | 説明 |
| --- | --- | --- |
| `year` | `2024` | 年度 |
| `prefs` | `01` / `01,13` / `all` | 対象県。`all` で01〜47を並列処理 |
| `minzoom` / `maxzoom` | `6` / `17` | ズーム範囲 |

事前に Secrets へ以下を登録する（R2 APIトークンは `geo-opendata` バケット限定・Object Read & Write）。

| Secret | 値 |
| --- | --- |
| `R2_ACCESS_KEY_ID` | Access Key ID |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key |
| `R2_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |

出力は `maff-fude/pmtiles/<YEAR>/fude_<YEAR>_<PREF>.pmtiles`。アップロード後にサイズ突合で検証する。

## R2 へのアップロード
生成した PMTiles を Cloudflare R2（`geo-opendata` バケット）へ配置する。レンサバ(Conoha)や CI から実行できる。

Linux / macOS:

```bash
# 例: 2025年度・北海道(01) の output/maff-fude-2025.pmtiles をアップロード
./upload_pmtiles_r2.sh 2025 01

# 入力パスを明示する場合
./upload_pmtiles_r2.sh 2025 01 output/maff-fude-2025.pmtiles
```

Windows (PowerShell):

```powershell
# 転送せず宛先だけ確認
.\upload_pmtiles_r2.ps1 -Year 2025 -Pref 01 -DryRun
# 本番
.\upload_pmtiles_r2.ps1 -Year 2025 -Pref 01

# 入力パスを明示する場合
.\upload_pmtiles_r2.ps1 -Year 2024 -Pref 01 -Path fude_2024_01.pmtiles
```

配置先キーは全フォーマット共通の階層に揃える。ファイル名にズーム範囲は含めない（URLの安定性のため。ズーム範囲は PMTiles のメタデータに保持される）。

```
geo-opendata/maff-fude/pmtiles/<YEAR>/fude_<YEAR>_<PREF>.pmtiles
```

前提ツールは [rclone](https://rclone.org/)（S3互換）。remote の設定方法（`rclone config` もしくは環境変数）は `upload_pmtiles_r2.sh` の先頭コメントを参照。

## 出典
本プロジェクトでは「筆ポリゴン」の名称を用いていますが、農林水産省が公開する「[筆ポリゴン](https://open.fude.maff.go.jp/)」を独自に取得し、`FlatGeobuf`に変換したものです。

- ✅「筆ポリゴンデータ」（農林水産省）（2025年5月22日に利用）
- ✅「筆ポリゴンデータ」（農林水産省）を加工して作成
- ✅詳細な利用については、[筆ポリゴン公開サイト利用マニュアル](https://opendata.fude.maff.go.jp/筆ポリゴン公開サイト利用マニュアル.pdf)をご覧ください

## 免責
コンテンツの完全性・正確性・有用性・安全性等について利用者に対し一切の保証をしません。

# 関連リポジトリ

| リポジトリ | 役割 |
| ---------- | ---- |
| [MAFF-fude-dataset](https://github.com/shinyanakashima/MAFF-fude-dataset) | 元データ・FGB/Parquet生成・FGBビューア（旧 MAFF-fude-geojson / MAFF-fude-fgb） |
| [MAFF-fude-API](https://github.com/shinyanakashima/MAFF-fude-API) | 筆ポリゴンAPI（bbox検索・タイル配信） |
