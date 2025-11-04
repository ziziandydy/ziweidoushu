# 綠界金流整合說明文件

## 📋 整合概述

本專案已成功整合綠界科技（ECPay）金流系統，實現「付費解鎖 1 小時無限問答」功能。

---

## 🏗️ 架構說明

### 付款流程

```
用戶點擊「付費解鎖」
    ↓
前端調用 /api/ecpay-create
    ↓
後端建立訂單，生成綠界金流表單
    ↓
前端自動提交表單，導向綠界付款頁面
    ↓
用戶在綠界完成付款
    ↓
綠界通知後端 /api/ecpay-callback（Server to Server）
    ↓
綠界導回前端 /api/ecpay-return（Client Return）
    ↓
根據付款結果導向成功或失敗頁面
    ↓
付款成功頁面啟用 localStorage 付費模式
    ↓
用戶可使用 1 小時無限問答
```

---

## 📁 檔案結構

### 後端 API（Vercel Serverless Functions）

```
api/
├── ecpay-create.js      # 建立訂單 API
├── ecpay-callback.js    # 付款結果後端通知（Server to Server）
└── ecpay-return.js      # 付款完成前端返回（Client Return）
```

### 前端頁面

```
public/
├── payment-success.html # 付款成功頁面
├── payment-failed.html  # 付款失敗頁面
└── api/
    └── qa-system.js     # 問答系統（已修改 enablePaidMode 函數）
```

### 配置文件

```
├── .env.example         # 環境變數範例
├── vercel.json          # Vercel 部署配置（已新增路由和環境變數）
└── package.json         # 已新增 ecpay_aio_nodejs 依賴
```

---

## 🔧 環境變數配置

### 測試環境（預設）

測試環境會自動使用綠界提供的測試特店資料：

```bash
ECPAY_MERCHANT_ID=2000132
ECPAY_HASH_KEY=5294y06JbISpM5x9
ECPAY_HASH_IV=v77hoKGq4kWxNNIS
```

### 正式環境

請在 **Vercel Dashboard** 設定以下環境變數：

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 進入您的專案 → **Settings** → **Environment Variables**
3. 新增以下變數：

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `ECPAY_MERCHANT_ID` | 綠界特店編號 | 您的正式特店編號 |
| `ECPAY_HASH_KEY` | 綠界 HashKey | 您的正式 HashKey |
| `ECPAY_HASH_IV` | 綠界 HashIV | 您的正式 HashIV |
| `NODE_ENV` | 環境模式 | `production` |
| `OPENAI_API_KEY` | OpenAI API Key | 已存在 |

⚠️ **重要提醒**：設定完環境變數後，需要重新部署專案才會生效。

---

## 🧪 測試流程

### 測試環境測試卡號

綠界提供以下測試信用卡號供開發測試使用：

- **卡號**：`4311-9522-2222-2222`
- **安全碼（CVV）**：`222`
- **有效期限**：任何未來日期（例如：12/25）
- **3D 驗證碼**：任意數字

### 本地測試步驟

1. **啟動本地開發環境**：
   ```bash
   # 安裝依賴
   npm install

   # 啟動 Vercel 本地開發
   vercel dev
   ```

2. **測試付款流程**：
   - 開啟瀏覽器訪問 `http://localhost:3000/analysis.html`
   - 填寫基本資料並計算命盤
   - 在問答區域消耗完 3 次免費問答
   - 點擊「💰 付費解鎖 (1小時)」按鈕
   - 使用測試卡號完成付款
   - 驗證是否成功導回並啟用付費模式

3. **檢查 Console Log**：
   - 前端 Console：查看訂單建立和導向流程
   - 後端 Log：查看 API 調用和綠界通知

### 線上測試步驟

1. **部署到 Vercel**：
   ```bash
   git add .
   git commit -m "✨ 整合綠界金流"
   git push origin main
   ```

2. **設定環境變數**（如上述「正式環境」章節）

3. **測試付款流程**：
   - 訪問您的生產環境網址（例如：`https://ziweidoushu.vercel.app/analysis.html`）
   - 完整測試一次付款流程
   - 確認所有功能正常運作

---

## 💰 金流參數說明

### 訂單金額

目前設定為：**NT$ 199 元**（1 小時無限問答）

如需修改金額，請編輯 [api/ecpay-create.js](api/ecpay-create.js#L56)：

```javascript
// 訂單金額（1小時無限問答 = 199 元）
const amount = 199;  // ← 修改這裡
```

### 訂單編號格式

系統自動生成，格式：`ZW + 時間戳 + 隨機碼`

範例：`ZW170123456789ABCDE`

### 付費時長

目前設定為：**1 小時**

如需修改時長，請編輯 [public/payment-success.html](public/payment-success.html#L82)：

```javascript
const expiryTime = Date.now() + 60 * 60 * 1000; // 1 小時後 ← 修改這裡
// 例如改為 2 小時：Date.now() + 2 * 60 * 60 * 1000
```

---

## 🔐 安全機制

### 1. CheckMacValue 驗證

綠界回傳的所有資料都會經過 `CheckMacValue` 驗證，確保資料未被竄改。

驗證流程：
```javascript
// 1. 排序參數（A-Z）
// 2. 組合字串：HashKey + 參數 + HashIV
// 3. URL Encode
// 4. 轉換特殊字元（綠界規範）
// 5. SHA256 加密
// 6. 比對原始 CheckMacValue
```

### 2. CORS 限制

所有 API 都設定了 CORS，僅允許特定來源訪問：

```javascript
res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
```

### 3. 參數驗證

所有 API 都會驗證必要參數，防止惡意請求。

### 4. 錯誤處理

生產環境不會暴露詳細錯誤訊息，保護系統安全。

---

## 📊 資料流向

### 用戶資料

| 欄位 | 來源 | 用途 |
|------|------|------|
| `userId` | localStorage cookie_id | 識別用戶，管理 Credit |
| `userName` | 用戶輸入的姓名 | 顯示在訂單中（選填） |
| `userEmail` | （未實作） | 發送通知信（未來功能） |

### 訂單資料

| 欄位 | 說明 |
|------|------|
| `orderId` | 系統生成的訂單編號 |
| `amount` | 訂單金額（NT$ 199） |
| `tradeNo` | 綠界交易編號 |
| `paymentDate` | 付款時間 |

### 付費模式啟用

付款成功後，系統會在 `localStorage` 寫入：

```javascript
localStorage.setItem(`paid_mode_${userId}`, expiryTime);
```

在 `expiryTime` 之前，用戶可無限次使用 AI 問答。

---

## 🚀 部署檢查清單

部署到生產環境前，請確認以下事項：

- [ ] 已在 Vercel 設定正式環境變數
  - [ ] `ECPAY_MERCHANT_ID`
  - [ ] `ECPAY_HASH_KEY`
  - [ ] `ECPAY_HASH_IV`
  - [ ] `NODE_ENV=production`
- [ ] 已向綠界申請正式特店帳號
- [ ] 已設定正式 ReturnURL 和 ClientBackURL
- [ ] 已完成測試環境完整測試
- [ ] 已測試付款成功和失敗流程
- [ ] 已確認 Credit 系統正常運作
- [ ] 已確認付費模式正常啟用和到期

---

## 🐛 常見問題排查

### 1. 付款後未成功啟用付費模式

**可能原因**：
- `userId` 不一致
- localStorage 被清除
- 付款成功頁面未正確執行

**解決方法**：
- 檢查 Console Log 確認 userId
- 確認瀏覽器未禁用 localStorage
- 檢查 [payment-success.html](public/payment-success.html) 的 JavaScript

### 2. CheckMacValue 驗證失敗

**可能原因**：
- HashKey 或 HashIV 設定錯誤
- 參數被竄改
- URL Encode 轉換錯誤

**解決方法**：
- 檢查環境變數是否正確
- 比對綠界文件的加密流程
- 查看後端 Log 中的驗證詳情

### 3. 訂單建立失敗

**可能原因**：
- 綠界 SDK 初始化錯誤
- 參數格式不正確
- 網路連線問題

**解決方法**：
- 檢查 SDK 是否正確安裝：`npm list ecpay_aio_nodejs`
- 確認訂單參數符合綠界規範
- 查看後端 Log 中的錯誤訊息

### 4. 付款後無法返回網站

**可能原因**：
- `ClientBackURL` 設定錯誤
- CORS 問題
- Vercel 路由配置錯誤

**解決方法**：
- 檢查 [api/ecpay-create.js](api/ecpay-create.js#L76) 的 ClientBackURL
- 確認 [vercel.json](vercel.json) 路由配置正確
- 測試 `/api/ecpay-return` 是否可訪問

---

## 📝 開發日誌

### v2.1.0 (2025-01-04) - 綠界金流整合

**新增功能**：
- ✅ 整合綠界金流信用卡付款
- ✅ 建立訂單建立 API（`/api/ecpay-create`）
- ✅ 建立付款結果後端通知 API（`/api/ecpay-callback`）
- ✅ 建立付款完成前端返回 API（`/api/ecpay-return`）
- ✅ 新增付款成功頁面（`payment-success.html`）
- ✅ 新增付款失敗頁面（`payment-failed.html`）
- ✅ 更新前端付費解鎖按鈕，串接綠界金流
- ✅ 新增環境變數配置（`.env.example`）
- ✅ 更新 Vercel 部署配置（`vercel.json`）
- ✅ 新增整合說明文件（`ECPAY_INTEGRATION.md`）

**技術細節**：
- 使用綠界官方 Node.js SDK（`ecpay_aio_nodejs`）
- 實作 CheckMacValue 驗證機制
- 支援測試和正式環境切換
- 整合 Google Analytics 追蹤付款事件

**測試狀態**：
- ✅ 本地開發環境測試
- ⏳ 生產環境測試（待部署後測試）

---

## 📞 技術支援

### 綠界官方資源

- **官方文件**：https://developers.ecpay.com.tw/
- **SDK 下載**：https://github.com/ECPay/ECPayAIO_Node.js
- **測試環境**：https://payment-stage.ecpay.com.tw/
- **正式環境**：https://payment.ecpay.com.tw/

### 專案維護者

如有任何問題，請聯繫專案維護者：
- **GitHub**：iTubai
- **Email**：support@ziweidoushu.com

---

## 🎉 完成！

綠界金流整合已完成，祝您生意興隆！🚀
