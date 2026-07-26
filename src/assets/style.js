/**
 * MapLibre 用スタイル定義（コメント付き）
 *
 * 筆ポリゴンのベクタタイルは、R2上のPMTilesを筆ポリゴンAPIがZXYに変換して配信する。
 * 年度はURLパスで切り替える。年度切替（main.js）でソース／レイヤーを
 * 差し替えられるようヘルパーを公開する。
 */

// 対応年度（新しい順）
export const YEARS = [2026, 2025, 2024];
export const DEFAULT_YEAR = 2026;
// 都道府県コード（北海道）
const PREF = "01";

// 筆ポリゴンAPI。ビルド時に VITE_API_BASE で差し替えられる。
const API_BASE =
    import.meta.env?.VITE_API_BASE ??
    "https://maff-fude-api.it-zukosha.workers.dev";

// 年度ごとに一意なソースID・レイヤーID
export const fudeSourceId = (year) => `fude${year}_tiles`;
export const fudeLayerId = (year) => `fude${year}-polygon`;
// source-layer はタイル側で年度非依存の固定名になった
export const FUDE_SOURCE_LAYER = "fude";

// 指定年度のベクタタイルソース定義
export const buildFudeSource = (year) => ({
    type: "vector",
    tiles: [`${API_BASE}/tiles/${year}/${PREF}/{z}/{x}/{y}.mvt`],
    attribution: '<a href="https://github.com/shinyanakashima/MAFF-fude-vectortiles">MAFF-fude-vectortiles</a>',
    // タイルの実体は z6-17。maxzoomを超えた分はオーバーズームで表示する
    minzoom: 6,
    maxzoom: 17,
});

// 指定年度のポリゴンレイヤー定義
export const buildFudeLayer = (year) => ({
    'id': fudeLayerId(year),
    'source': fudeSourceId(year),
    'source-layer': FUDE_SOURCE_LAYER,
    'type': 'fill',
    'paint': {
        "fill-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#0072fd",
            "#fd7e00"
        ],
        // "fill-color": "#7fffd4", // 初期色
        "fill-opacity": 0.6, // 塗りつぶしの透明度
        "fill-outline-color": "#333333", // 境界線の色
    },
    'minzoom': 14,
    'maxzoom': 22.99
});

export const style = {
    version: 8,
    sources: {
        seamlessphoto: {
            type: "raster",
            tiles: ["https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"],
            tileSize: 256,
            attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto">地理院タイル全国最新写真（シームレス）</a>',
        },
        // 既定年度のソースを初期表示用に登録（年度切替時はmain.jsで差し替える）
        [fudeSourceId(DEFAULT_YEAR)]: buildFudeSource(DEFAULT_YEAR),
    },
    layers: [
        {
            id: "gsi-seamlessphoto",
            source: "seamlessphoto",
            type: "raster",
        },
        buildFudeLayer(DEFAULT_YEAR),
    ],
}
