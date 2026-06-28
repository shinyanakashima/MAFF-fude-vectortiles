import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import {
  style,
  YEARS,
  DEFAULT_YEAR,
  fudeSourceId,
  fudeLayerId,
  buildFudeSource,
  buildFudeLayer,
} from './assets/style.js';

import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';

const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);
const map = new maplibregl.Map({
  container: "map",
  style,
  center: [143.15950914681895, 42.92919045913274], // 初期位置
  zoom: 15,
  minZoom: 14,
  maxZoom: 18,
  hash: true,
});

let currentYear = DEFAULT_YEAR;

// 年度を切り替える：現在のソース／レイヤーを外し、選択年度のものを追加する
function switchYear(year) {
  if (year === currentYear) return;

  const prevLayer = fudeLayerId(currentYear);
  const prevSource = fudeSourceId(currentYear);
  if (map.getLayer(prevLayer)) map.removeLayer(prevLayer);
  if (map.getSource(prevSource)) map.removeSource(prevSource);

  currentYear = year;

  if (!map.getSource(fudeSourceId(year))) {
    map.addSource(fudeSourceId(year), buildFudeSource(year));
  }
  map.addLayer(buildFudeLayer(year));
}

// 年度切替UI（地図左上に配置するセレクタ）
function addYearSelector() {
  const wrapper = document.createElement("div");
  wrapper.className = "year-selector";

  const label = document.createElement("label");
  label.htmlFor = "year-select";
  label.textContent = "年度";

  const select = document.createElement("select");
  select.id = "year-select";
  for (const year of YEARS) {
    const opt = document.createElement("option");
    opt.value = String(year);
    opt.textContent = `${year}年度`;
    if (year === currentYear) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener("change", (e) => switchYear(Number(e.target.value)));

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  map.getContainer().appendChild(wrapper);
}

map.on("load", () => {
  addYearSelector();
});
