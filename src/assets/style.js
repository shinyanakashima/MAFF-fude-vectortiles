/**
 * MapLibre 用スタイル定義（コメント付き）
 *
 * 筆ポリゴンのベクタタイル(pmtiles)は年度ごとに配信される。
 * 年度をパスとファイル名・source-layer名に埋め込む共通フォーマットを使い、
 * 年度切替（main.js）でソース／レイヤーを差し替えられるようヘルパーを公開する。
 */

// 対応年度（新しい順）。配信され次第表示される。
export const YEARS = [2026, 2025, 2024];
// 既定年度（既存データが存在する年度）
export const DEFAULT_YEAR = 2024;

// データ配信のベースURL。配信先の移行（例: Cloudflare R2）時はここ1箇所を差し替える。
// ビルド時に VITE_DATA_BASE_URL を指定すれば上書き可能（末尾スラッシュは付けない）。
const DATA_BASE_URL =
    import.meta.env?.VITE_DATA_BASE_URL ??
    "https://zksdx.org/map/opendata/maff/fude_polygon";
const PMTILES_BASE = `${DATA_BASE_URL}/tiles`;

// 年度ごとに一意なソースID・レイヤーID・source-layer名
export const fudeSourceId = (year) => `fude${year}_pmtiles`;
export const fudeLayerId = (year) => `fude${year}-polygon`;
export const fudeSourceLayer = (year) => `maff-fude-${year}`;

// 指定年度のベクタタイルソース定義
export const buildFudeSource = (year) => ({
    type: "vector",
    tiles: [
        `pmtiles://${PMTILES_BASE}/maff-fude-${year}_z14-17.pmtiles/{z}/{x}/{y}`,
    ],
    attribution: '<a href="https://github.com/shinyanakashima/MAFF-fude-vectortiles">MAFF-fude-vectortiles</a>',
    maxzoom: 16, // タイルの最大ズームを超えて拡大表示させるため
});

// 指定年度のポリゴンレイヤー定義
export const buildFudeLayer = (year) => ({
    'id': fudeLayerId(year),
    'source': fudeSourceId(year),
    'source-layer': fudeSourceLayer(year),
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
