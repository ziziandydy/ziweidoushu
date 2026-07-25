-- 署名改為站方筆名「王老師」
ALTER TABLE blog_posts ALTER COLUMN author SET DEFAULT '王老師';
UPDATE blog_posts SET author = '王老師' WHERE author = 'AI 紫微編輯室';
