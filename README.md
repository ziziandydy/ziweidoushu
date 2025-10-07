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
- 🧠 **GPT-4o 整合**: OpenAI 最新 GPT-4o 模型深度命理解析
- 📝 **章節化輸出**: 自動格式化的美觀分析結果
- 👶 **白話文解釋**: 12歲小朋友也能理解的正面解讀
- ⚡ **即時響應**: 無需重新載入的動態更新
- 🔐 **安全防護**: 完整的輸入驗證和 XSS 保護

### 💬 **互動問答系統**
- 🎫 **後端 Credit 管理**: 每月3次免費問答機會（後端驗證）
- 🧵 **Thread 對話**: 連續對話功能，自動記憶上下文
- 🎯 **命盤自動帶入**: 每次問答自動包含完整命盤信息
- ⚡ **快速提問**: 流年運勢、工作、桃花等預設問題
- 💎 **付費解鎖**: 1小時無限問答商業模式
- 🔐 **安全保護**: 後端驗證、Rate Limiting、XSS 防護

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

## 🎯 最新功能更新 (v2.1.0 - 2024)

Airic Yu (Original Author)
- Owner of Myfortel 紫微斗數起盤網站(舊版) ( https://www.myfortel.com/ )
- Owner of Myfortel 紫微斗數起盤網站(新版) ( https://airicyu.github.io/myfortel/ )
- Author of 紫微斗數排盤 library for Java ( https://github.com/airicyu/Fortel )
- Author of 紫微斗數排盤 library for JS ( https://www.npmjs.com/package/fortel-ziweidousju )

### 🆕 **v2.1.0 重大更新**

#### 🚀 **AI 升級**
- ✅ **GPT-4o 模型**: 升級至 OpenAI 最新 GPT-4o，回應更準確、更快速
- ✅ **Thread 對話系統**: 連續對話功能，自動記憶上下文，提供更連貫的分析
- ✅ **智能命盤整合**: 每次問答自動帶入完整命盤資料，回應更精準

#### 🔒 **安全性強化**
- ✅ **後端 Credit 驗證**: Credit 管理移至後端，防止繞過
- ✅ **CORS 限制**: 限制 API 訪問來源，防止濫用
- ✅ **輸入清理**: 完整的 XSS 防護和輸入驗證
- ✅ **錯誤處理**: 不暴露敏感信息的安全錯誤處理

#### 🐛 **Bug 修復**
- ✅ 修復 api/question.js 語法錯誤
- ✅ 修復 destiny-calculator.js 重複鍵定義
- ✅ 改進農曆轉換算法（移除隨機數）
- ✅ 整合真實 TypeScript 計算引擎到 API

### 💬 Q&A 系統
- ✅ 後端 Credit 計費機制 (3次/月)
- ✅ Thread 連續對話功能
- ✅ 預設問題快速提問
- ✅ 付費解鎖模式 (1小時無限)
- ✅ 安全的用戶狀態管理

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