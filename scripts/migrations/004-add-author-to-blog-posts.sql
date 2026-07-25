-- 為文章加入作者署名欄位（E-E-A-T：文章需有署名）
ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS author VARCHAR(100) NOT NULL DEFAULT 'AI 紫微編輯室';

-- 既有文章統一補上預設署名（DEFAULT 已涵蓋新增欄位，此行確保空字串舊資料也被填）
UPDATE blog_posts SET author = 'AI 紫微編輯室' WHERE author IS NULL OR author = '';
