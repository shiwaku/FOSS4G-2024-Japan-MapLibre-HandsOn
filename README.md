# FOSS4G 2024 Japan MapLibre ハンズオン

## イベント概要

**FOSS4G 2024 Japan** で実施したMapLibre GL JSハンズオンの資料・サンプルコードです。  
PLATEAUの3D都市モデルやLiDAR点群データをPMTiles・3D Tilesで配信し、MapLibre GL JSで表示する技術を学びます。

- **開催日**: 2024年11月9日
- **イベント**: [FOSS4G 2024 Japan ハンズオン](https://www.osgeo.jp/events/2024-2/foss4g-2024-japan/handson)

## 講義資料

- [ハンズオン資料（PDF）](./20241109_FOSS4G2024Japanハンズオン.pdf)
- [ハンズオン資料（PPTX）](./20241109_FOSS4G2024Japanハンズオン.pptx)

## デモ

### サンプル

| # | タイトル | リンク |
|---|---------|--------|
| 01 | 3D都市モデル建築物モデル（PMTiles）の表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/01_3D都市モデル（PMTiles）の表示/) |
| 02 | 3D都市モデル建築物モデル（3D Tiles）の表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/02_3D都市モデル（3DTiles）の表示/) |
| 03 | 3次元点群データ（3D Tiles）の表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/03_3次元点群データ（3DTiles）の表示/) |

### 演習

| # | タイトル | 内容 | リンク |
|---|---------|------|--------|
| 演習1 | 3D都市モデル（PMTiles）の表示 | 建築物の高さに応じた色分けの実装 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/04_3D都市モデル（PMTiles）の表示（演習1）/) |
| 演習2 | 3D都市モデル（PMTiles）の表示 | フィルタリングによる特定建築物の表示・非表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/05_3D都市モデル（PMTiles）の表示（演習2）/) |
| 演習3 | 3D都市モデル（PMTiles）の表示 | クリック時のポップアップ表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/06_3D都市モデル（PMTiles）の表示（演習3）/) |
| 演習4 | 3D都市モデル（3DTiles）の表示 | 3D Tilesを使った建築物モデルの表示 | [デモ](https://shiwaku.github.io/FOSS4G-2024-Japan-MapLibre-HandsOn/07_3D都市モデル（3DTiles）の表示（演習4）/) |

## リポジトリ構成

```
FOSS4G-2024-Japan-MapLibre-HandsOn/
├── 01_3D都市モデル（PMTiles）の表示/          # PMTilesで建築物モデルを3D表示するサンプル
├── 02_3D都市モデル（3DTiles）の表示/           # 3D Tilesで建築物モデルを3D表示するサンプル
├── 03_3次元点群データ（3DTiles）の表示/         # 3D Tilesで点群データを表示するサンプル
├── 04_3D都市モデル（PMTiles）の表示（演習1）/   # 演習1: 高さによる色分け
├── 05_3D都市モデル（PMTiles）の表示（演習2）/   # 演習2: フィルタリング
├── 06_3D都市モデル（PMTiles）の表示（演習3）/   # 演習3: ポップアップ表示
├── 07_3D都市モデル（3DTiles）の表示（演習4）/   # 演習4: 3D Tilesの建築物表示
├── 20241109_FOSS4G2024Japanハンズオン.pdf      # 講義資料（PDF）
└── 20241109_FOSS4G2024Japanハンズオン.pptx     # 講義資料（PPTX）
```

各ディレクトリには以下のファイルが含まれます：

| ファイル | 説明 |
|---------|------|
| `index.html` | HTMLファイル |
| `main.js` | MapLibre GL JS の実装コード |
| `std.json` | 地図スタイル定義ファイル |
| `style.css` | スタイルシート |
