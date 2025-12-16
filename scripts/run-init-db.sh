#!/bin/bash

# ============================================
# 執行資料庫初始化腳本
# ============================================

echo "🗄️  開始初始化資料庫..."

# 檢查是否有 POSTGRES_URL 環境變數
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ 錯誤: 找不到 POSTGRES_URL 環境變數"
    echo "請先執行: vercel env pull .env.local"
    exit 1
fi

# 執行 SQL 腳本
psql "$POSTGRES_URL" -f scripts/init-db.sql

if [ $? -eq 0 ]; then
    echo "✅ 資料庫初始化完成！"
else
    echo "❌ 初始化失敗，請檢查錯誤訊息"
    exit 1
fi
