// PMTilesのMapLibre GL JS用のプロトコルをグローバルに追加
let protocol = new pmtiles.Protocol();
// addProtocolでカスタムURLスキーマを使用するときに呼び出される関数を追加する
// pmtiles://~~ が使用されたときにprotocol.tileが呼び出される
maplibregl.addProtocol("pmtiles", (request) => {
  return new Promise((resolve, reject) => {
    // 非同期処理を行うためにPromiseを作成。成功時にはresolve、失敗時にはrejectで結果を返す。
    const callback = (err, data) => {
      // pmtilesプロトコルのtileメソッドに渡すコールバック関数を定義。エラーがあればrejectし、データがあればresolveする。
      if (err) {
        // エラーが発生した場合
        reject(err); // Promiseを失敗として処理（エラーを返す）
      } else {
        // エラーがなかった場合
        resolve({ data }); // タイルデータを返し、Promiseを成功として処理
      }
    };
    // PMTilesのProtocolオブジェクトのtileメソッドを呼び出して、タイルリクエストを処理
    protocol.tile(request, callback);
  });
});

// マップの初期化
const map = new maplibregl.Map({
  container: "map",
  style: "./std.json", // マップのスタイルを指定
  center: [139.760855, 35.654468], // マップの初期中心点を指定（経度, 緯度）
  zoom: 17.2, // マップの初期ズームレベルを設定
  pitch: 63, // マップの初期ピッチ（傾き）を指定
  maxPitch: 85, // マップの最大ピッチ角度を指定
  bearing: 0, // マップの初期ベアリング（向き）を指定
  hash: true, // URLに地図の状態（中心点座標、ズームレベル、ピッチ、ベアリングなど）を反映させる（地図の状態がURLのハッシュに保存されるため、ページ再読み込み時に同じ状態を保持）
  attributionControl: false, // 著作権表示（アトリビュート）を非表示に設定
});

// ズーム・回転コントロールを追加
map.addControl(new maplibregl.NavigationControl());

// フルスクリーンモードのオンオフ用ボタンを追加
map.addControl(new maplibregl.FullscreenControl());

// 現在位置表示コントロールを追加
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false, // 高精度位置情報を使わない（バッテリー節約のため）
    },
    fitBoundsOptions: { maxZoom: 18 }, // 現在位置にズームインする際の最大ズームレベルを指定
    trackUserLocation: true, // ユーザーが移動すると地図上に位置を追跡する
    showUserLocation: true, // ユーザーの現在位置を地図上に表示する
  })
);

// スケール表示を追加
map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200, // スケールバーの最大幅
    unit: "metric", // メートル単位で表示
  })
);

// 著作権情報を折りたたみ表示にする
map.addControl(
  new maplibregl.AttributionControl({
    compact: true, // 著作権情報をコンパクトな形式で表示
    customAttribution:
      '<a href="https://www.geospatial.jp/ckan/dataset/plateau-22203-numazu-shi-2023" target="_blank">3D都市モデル（Project PLATEAU）沼津市（2023年度）</a>',
  })
);

// マップがすべて読み込まれた後に実行される処理を設定
map.on("load", () => {
  // PLATEAU建築物モデル（PMTiles）ソース
  map.addSource("building", {
    type: "vector",
    url: "pmtiles://./building_lod0.pmtiles",
    minzoom: 14,
    maxzoom: 16,
    attribution:
      "<a href='https://www.geospatial.jp/ckan/dataset/plateau' target='_blank'>3D都市モデル Project PLATEAU (国土交通省)</a>, <a href='https://beta.source.coop/repositories/pacificspatial/flateau/description/' target='_blank'>Flateau (based on PLATEAU, created by Pacific Spatial Solutions, Inc.)</a>",
  });

  // PLATEAU建築物モデル（PMTiles）レイヤ
  map.addLayer({
    id: "bldg-pmtiles",
    source: "building",
    "source-layer": "building_lod0",
    minzoom: 14,
    maxzoom: 23,
    type: "fill-extrusion",
    paint: {
      "fill-extrusion-color": "#FFFFFF",
      "fill-extrusion-opacity": 1,
      "fill-extrusion-height": ["get", "measured_height"],
    },
  });
});
