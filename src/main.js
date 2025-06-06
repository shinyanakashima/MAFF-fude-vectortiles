import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import style from './assets/style.json';

import maplibregl from 'maplibre-gl';
import { deserialize } from 'flatgeobuf/lib/mjs/geojson';
import throttle from 'lodash.throttle';

const map = new maplibregl.Map({
  container: "map",
  style,
  center: [143.15950914681895, 42.92919045913274], // 初期位置
  zoom: 12,
  minZoom: 9,
  maxZoom: 18,
  hash: true,
});

function fgbBoundingBox() {
  const { _sw, _ne } = map.getBounds();
  return {
    minX: _sw.lng,
    minY: _sw.lat,
    maxX: _ne.lng,
    maxY: _ne.lat,
  };
}

async function updateResults() {
  // polygons-fillレイヤーと連動。こちらはデータ読み込みをスキップするための制御
  if (map.getZoom() < 9) return;

  document.getElementById("loading-ui")?.classList.remove("hidden"); // 表示
  const fc = { type: "FeatureCollection", features: [] };
  let i = 0;
  for await (const feature of deserialize('https://zksdx.org/map/opendata/maff/fude_polygon/2024/fgb/fude_2024_01.fgb', fgbBoundingBox())) {
    fc.features.push({ ...feature, id: feature.properties.polygon_uuid ?? `fude-${i++}` });
  }
  map.getSource("polygons").setData(fc);
  document.getElementById("loading-ui")?.classList.add("hidden");    // 非表示
}

map.on("load", () => {

  map.on("moveend", throttle(updateResults, 1000));
  updateResults();
});
