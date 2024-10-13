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
  center: [138.858642, 35.102764], // マップの初期中心点を指定（経度, 緯度）
  zoom: 16.5, // マップの初期ズームレベルを設定
  pitch: 67, // マップの初期ピッチ（傾き）を指定
  maxPitch: 85, // マップの最大ピッチ角度を指定
  bearing: 28.9, // マップの初期ベアリング（向き）を指定
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
  // deck.glのレイヤーを追加する
  const overlay = new deck.MapboxOverlay({
    interleaved: true, // deck.glレイヤーを他のMapLibre GL JSのレイヤーと重ねて描画
    layers: [
      // 建築物モデル（3D Tiles）を表示するレイヤーを追加
      new deck.Tile3DLayer({
        id: "numazushi-bldg", // レイヤーIDを設定
        // data: "https://public-data.geolonia.com/kaken-3dmap-2024/3dtiles-v0-bldg-demo/tileset.json", // 3D TilesのデータURL
        data: "http://localhost:8000/3DTiles_v0.0_4979/tileset.json",
        // data: "https://assets.cms.plateau.reearth.io/assets/a0/f09393-e8b1-404f-bd81-7587ac43a7f6/22203_numazu-shi_city_2023_citygml_2_op_bldg_3dtiles_lod3_no_texture/tileset.json",
        opacity: 1, // レイヤーの不透明度を設定（1は完全に不透明）
        onTileLoad: (d) => {
          const { content } = d;
          // 建築物モデルの高さから沼津駅周辺のジオイド高と標高を差し引く
          content.cartographicOrigin.z -= 40.442 + 8.5;
        },
      }),
    ],
  });
  // 作成したoverlayを地図に追加
  map.addControl(overlay);
});
