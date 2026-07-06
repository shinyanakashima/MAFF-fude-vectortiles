#!/bin/bash
# 統合NDJSONからベクタタイル(MVT/ZXY, MBTiles, PMTiles)を生成します。
#
# 使い方:
#   ./pipeline.sh [YEAR] [INPUT]
#     YEAR : 年度 (例: 2024, 2025, 2026)。省略時は 2024
#     INPUT: 入力NDJSONのパス。省略時は input/<YEAR>/01/merged_01.ndjson
#
# 環境変数 MINZOOM / MAXZOOM でズーム範囲を上書き可能（既定: 6 / 17）。
set -e

YEAR="${1:-2024}"
INPUT="${2:-input/${YEAR}/01/merged_01.ndjson}"
LAYER=maff-fude-${YEAR}
OUTDIR=output
ZXYDIR=${OUTDIR}/tiles/${LAYER}
MINZOOM="${MINZOOM:-6}"
MAXZOOM="${MAXZOOM:-17}"

if [ ! -f "$INPUT" ]; then
  echo "❌ 入力NDJSONが存在しません: $INPUT"
  exit 1
fi

mkdir -p "$OUTDIR" "$ZXYDIR"

echo "▶ NDJSON → MVT (ZXY構造)  [年度: ${YEAR}]"
tippecanoe -e "$ZXYDIR" \
  --read-parallel \
  -l "$LAYER" \
  --no-tile-size-limit \
  --drop-densest-as-needed \
  --minimum-zoom="$MINZOOM" \
  --maximum-zoom="$MAXZOOM" \
  "$INPUT"

echo "▶ NDJSON → MBTiles"
tippecanoe -o "$OUTDIR/${LAYER}.mbtiles" \
  --read-parallel \
  -l "$LAYER" \
  --no-tile-size-limit \
  --drop-densest-as-needed \
  --minimum-zoom="$MINZOOM" \
  --maximum-zoom="$MAXZOOM" \
  "$INPUT"

# MVT→PMTiles変換（ZXYディレクトリ→pmtiles を使う場合はこちら）
# pmtiles pack "$ZXYDIR" "$OUTDIR/${LAYER}.pmtiles"

echo "▶ MBTiles → PMTiles"
pmtiles convert "$OUTDIR/${LAYER}.mbtiles" "$OUTDIR/${LAYER}.pmtiles"

echo "✅ 全て完了：MVT（ZXY）, MBTiles, PMTiles  [レイヤー: ${LAYER}]"
