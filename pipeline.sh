#!/bin/bash
set -e

INPUT=input/01/merged_01.ndjson
LAYER=maff-fude-2024
OUTDIR=output
ZXYDIR=${OUTDIR}/tiles/${LAYER}

mkdir -p "$OUTDIR" "$ZXYDIR"

echo "▶ NDJSON → MVT (ZXY構造)"
tippecanoe -e "$ZXYDIR" \
  --read-parallel \
  -l "$LAYER" \
  --no-tile-size-limit \
  --drop-densest-as-needed \
  --minimum-zoom=6 \
  --maximum-zoom=17 \
  "$INPUT"

echo "▶ NDJSON → MBTiles"
tippecanoe -o "$OUTDIR/${LAYER}.mbtiles" \
  --read-parallel \
  -l "$LAYER" \
  --no-tile-size-limit \
  --drop-densest-as-needed \
  --minimum-zoom=6 \
  --maximum-zoom=17 \
  "$INPUT"

# MVT→PMTiles変換（ZXYディレクトリ→pmtiles を使う場合はこちら）
# pmtiles pack "$ZXYDIR" "$OUTDIR/${LAYER}.pmtiles"

echo "▶ MBTiles → PMTiles"
pmtiles convert "$OUTDIR/${LAYER}.mbtiles" "$OUTDIR/${LAYER}.pmtiles"

echo "✅ 全て完了：MVT（ZXY）, MBTiles, PMTiles"
