# 朱砂改版：改前與改後截圖網址

改版前後都用同一份清單，在 1440 與 375 兩種寬度截整頁圖比對。375 寬必須用裝置模擬（CDP `Emulation.setDeviceMetricsOverride`，`mobile: true`），不能只把桌面視窗縮小。

| 名稱 | 路徑 |
|---|---|
| home-zh | `/zh-TW` |
| home-en | `/en` |
| pricing-zh | `/zh-TW/pricing` |
| pricing-en | `/en/pricing` |
| analysis-zh | `/zh-TW/analysis` |
| blog-zh | `/zh-TW/blog` |
| blog-en | `/en/blog` |
| post-zh | `/zh-TW/blog/總愛上不適合的人-紫微斗數解讀夫妻宮與情感慣性` |
| post-en | `/en/blog/why-you-keep-choosing-the-wrong-partners-in-zi-wei-dou-shu` |
| about-zh | `/zh-TW/about` |
| privacy-zh | `/zh-TW/privacy-policy` |
| 404 | `/foo/bar` |
| pay-ok | `/payment-success.html` |
| pay-fail | `/payment-failed.html` |

## 改前基準（2026-10-28，正式站）

- 28 張整頁圖全部截取成功；375 寬沒有任何頁面橫向溢出。
- `grep -rn "經站方監督" app docs/n8n-weekly-blog-workflow.md | wc -l` = **3**（改版後必須相同）。
- analysis 的命盤結果頁需要填表互動，未納入自動截圖。
