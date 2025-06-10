import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { style } from './assets/style.js';

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

map.on("load", () => {


});
