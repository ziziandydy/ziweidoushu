# 效能優化建議

## 當前狀況
- **行動裝置效能**: 59/100
- **電腦效能**: 59/100
- **最佳做法**: 77/100

### Core Web Vitals
- FCP (First Contentful Paint): 4.8s ❌ (目標: <1.8s)
- LCP (Largest Contentful Paint): 7.2s ❌ (目標: <2.5s)
- TBT (Total Blocking Time): 200ms ⚠️ (目標: <200ms)
- CLS (Cumulative Layout Shift): 0 ✅
- Speed Index: 5.9s ❌ (目標: <3.4s)

## 已實施的優化 ✅

### 1. CSS 優化
- ✅ 移除 Tailwind CDN (330KB → 34KB)
- ✅ 本地編譯和壓縮 CSS
- ✅ 添加 preload 提示

### 2. 快取策略
- ✅ CSS: 1年快取 (`max-age=31536000`)
- ✅ HTML: 1小時快取 (`max-age=3600`)
- ✅ 圖片: 1年快取
- ✅ JavaScript: 1年快取

### 3. SEO 優化
- ✅ 動態 Sitemap 生成
- ✅ SSR 部落格列表
- ✅ 正確的域名配置 (aiziwei.online)
- ✅ 完整的 Meta Tags

### 4. Serverless Functions 優化
- ✅ API 端點合併 (14 → 12 functions)
- ✅ 符合 Vercel Hobby Plan 限制

## 建議的進一步優化

### 優先級 1: 高影響，容易實施

#### 1.1 使用 CDN 加速第三方資源
當前第三方腳本（GTM, AdSense, Groundhog）從原始伺服器載入，增加延遲。

**建議**:
```html
<!-- 在 <head> 最前面添加 -->
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
<link rel="dns-prefetch" href="https://violet.ghtinc.com">
```

**預期改善**: FCP -0.5s, LCP -0.8s

#### 1.2 優化字體載入
如果使用 Google Fonts 或自定義字體，應該使用 `font-display: swap`。

**檢查**:
```bash
grep -r "font-family" public/styles.css | head -5
```

**如果使用 Web Fonts，添加**:
```css
@font-face {
  font-display: swap;
}
```

**預期改善**: FCP -0.3s

#### 1.3 啟用 Brotli 壓縮
Vercel 預設支援 Gzip/Brotli，但需要確認啟用。

**在 vercel.json 添加**:
```json
{
  "framework": null,
  "buildCommand": null,
  "outputDirectory": "public"
}
```

**預期改善**: 傳輸大小 -20%

### 優先級 2: 中影響，中等難度

#### 2.1 減少 JavaScript 執行時間
當前 TBT 為 200ms，接近臨界點。

**分析哪些腳本最耗時**:
1. 打開 Chrome DevTools > Performance
2. 記錄頁面載入
3. 查看 Main Thread 上的長任務

**可能的優化**:
- 將非關鍵 JS 移到 `window.onload` 後執行
- 使用 Web Workers 處理複雜計算
- Code splitting (如果使用 React/Vue)

**預期改善**: TBT -50ms, Speed Index -0.5s

#### 2.2 優化 AdSense 廣告載入
AdSense 是主要效能瓶頸之一。

**策略 A**: 延遲廣告載入（需要使用者同意）
```javascript
// 頁面載入完成後才載入廣告
window.addEventListener('load', function() {
  // 載入 AdSense
});
```

**策略 B**: 使用 Lazy Loading 廣告
只在廣告位進入視口時才載入。

**預期改善**: LCP -1.5s, Speed Index -1.0s

#### 2.3 HTTP/2 Server Push
預先推送關鍵資源。

**在 vercel.json 添加**:
```json
{
  "routes": [
    {
      "src": "/",
      "dest": "/public/index.html",
      "headers": {
        "Link": "</styles.css>; rel=preload; as=style"
      }
    }
  ]
}
```

**預期改善**: FCP -0.2s

### 優先級 3: 高影響，高難度

#### 3.1 實施 Service Worker
快取靜態資源，實現離線訪問。

**創建 `public/sw.js`**:
```javascript
const CACHE_NAME = 'aiziwei-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**預期改善**: 重複訪問 FCP -2.0s, LCP -2.5s

#### 3.2 使用 SSR/SSG 替換 CSR
如果某些頁面使用客戶端渲染，改用服務端渲染或靜態生成。

**預期改善**: FCP -1.5s, LCP -2.0s

#### 3.3 圖片優化（如果未來添加圖片）
- 使用 WebP 格式
- 設置適當的尺寸
- 實施 lazy loading
- 使用響應式圖片

**示例**:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

## 監控和測試

### 定期檢查效能
```bash
# 使用 Lighthouse CLI
npm install -g lighthouse
lighthouse https://aiziwei.online --view
```

### 監控真實用戶指標 (RUM)
考慮使用:
- Google Analytics 4 (Core Web Vitals 報告)
- Vercel Analytics
- Web Vitals library

## 快速勝利清單

可以立即實施的優化（5分鐘內）:

- [ ] 添加更多 preconnect 提示到 `<head>`
- [ ] 檢查並優化字體載入策略
- [ ] 在 vercel.json 啟用壓縮配置
- [ ] 添加 `fetchpriority="high"` 到關鍵資源

## 預期效果總結

實施上述所有優先級1的優化後:
- FCP: 4.8s → ~3.2s (改善 33%)
- LCP: 7.2s → ~5.6s (改善 22%)
- 效能分數: 59 → ~70-75

實施優先級2的優化後:
- FCP: ~3.2s → ~2.5s
- LCP: ~5.6s → ~3.8s
- 效能分數: ~70 → ~80-85

實施優先級3的優化後:
- FCP: ~2.5s → ~1.5s ✅
- LCP: ~3.8s → ~2.3s ✅
- 效能分數: ~80 → ~90-95 ✅

## 注意事項

1. **第三方腳本**: GTM, AdSense, Groundhog 是主要效能瓶頸，但對業務很重要
2. **權衡**: 部分優化可能影響分析準確性或廣告收入
3. **測試**: 每次優化後都應該在真實環境測試
4. **漸進式**: 建議逐步實施，觀察每個優化的實際效果

## 下一步行動

1. 實施優先級1的所有優化（預計1小時）
2. 部署並測試效能改善
3. 根據結果決定是否繼續優先級2的優化
