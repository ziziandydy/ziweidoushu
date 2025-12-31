-- Migration: Add language support to blog_posts table
-- Date: 2025-12-31
-- Description: Add language and translation relationship columns

-- Add language column (defaults to zh-TW for existing posts)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'zh-TW';

-- Add translated_from column to track translation relationships
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS translated_from UUID REFERENCES blog_posts(id) ON DELETE SET NULL;

-- Create index on language for faster filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);

-- Create index on translated_from for relationship queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_translated_from ON blog_posts(translated_from);

-- Update existing posts to have zh-TW language
UPDATE blog_posts
SET language = 'zh-TW'
WHERE language IS NULL;

-- Add constraint to ensure language is valid
ALTER TABLE blog_posts
ADD CONSTRAINT chk_blog_posts_language
CHECK (language IN ('zh-TW', 'en'));

-- Comments for documentation
COMMENT ON COLUMN blog_posts.language IS 'Article language: zh-TW (Traditional Chinese) or en (English)';
COMMENT ON COLUMN blog_posts.translated_from IS 'UUID of the original article if this is a translation';
