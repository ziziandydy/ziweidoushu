# 紫微斗數命盤計算系統 ✨

**現代化 Web 應用 | AI 驅動命理解析 | 商業化完整方案**

---

## 🎯 專案特色

一個整合了 **TypeScript 核心計算引擎**、**AI 深度分析** 和 **完整商業功能** 的現代化紫微斗數系統。遵循**中州派**傳統理論，提供從基礎排盤到 AI 智能解析的完整解決方案。

## ✨ 主要功能

### 💫 **核心計算能力**
- 📊 **專業排盤**: 基於 TypeScript 的準確計算引擎
- 🌍 **十二宮位**: 完整的宮位配置和星曜安放
- 🔮 **多重驗證**: 詳細的星曜條件檢查和驗證
- 📈 **能量分析**: 主星、輔星的小吉星能量等級評估

### 🤖 **AI 智能分析**
- 🧠 **ChatGPT 整合**: OpenAI GPT-4 深度命理解析
- 📝 **章節化輸出**: 自動格式化的美觀分析結果
- 👶 **白話文解釋**: 12歲小朋友也能理解的正面解讀
- ⚡ **即時響應**: 無需重新載入的動態更新

### 💬 **互動問答系統**
- 🎫 **Credit 機制**: 每月3次免費問答機會
- ⚡ **快速提問**: 流年運勢、工作、桃花等預設問題
- 💎 **付費解鎖**: 1小時無限問答商業模式
- 🔐 **隱私保護**: LocalStorage 用戶狀態追蹤

### 💰 **商業化功能**
- 📊 **Google AdSense**: fate-square 廣告單元優化整合
- 📈 **雙重追蹤**: Google Analytics + Groundhog 數據分析
- 🎨 **廣告優化**: 側邊欄位置無影響用戶體驗
- 📄 **合規文件**: 完整的 ads.txt 授權配置

### 🎨 **現代化界面**
- 📱 **響應式設計**: 支援桌面、平板、手機多種裝置
- 🎭 **4步驟導航**: 基本資料→圖表→星曜→分析的清晰流程
- 🎯 **自動滾動**: 步驟切換時平滑滾動到頁面頂部
- 🌈 **品牌識別**: 紫色漸層 favicon 和專業配色

## 🌐 線上體驗

**🔗 立即試用**: [https://ziweidoushy.vercel.app](https://ziweidoushu.vercel.app)

**使用流程**：
1. 📝 **填寫基本資料**（姓名、性別、出生年月日時）
2. 📊 **查看命盤圖表**（4×4 網格視覺化十二宮位）
3. ⭐ **分析星曜配置**（主星、輔星詳細資訊）
4. 🤖 **獲得 AI 解析**（深度的命理分析和互動問答）

## 🔧 開發者整合

### 📦 安裝核心庫

```bash
npm install fortel-ziweidoushu
```

### 💻 TypeScript 集成

```typescript

import { DestinyBoard, DestinyConfigBuilder } from 'fortel-ziweidoushu';

// 創建命盤
const destinyBoard = new DestinyBoard(
  DestinyConfigBuilder.withText('1990年三月十五日寅時男')
);

// 輸出結果
console.log(destinyBoard.toString());
console.log(destinyBoard.toJSON());
```

### 🔌 API 接口

**命盤計算**:
```
POST /api/calculate
{
  "userProfile": {
    "name": "用戶姓名",
    "gender": "M|F",
    "birthYear": 1990,
    "birthMonth": 1,
    "birthDay": 1,
    "birthHour": "子時",
    "calendarType": "solar|lunar",
    "isLeapMonth": false
  }
}
```

**AI 分析**:
```
POST /api/analyze
{
  "userProfile": {...},
  "destinyData": {...}
}
```

## 🏗️ 專案架構

### 🎨 前端 (Static Web App)
```
public/
├── index.html           # 主要用戶界面
├── favicon.svg         # 品牌圖標
├── ads.txt             # Google AdSense 授權
└── api/               # 前端API代理
    ├── destiny-calculator.js
    ├── ai-analyzer.js
    └── qa-system.js
```

### ⚡ 後端 (Serverless Functions)
```
api/
├── calculate.js         # 命盤計算
├── analyze.js          # AI分析 (ChatGPT)
├── question.js         # 問答系統
├── health.js           # 健康檢查
└── status.js           # 服務狀態
```

### 🔧 核心模組 (TypeScript)
```
src/
├── model/              # 資料模型
├── calendar/           # 曆法轉換
├── criteria/           # 條件判斷
└── util/               # 工具函數
```

## 🚀 部署設置

### 🌐 Vercel 自動部署

1. **Fork 此專案到您的 GitHub**
2. **連接 Vercel**: 匯入 GitHub 專案
3. **配置環境變數**: 設置 `OPENAI_API_KEY`
4. **自動部署**: 每次 push 到 main 分支自動部署

### 🔧 環境變數

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

## 🎯 最新功能更新 (v2.0.0)

### 🤖 AI 分析增強
- ✅ ChatGPT GPT-4 集成
- ✅ 多章節格式化 (### 標題解析)
- ✅ 智能 12歲白話文解釋
- ✅ 實時API響應和錯誤處理

### 💬 Q&A 系統
- ✅ Credit 計費機制 (3次/月)
- ✅ 預設問題快速提問
- ✅ 付費解鎖模式 (1小時無限)
- ✅ LocalStorage 用戶狀態管理

### 💰 商業化功能
- ✅ Google AdSense 優化整合
- ✅ Google Analytics + Groundhog 追蹤
- ✅ 側邊欄廣告位置優化
- ✅ 完整的 ads.txt 合規配置

### 🎨 UX 改進
- ✅ 自動滾動到頁面頂部
- ✅ 西曆預設選擇 (更符合習慣)
- ✅ 移除調試元素，產品化界面
- ✅ 響應式設計優化

## 📋 許可證

**MIT License** | Copyright (c) 2022 Airic Yu | Maintained by iTubai

---

**🎉 現在就體驗完整的紫微斗數 AI 分析系統！**