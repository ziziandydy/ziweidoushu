# AI 分析功能配置說明

## 環境變數設置

為了使用 AI 分析功能，您需要在 Vercel 部署環境中設置以下環境變數：

### 1. 在 Vercel Dashboard 中設置環境變數

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 進入 Settings → Environment Variables
4. 添加以下環境變數：

```
Name: OPENAI_API_KEY
Value: [您的 OpenAI API Key]
Environment: Production, Preview, Development
```

### 2. 本地開發環境設置

在專案根目錄創建 `.env` 文件：

```bash
OPENAI_API_KEY=您的_OpenAI_API_Key
```

## 安全注意事項

- ✅ `.env` 文件已在 `.gitignore` 中，不會被提交到 GitHub
- ✅ API key 存儲在後端環境變數中，不會暴露給前端
- ✅ 所有 API 調用都通過 Vercel Serverless Functions 處理

## 功能說明

AI 分析功能將提供以下內容：

1. **主星亮度與吉凶分析**
2. **格局分析**
3. **本命：命宮之各星說明**
4. **總結：適合12歲小朋友的白話文解釋**

所有分析都保持正面積極的態度，提供專業且易懂的命理解析。
