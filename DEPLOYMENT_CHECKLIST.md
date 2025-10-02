# 🚀 紫微斗數系統 Vercel 部署檢查清單

## ✅ 準備就緒狀態

### 代碼準備完成
- ✅ **所有文件已提交**: 31個文件已提交到 git
- ✅ **Vercel 配置**: `vercel.json` 已創建
- ✅ **Package.json**: 啟動腳本已更新
- ✅ **README.md**: 部署說明已添加

### 功能測試完成
- ✅ **API 服務器**: localhost:3001 正常運行
- ✅ **前端介面**: localhost:8080 正常運行
- ✅ **星曜顯示**: 真實數據顯示正確
- ✅ **計算流程**: 完整資料流程測試通過

---

## 🔐 GitHub 認證設置

### 方法 1: GitHub CLI (推薦)
```bash
# 1. 安裝 GitHub CLI
brew install gh

# 2. 登入 GitHub
gh auth login

# 3. 推送代碼
git push origin main
```

### 方法 2: Personal Access Token
```bash
# 1. 前往 GitHub Settings > Developer settings > Personal access tokens
# 2. 生成新 token (勾選 repo 權限)
# 3. 設置 git 認證
git config --global credential.helper store
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/ziziandydy/ziweidoushu.git
git push origin main
```

---

## 🌐 Vercel 部署步驟

### 1. 前往 Vercel
- 🌐 網址: https://vercel.com/dashboard
- 📝 登入 GitHub 帳號

### 2. 創建新專案
- ➕ 點擊 "New Project"
- 📂 選擇 repository: `ziziandydy/ziweidoushu`
- 🔧 Vercel 會自動檢測配置

### 3. 配置設置
- 📁 **Framework Preset**: Other
- 📂 **Root Directory**: `/` (默認)
- 📝 **Build Command**: (空)
- 📂 **Output Directory**: `public` (Vercel 會處理)
- 🌐 **Install Command**: `npm install`

### 4. 部署測試
- 🚀 點擊 "Deploy"
- ⏳ 等待部署完成 (~2-3分鐘)

---

## 🧪 部署後測試

### API 測試
```bash
# 健康檢查
curl https://YOUR_APP_URL.vercel.app/api/health

# 計算測試
curl -X POST https://YOUR_APP_URL.vercel.app/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試",
    "gender": "M",
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": "午時",
    "calendarType": "solar",
    "isLeapMonth": false
  }'
```

### 前端測試
- 🌐 開啟: https://YOUR_APP_URL.vercel.app/
- 📝 填寫表單
- 🎯 點擊「計算命盤」
- ✅ 檢查星曜顯示正確

---

## 📊 部署配置說明

### vercel.json 配置
- **Static Files**: `public/` 目錄的所有靜態文件
- **API Routes**: `api-server.js` 作為 Node.js 函數
- **CORS**: 已設置允許所有來源
- **Environment**: `NODE_ENV=production`

### 預期行為
- 🎯 **前端**: 靜態文件直接服務 (`public/index.html`)
- 🔌 **API**: `/api/*` 路由轉發到 `api-server.js`
- 🌐 **CORS**: 允許跨域請求
- 📱 **響應式**: 支援桌面和移動設備

---

## 🆘 常見問題

### Q: Vercel 部署失敗
**A**: 檢查 Node.js 版本 (`package.json` engines)
- ✅ 已設置: `"node": ">=16.0.0"`

### Q: API 無法訪問
**A**: 檢查路由配置
- ✅ `vercel.json` 已配置 API 路由

### Q: 前端顯示錯誤
**A**: 檢查靜態文件路徑
- ✅ 所有前端文件在 `public/` 目錄

### Q: CORS 錯誤
**A**: API 回應已設置 CORS 頭部
- ✅ `Access-Control-Allow-Origin: *`

---

## 🎉 成功指標

部署成功後，你將看到：
- 🌐 **線上網址**: https://YOUR_APP.vercel.app/
- ⚡ **API 回應**: JSON 格式的紫微斗數計算結果
- 📱 **完整功能**: 表單填寫 → 計算 → 結果顯示
- 🎯 **真實數據**: 基於 TypeScript 核心庫的準確計算

**恭喜！你的紫微斗數系統已成功上線！** 🎊
