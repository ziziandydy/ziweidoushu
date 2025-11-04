# 付款狀態恢復功能說明

## 📝 功能概述

當用戶點擊「付費解鎖」按鈕並完成付款後，系統會自動恢復用戶離開前的完整狀態，包括：
- ✅ 命盤分析結果
- ✅ AI 詳細解析
- ✅ 對話記錄（聊天歷史）
- ✅ 當前所在的步驟頁面

## 🔄 工作流程

### 1. 付款前 - 保存狀態

當用戶點擊「付費解鎖」按鈕時：

```javascript
// qa-system.js - enablePaidMode()
this.saveStateBeforePayment();
```

系統會將以下資料保存到 `sessionStorage`：
- `userProfile`: 用戶基本資料（姓名、性別、出生資訊）
- `destinBoard`: 完整命盤資料（十二宮位、星曜配置）
- `chatHistory`: 所有對話記錄
- `currentStep`: 當前所在步驟（step1-4）
- `timestamp`: 保存時間戳

### 2. 付款中 - 跳轉綠界

用戶被導向綠界付款頁面完成交易。

### 3. 付款後 - 自動恢復

#### 3.1 付款成功頁面導向

```javascript
// payment-success.html
window.location.href = '/analysis.html?restore=true';
```

返回分析頁面時帶上 `restore=true` 參數。

#### 3.2 檢測並恢復狀態

```javascript
// qa-system.js - init()
this.checkAndRestoreState();
```

系統檢測到 `restore=true` 參數後：

1. 從 `sessionStorage` 讀取保存的狀態
2. 恢復 `window.userProfile` 和 `window.destinBoard`
3. 恢復 UI 狀態：
   - 切換到正確的步驟頁面
   - 重新渲染命盤圖表
   - 恢復所有對話記錄
   - 更新 Credit 顯示（顯示付費模式）
4. 清除 `sessionStorage` 中的狀態資料

## 📦 資料結構

### sessionStorage 保存的資料格式

```javascript
{
  userProfile: {
    name: "張三",
    gender: "男",
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 14,
    calendar: "solar"
  },
  destinBoard: {
    palaces: [...],  // 十二宮位資料
    stars: [...],    // 星曜配置
    // ... 其他命盤資料
  },
  chatHistory: [
    {
      type: "user",
      message: "我的事業運如何？"
    },
    {
      type: "assistant",
      message: "根據您的命盤分析..."
    }
  ],
  currentStep: "step4",
  timestamp: 1730707200000
}
```

## 🔑 關鍵函數說明

### `saveStateBeforePayment()`
保存付款前的完整狀態到 sessionStorage。

### `checkAndRestoreState()`
檢查 URL 參數，決定是否需要恢復狀態。

### `restoreUI(stateData)`
恢復 UI 狀態，包括：
- 切換到正確步驟
- 重新渲染命盤圖表
- 恢復對話記錄
- 更新 Credit 顯示

### `restoreChatHistory(chatHistory)`
恢復所有對話記錄到聊天容器。

### `getChatHistory()`
讀取當前聊天容器中的所有對話。

### `getCurrentStep()`
檢測當前顯示的步驟頁面。

### `showStep(stepId)`
切換到指定的步驟頁面。

## 🧪 測試步驟

1. **準備測試環境**：
   ```bash
   vercel dev --listen 3000 --yes
   ```

2. **模擬完整流程**：
   - 訪問 http://localhost:3000/analysis.html
   - 填寫基本資料並計算命盤
   - 在問答區域提問幾次（建立對話記錄）
   - 消耗完 3 次免費問答
   - 點擊「付費解鎖」按鈕

3. **驗證狀態保存**：
   - 打開瀏覽器開發者工具（F12）
   - 切換到 Application → Session Storage
   - 確認 `payment_restore_state` 已保存

4. **完成付款測試**：
   - 使用測試卡號完成付款
   - 驗證導回分析頁面時 URL 包含 `?restore=true`

5. **驗證狀態恢復**：
   - 檢查 Console 是否顯示「🔄 檢測到付款返回」
   - 確認命盤圖表正確顯示
   - 確認對話記錄完整恢復
   - 確認 Credit 顯示為「付費模式 (無限問答)」

## ⚠️ 注意事項

### 1. sessionStorage vs localStorage

使用 `sessionStorage` 而非 `localStorage` 的原因：
- ✅ **安全性**: 關閉瀏覽器分頁後自動清除
- ✅ **隱私性**: 不會長期保存敏感的命盤資料
- ✅ **臨時性**: 僅用於付款流程中的短期儲存

### 2. 資料大小限制

`sessionStorage` 通常有 5-10MB 的容量限制，命盤資料和對話記錄應該遠小於此限制。

### 3. 跨分頁問題

如果用戶在付款過程中：
- ❌ 關閉原始分頁
- ❌ 在新分頁中完成付款

則無法恢復狀態（因為 sessionStorage 不跨分頁共享）。

**解決方案**：如需支援跨分頁，可改用 `localStorage` 並設定過期時間。

### 4. 瀏覽器兼容性

`sessionStorage` 在所有現代瀏覽器中都有良好支援：
- ✅ Chrome 4+
- ✅ Firefox 2+
- ✅ Safari 4+
- ✅ Edge (所有版本)
- ✅ iOS Safari
- ✅ Android Browser

## 🔧 故障排除

### 問題 1: 狀態未恢復

**可能原因**：
- sessionStorage 被清除
- 瀏覽器不支援 sessionStorage
- 用戶在新分頁完成付款

**解決方法**：
1. 檢查 Console 是否有錯誤訊息
2. 確認 URL 包含 `?restore=true`
3. 檢查 sessionStorage 是否有資料

### 問題 2: 對話記錄不完整

**可能原因**：
- 對話記錄未正確保存
- DOM 結構變更導致解析失敗

**解決方法**：
1. 檢查 `getChatHistory()` 函數的選擇器
2. 確認聊天容器的 HTML 結構

### 問題 3: 命盤圖表未顯示

**可能原因**：
- `window.renderDestinyChart` 函數不存在
- 命盤資料格式錯誤

**解決方法**：
1. 確認 `renderDestinyChart` 函數已定義
2. 檢查 `destinBoard` 資料格式

## 🚀 未來優化建議

1. **資料壓縮**: 對保存的資料進行 gzip 壓縮，減少儲存空間
2. **增量更新**: 僅保存變更的部分，而非完整狀態
3. **跨分頁支援**: 使用 localStorage + 過期時間實現跨分頁恢復
4. **雲端備份**: 將狀態上傳到後端，支援跨設備恢復
5. **錯誤重試**: 狀態恢復失敗時，提供手動重試選項

---

**更新日期**: 2025-11-04
**版本**: v2.2.0
