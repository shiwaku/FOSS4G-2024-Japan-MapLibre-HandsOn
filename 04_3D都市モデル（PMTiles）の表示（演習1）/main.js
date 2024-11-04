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
  })
);

// マップがすべて読み込まれた後に実行される処理を設定
map.on("load", () => {
  // 3D都市モデル建築物モデル（PMTiles）ソース
  map.addSource("building", {
    type: "vector", // ソースタイプを指定
    url: "pmtiles://https://public-data.geolonia.com/foss4g-2024-japan-handson/bldg-pmtiles/PLATEAU_2022_LOD1_takeshiba.pmtiles", // PMTilesのURLを指定
    minzoom: 14, // ソースの最小ズームレベル
    maxzoom: 16, // ソースの最大ズームレベル
    attribution:
      "<a href='https://www.geospatial.jp/ckan/dataset/plateau' target='_blank'>3D都市モデル Project PLATEAU (国土交通省)</a>, <a href='https://github.com/amx-project/apb' target='_blank'>法務省地図XMLアダプトプロジェクト</a>", // データ提供元のクレジットを設定
  });

  // 3D都市モデル建築物モデル（PMTiles）レイヤ
  map.addLayer({
    id: "bldg-pmtiles", // レイヤのIDを指定
    source: "building", // 使用するソースを指定
    "source-layer": "PLATEAU_2022_LOD1_takeshiba", // ソース内のレイヤ名を指定
    minzoom: 14, // レイヤの最小ズームレベル
    maxzoom: 23, // レイヤの最大ズームレベル
    type: "fill-extrusion", // レイヤのタイプを指定（3D描画）
    paint: {
      // "fill-extrusion-color": "#FFFFFF", // 建物の色を白に設定
      // 建築物の高さに応じて色分けを設定
      "fill-extrusion-color": [
        "step", // 高さ情報に基づき段階的に色を変更する関数
        ["get", "measuredHeight"], // 建物の高さ情報をデータの属性から取得
        "#999999", // 高さが0の時の色
        10, "#0000FF", // 高さが10を超えた場合の色（青）
        20, "#00FFFF", // 高さが20を超えた場合の色（水色）
        30, "#00FF00", // 高さが30を超えた場合の色（緑）
        50, "#FFFF00", // 高さが50を超えた場合の色（黄色）
        100, "#FF7F00", // 高さが100を超えた場合の色（オレンジ）
        150, "#FF0000", // 高さが150を超えた場合の色（赤）
        200, "#CB0098" // 高さが200を超えた場合の色（紫）
      ],
      "fill-extrusion-opacity": 1, // 建物の不透明度を設定
      "fill-extrusion-height": ["get", "measuredHeight"], // 建築物の高さ情報をデータの属性から取得して設定
    },
  });
});
