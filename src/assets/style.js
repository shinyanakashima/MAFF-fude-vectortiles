/**
 * MapLibre 用スタイル定義（コメント付き）
 */
export const style = {
    version: 8,
    sources: {
        seamlessphoto: {
            type: "raster",
            tiles: ["https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"],
            tileSize: 256,
            attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto">地理院タイル全国最新写真（シームレス）</a>',
        },
        fude2024_pmtiles: {
            type: "vector",
            tiles: [
                `pmtiles://https://zksdx.org/map/opendata/maff/fude_polygon/2024/tiles/maff-fude-2024_z14-17.pmtiles/{z}/{x}/{y}`, // ファイル名が「a.pmtiles」
            ],
            attribution: '<a href="https://github.com/shinyanakashima/MAFF-fude-vectortiles">MAFF-fude-vectortiles</a>',
            maxzoom: 16, // タイルの最大ズームを超えて拡大表示させるため
        }
        // debug
        // "terrainSource": {
        //     "type": "raster-dem",
        //     "tiles": ["https://ubukawa.github.io/shikoku/shikoku-dem/{z}/{x}/{y}.png"],
        //     "attribution": "RGB Elevation from ALOS World 3D - 30m (JAXA)",
        //     "tileSize": 256,
        //     "maxzoom": 13,
        //     "minzoom": 4
        // },
        // "hillshadeSource": {
        //     "type": "raster-dem",
        //     "tiles": ["https://ubukawa.github.io/shikoku/shikoku-dem/{z}/{x}/{y}.png"],
        //     "attribution": "RGB Elevation from ALOS World 3D - 30m (JAXA)",
        //     "tileSize": 256,
        //     "maxzoom": 13,
        //     "minzoom": 4
        // }
    },
    layers: [
        {
            id: "gsi-seamlessphoto",
            source: "seamlessphoto",
            type: "raster",
        },
        {
            'id': 'fude2024-polygon',
            'source': 'fude2024_pmtiles',
            'source-layer': 'maff-fude-2024',
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
        },
    ],
}