# MAFF-fude-vectortiles
農水省の[筆ポリゴン](https://www.maff.go.jp/j/tokei/porigon/)の`vectortiles`による可視化、データセット。

# Data
- ✅[2024年度](https://github.com/shinyanakashima/MAFF-fude-vectortiles/releases/)
- ✅2025年度
- ✅2026年度（データ配信され次第表示）

ビューアの地図左上の年度セレクタで **2024 / 2025 / 2026** を切り替えられる。
pmtilesは `https://zksdx.org/map/opendata/maff/fude_polygon/tiles/maff-fude-<YEAR>_z14-17.pmtiles` の形式で年度を埋め込む。

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

## 出典
本プロジェクトでは「筆ポリゴン」の名称を用いていますが、農林水産省が公開する「[筆ポリゴン](https://open.fude.maff.go.jp/)」を独自に取得し、`FlatGeobuf`に変換したものです。

- ✅「筆ポリゴンデータ」（農林水産省）（2025年5月22日に利用）
- ✅「筆ポリゴンデータ」（農林水産省）を加工して作成
- ✅詳細な利用については、[筆ポリゴン公開サイト利用マニュアル](https://opendata.fude.maff.go.jp/筆ポリゴン公開サイト利用マニュアル.pdf)をご覧ください

## 免責
コンテンツの完全性・正確性・有用性・安全性等について利用者に対し一切の保証をしません。

# Related project
## 🗄️Vector Data
`FlatGeobuf`での可視化。

[MAFF-fude-fgb](https://github.com/shinyanakashima/MAFF-fude-fgb)
