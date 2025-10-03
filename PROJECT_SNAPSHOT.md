# Fortel 紫微斗數排盤系統 - 專案快照

## 📋 專案概覽

這是一個以 JavaScript/TypeScript 實作的紫微斗數排盤系統，遵循中州派傳統。此系統提供完整的紫微斗數排盤功能，包括天盤、地盤、人盤的計算，以及大運、流年、流月、流日的運行分析。

### 🔗 專案資訊
- **版本**: 1.3.4
- **門派**: 中州派
- **許可證**: MIT
- **當前維護者**: iTubai
- **原始作者**: Airic Yu (2022)

## 🏗️ 專案架構

### 📁 檔案結構
```
src/
├── calendar/           # 萬年曆相關
│   ├── calender.ts     # 曆法介面定義
│   ├── defaultCalendar.ts    # 預設曆法實作
│   └── jjonline/       # 農曆轉換函式庫
├── criteria/           # 命盤條件判斷
│   └── boardCriteria.ts # 星曜判斷條件
├── model/              # 核心資料模型
│   ├── destinyBoard.ts  # 命盤主類別
│   ├── destinyConfig.ts # 命運配置
│   ├── cell.ts         # 宮位
│   ├── majorStar.ts    # 主星
│   ├── minorStar.ts    # 輔星
│   ├── miniStar.ts     # 小吉星
│   ├── temple.ts       # 十二宮
│   ├── sky.ts          # 天干
│   ├── ground.ts       # 地支
│   ├── runtime.ts      # 運行時狀態
│   └── ...
├── util/               # 工具函數
│   ├── destinyConfigBuilder.ts     # 配置建構器
│   └── destinyConfigTextParser.ts  # 文字解析器
└── main.ts             # 主入口檔案
```

## 🔧 核心功能模組

### 1. 命盤核心 (`DestinyBoard`)
紫微斗數命盤的核心類別，負責：
- **命盤建立**: 根據出生年月日時建立命盤
- **星曜安放**: 計算各主星、輔星、小吉星的位置
- **宮位配置**: 排定十二宮位置關係
  - 命宮、兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮
  - 遷移宮、交友宮、事業宮、田宅宮、福德宮、父母宮
- **五行屬性**: 計算命盤對應的五行屬性（金、木、水、火、土）
- **大運流年**: 計算大運、流年、流月、流日的宮位

### 2. 星曜系統
#### 主星 (MajorStar)
- **紫微星系**: 紫微、天機、太陽、武曲、天同、廉貞
- **天府星系**: 天府、太陰、貪狼、巨門、天相、天梁、七殺、破軍
- **能量等級**: 各宮位的能量評估 (-1 至 2)

#### 輔星 (MinorStar)  
- **六吉星**: 左輔、右弼、天魁、天鉞、文昌、文曲
- **六煞星**: 火星、鈴星、擎羊、陀羅、地空、地劫
- **四化星**: 化祿、化權、化科、化忌的動態分配

#### 小吉星 (MiniStar)
- **十二宮神煞**: 歲建、龍德、官符等年神星
- **十二長生**: 長生、沐浴、冠帶等人事星
- **孤辰寡宿**等特殊星曜

### 3. 配置建構器 (`DestinyConfigBuilder`)
提供多種方式建立命運配置：
- **農曆參數**: `withlunar()` - 使用農曆年月日
- **西曆參數**: `withSolar()` - 使用西曆年月日，自動轉農曆
- **文字描述**: `withText()` - 解析自然語言描述

### 4. 曆法系統
- **年曆轉換**: 西曆與農曆的雙向轉換
- **天干地支**: 年月日時的四柱計算
- **萬年曆**: calendar.js 曆法轉換函式庫

### 5. 條件判斷 (`BoardCriteria`)
提供靈活的命盤條件查詢：
- **宮位判斷**: 檢查特定宮位是否滿足條件
- **星曜組合**: 判斷多個星曜的組合情況
- **空間關係**: 支持自宮、對宮、三方四正等不同範圍
- **自然語言**: 支援中文描述條件解析

## 📊 資料模型

### 命盤資料結構
```typescript
DestinyBoard {
  config: DestinyConfig           // 基本配置（出生資料）
  element: Element               // 五行屬性和局數
  destinyMaster: MajorStar       // 命主星
  bodyMaster: MajorStar          // 身主星  
  startControl: Ground          // 起運宮位
  cells: Cell[]                 // 十二宮
  bornStarDerivativeMap: Map    // 四化星對應表
}
```

### 宮位資料結構
```typescript
Cell {
  sky: Sky                       // 天干
  ground: Ground                 // 地支
  temples: Temple[]              // 所屬宮位
  majorStars: MajorStar[]        // 主星
  minorStars: MinorStar[]        // 輔星
  miniStars: MiniStar[]          // 小吉星
  scholarStar: MiniStar          // 文昌星
  yearGodStar: MiniStar          // 年神星
  leaderStar: MiniStar           // 領導星
  lifeStage: LifeStage           // 人生階段
  ageStart: number              // 起始年齡
  borrowCells: BorrowCell[]      // 借星宮位
}
```

### 運行時資料結構 (RuntimeContext)
```typescript
RuntimeContext {
  tenYear: {                     // 十年大運
    cellGround: Ground           // 大運宮位
    groundStars: Map             // 飛星表
    starDerivativeMap: Map      // 四化表
  }
  year: { ... }                  // 流年
  month: { ... }                 // 流月  
  day: { ... }                   // 流日
  // 基礎四柱
  yearSky/Ground: Sky/Ground     // 年柱
  monthSky/Ground: Sky/Gound     // 月柱
  daySky/Ground: Sky/Ground      // 日柱
}
```

## 🎯 主要使用場景

### 1. 基本排盤
```javascript
// 使用農曆參數
const destinyBoard = new DestinyBoard(
  DestinyConfigBuilder.withlunar({
    year: 1952, month: 3, day: 15,
    isLeapMonth: false,
    bornTimeGround: DayTimeGround.getByName('寅時'),
    configType: ConfigType.SKY,
    gender: Gender.F,
  })
);
```

### 2. 條件查詢
```javascript
// 檢查七殺坐命
const isSevenKillInDestiny = new BoardCriteria(destinyBoard)
  .ofTemple(Temple.TEMPLE_DESTINY)
  .hasStar(MajorStar.MAJOR_STAR_GENERAL);

// 檢查三方四正是否有桃花星
const hasRomanceStars = new BoardCriteria(destinyBoard)
  .withCellsType(CellsScope.FOUR)
  .hasAnyStars([MajorStar.MAJOR_STAR_GREED, ...]);
```

### 3. 大運流年分析
```javascript
const runtimeContext = destinyBoard.getRuntimContext({
  lunarYear: 2023,
  lunarMonth: 5,
  lunarDay: 1,
  leap: false
});
```

## 🧪 測試覆蓋

專案包含完整的單元測試：
- **destinyConfig.test.ts**: 配置建構器測試
- **cell.test.ts**: 宮位功能測試  
- **runtime.test.ts**: 運行時狀態測試
- **calendar.test.ts**: 曆法轉換測試

## 🛠️ 技術棧

- **語言**: TypeScript 5.3+
- **環境**: Node.js 16+
- **測試**: Jest 29.7+
- **打包**: Webpack 5.89+
- **代碼品質**: ESLint + Prettier

## 🎨 設計特色

1. **型別安全**: 完整的 TypeScript 型別定義
2. **物件導向**: 清楚的職責分離和模組化設計
3. **資料不可變**: 使用 Object.freeze 確保資料安全
4. **靈活查詢**: 支援多種條件組合和查詢方式
5. **中州派正統**: 遵循傳統紫微斗數理論

## 🚀 使用方式

### 📦 NPM 安裝
```bash
npm install fortel-ziweidoushu
```

### 🔧 程式碼整合
```javascript
import { DestinyBoard, DestinyConfigBuilder, ConfigType, Gender, DayTimeGround } from 'fortel-ziweidoushu';

const destinyBoard = new DestinyBoard(
  DestinyConfigBuilder.withText('1952年三月十五日寅時女士')
);

console.log(destinyBoard.toString());
console.log(destinyBoard.toJSON());
```

### 🌐 前端介面系統

專案提供了現代化的前端介面，具有以下特色：

#### ✨ 前端功能特色
- **AI 驅動介面**: ChatGPT 深度命盤分析和智能問答系統
- **4x4 命盤圖表**: 視覺化的十二宮位配置顯示，中央合併命主信息
- **互動問答**: Credit 限制的個性化問答功能 (3次/月)
- **付費解鎖**: 1小時無限問答模式
- **響應式設計**: 支援桌面、平板、手機等多種裝置  
- **現代化 UI**: 基於 Tailwind CSS 的漸層卡片設計
- **真實計算**: 整合 TypeScript 核心庫的真實命盤運算
- **品牌識別**: 專屬紫色漸層 favicon 和品牌色彩
- **多追蹤系統**: Google Analytics (GTM) + Groundhog 雙重追蹤
- **商業整合**: Google AdSense fate-square 廣告單元

#### 📊 追蹤與分析系統
- **頁面瀏覽追蹤**: 自動記錄用戶訪問
- **計算行為分析**: 追蹤命盤計算次數和參數
- **用戶偏好統計**: 分析曆法類型、時辰使用頻率
- **隱私保護**: 符合 GDPR 規範的數據收集
- **即時反饋**: 表單驗證、載入狀態和使用者指引
- **農曆西曆轉換**: 自動支援農曆和西曆輸入

#### 📁 前端檔案結構
```
public/
├── index.html                  # 主要使用介面 (整合版)
├── simple-dev.html            # 簡化開發版本
├── demo.html                  # 功能展示頁面
├── browser-test.html          # 端到端測試頁面
└── api/
    └── destiny-calculator.js  # 前端API接合器

前端輔助檔案/
├── tailwind.config.js         # Tailwind CSS 設定
├── vite.config.ts            # Vite 開發設定
└── 測試檔案/
    ├── simple-test.js         # Node.js 自動化測試
    ├── run-tests.sh          # 測試執行腳本
    └── TEST_RESULTS.md       # 測試報告
```

#### 🎨 UI 特色
- **漸層背景**: 紫藍色調的現代化背景
- **玻璃效果**: 半透明卡片設計
- **動態圖示**: Lucide React 圖示系統
- **表單驗證**: 完整的輸入驗證和使用者提示
- **載入狀態**: 計算過程中的視覺回饋
- **能量等級標示**: 星曜的能量強度視覺化

#### 🛠️ 核心功能
- **性別選擇**: 男性/女性按鈕切換 (已修復 onclick 事件)
- **曆法類型**: 農曆/西曆選擇 (已修復按鈕響應)
- **年月日選單**: 動態日期選單 (已修復自動填充)
- **時辰選擇**: 完整十二時辰選項
- **真實計算**: 整合 destiny-calculator.js API
- **結果展示**: 完整的宮位和星曜資訊顯示

#### 📱 使用方法

**方法一：HTTP 伺服器 (推薦)**
```bash
# 啟動 Python HTTP 伺服器
cd public && python3 -m http.server 8080

# 存取主頁面
open http://localhost:8080/
```

**方法二：Vite 開發伺服器**
```bash
# 使用 Vite 開發模式
npm run dev
```

### 🌐 Vercel 雲端部署

#### 🔧 部署配置
- **Framework Preset**: 自動檢測 (靜態 + Serverless Functions)
- **Build Command**: `npm run build` (簡化為 echo 命令)
- **Output Directory**: `public` (靜態檔案目錄)
- **Install Command**: `npm install`
- **Runtime**: Node.js 18.x (Serverless Functions)

#### 📁 部署檔案結構
```
.vercelignore         # 部署忽略檔案
public/               # 前端靜態檔案
├── index.html        # 主應用頁面
├── favicon.svg       # 品牌圖標
├── favicon.ico       # 備用圖標
└── api/              # 前端 API 代理
api/                  # Vercel Serverless Functions
├── calculate.js      # 命盤計算 API
├── health.js         # 健康檢查 API
└── status.js         # 狀態查詢 API
build/                # 編譯後的 TypeScript 檔案
src/                  # TypeScript 源代碼
```

#### 🚀 自動部署流程
- **GitHub Push**: 自動觸發 Vercel 重新部署
- **零配置部署**: 移除 vercel.json，使用自動檢測
- **構建過程**: npm install → npm run build → 部署
- **路由配置**: API 端點自動路由到 api/ 目錄函數
- **持續集成**: 每次推送 main 分支自動重新部署

#### 🔧 開發和測試
```bash
# 執行自動化測試
node simple-test.js

# 執行完整測試腳本
./run-tests.sh

# 瀏覽器端到端測試
open http://localhost:8080/browser-test.html
```

#### ✅ 修復狀態
- **按鈕互動**: 所有按鈕已修復並響應正常
- **日期選單**: 年月日下拉選單自動填充
- **表單驗證**: 完整的輸入檢查和錯誤提示
- **API 整合**: 真實的紫微斗數計算功能
- **調試清理**: 移除調試 alert，保留功能性提示
- **測試覆蓋**: 100% 自動化測試通過率

---

**注意**: 此系統基於傳統紫微三數理論開發，適用於命理研究、傳統文化傳承等用途。前端介面提供了友善的互動體驗，讓傳統命理學更貼近現代使用者。
