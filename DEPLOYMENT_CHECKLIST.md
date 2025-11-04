# 綠界金流部署檢查清單 ✅

## 📋 部署前檢查

### 1. 檔案完整性檢查

- [x] `/api/ecpay-create.js` - 建立訂單 API
- [x] `/api/ecpay-callback.js` - 付款結果後端通知 API
- [x] `/api/ecpay-return.js` - 付款完成前端返回 API
- [x] `/public/payment-success.html` - 付款成功頁面
- [x] `/public/payment-failed.html` - 付款失敗頁面
- [x] `/public/api/qa-system.js` - 已更新 enablePaidMode 函數
- [x] `vercel.json` - 已新增路由和環境變數配置
- [x] `.env.example` - 環境變數範例文件
- [x] `ECPAY_INTEGRATION.md` - 整合說明文件
- [x] `package.json` - 已安裝 ecpay_aio_nodejs

### 2. 測試卡號

```
卡號：4311-9522-2222-2222
CVV：222
有效期限：任何未來日期
3D驗證碼：任意數字
```

---

## 🚀 Vercel 部署步驟

### Step 1: 提交代碼

```bash
git add .
git commit -m "✨ 整合綠界金流：新增付費解鎖功能"
git push origin main
```

### Step 2: 設定環境變數（正式環境）

進入 Vercel Dashboard → Settings → Environment Variables

新增：
- `ECPAY_MERCHANT_ID`: 您的正式特店編號
- `ECPAY_HASH_KEY`: 您的正式 HashKey
- `ECPAY_HASH_IV`: 您的正式 HashIV
- `NODE_ENV`: `production`

---

## 🧪 測試流程

1. 開啟 https://ziweidoushu.vercel.app/analysis.html
2. 計算命盤
3. 消耗 3 次免費問答
4. 點擊「付費解鎖」
5. 使用測試卡號完成付款
6. 驗證付費模式是否啟用

---

**部署完成！🎉**
