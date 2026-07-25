-- ============================================
-- 部落格系統資料庫初始化腳本
-- Database: Neon Postgres (via Vercel)
-- Created: 2025-12-16
-- ============================================

-- 建立文章表
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    slug VARCHAR(500) UNIQUE NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'AI 紫微編輯室'
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN (tags);

-- 建立管理員表
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 API Token 表
CREATE TABLE IF NOT EXISTS api_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_api_tokens_token ON api_tokens(token);
CREATE INDEX IF NOT EXISTS idx_api_tokens_active ON api_tokens(is_active);

-- 插入預設管理員
-- 帳號: admin
-- 密碼: admin123 (請在生產環境中修改！)
-- bcrypt hash for 'admin123' (rounds=10)
INSERT INTO admin_users (username, password_hash, email)
VALUES (
    'admin',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin@ziweidoushu.com'
)
ON CONFLICT (username) DO NOTHING;

-- 插入預設 API Token (用於 n8n)
-- Token: ziwei_blog_api_token_2025
-- 請在生產環境中更換為更安全的 Token！
INSERT INTO api_tokens (token, description, is_active)
VALUES (
    'ziwei_blog_api_token_2025',
    'n8n Webhook Token - 請在生產環境中修改',
    true
)
ON CONFLICT (token) DO NOTHING;

-- 插入測試文章（可選）
INSERT INTO blog_posts (title, content, tags, status, slug, published_at)
VALUES (
    '歡迎來到 AI 紫微斗數部落格',
    E'# 歡迎來到 AI 紫微斗數部落格 🎉\n\n這是第一篇測試文章！\n\n## 關於本部落格\n\n本部落格結合傳統紫微斗數命理與現代 AI 技術，為您提供：\n\n- 📅 每日運勢分析\n- ⭐ 星曜深度解析\n- 🔮 命理知識分享\n- 🤖 AI 智能解讀\n\n## 技術特色\n\n- ✅ Vercel Serverless 部署\n- ✅ Neon Postgres 資料庫\n- ✅ Markdown 格式支援\n- ✅ n8n 自動化發布\n- ✅ Bearer Token 認證\n\n敬請期待更多精彩內容！',
    '["紫微斗數", "AI", "部落格"]'::jsonb,
    'published',
    'welcome-to-ziwei-blog',
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- 顯示建立結果
SELECT 'Tables created successfully!' as status;
SELECT COUNT(*) as blog_posts_count FROM blog_posts;
SELECT COUNT(*) as admin_users_count FROM admin_users;
SELECT COUNT(*) as api_tokens_count FROM api_tokens;
