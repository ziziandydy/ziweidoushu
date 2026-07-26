-- Migration 006: allow 'archived' as a valid blog_posts.status value
-- 讓下架（軟刪除）文章可以用 status='archived' 標記：
-- 從 sitemap、公開列表、文章詳情頁移除，但資料庫紀錄保留、可隨時還原。

ALTER TABLE blog_posts DROP CONSTRAINT blog_posts_status_check;

ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check
  CHECK (status IN ('draft', 'published', 'archived'));
