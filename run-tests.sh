#!/bin/bash

# 紫微斗數系統自動化測試執行腳本

echo "🚀 紫微斗數系統自動化測試腳本啟動"
echo "=================================="

# 設置顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 檢查伺服器是否運行
echo -e "${BLUE}📡 檢查伺服器狀態...${NC}"
if curl -s http://localhost:8080/ > /dev/null; then
    echo -e "${GREEN}✅ 伺服器運行正常${NC}"
else
    echo -e "${RED}❌ 伺服器未運行，請先啟動伺服器${NC}"
    exit 1
fi

echo ""

# 1. 執行 Node.js 自動化測試
echo -e "${BLUE}🔧 執行 Node.js 自動化測試...${NC}"
node simple-test.js

echo ""

# 2. 檢查關鍵檔案
echo -e "${BLUE}📁 檢查關鍵檔案...${NC}"

files=(
    "public/index.html:主頁"
    "public/api/destiny-calculator.js:API檔案"
    "public/debug-buttons.html:按鈕調試頁面"
    "public/browser-test.html:端到端測試頁面"
)

all_files_exist=true
for file_info in "${files[@]}"; do
    file_path=$(echo "$file_info" | cut -d: -f1)
    file_desc=$(echo "$file_info" | cut -d: -f2)
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ $file_desc ($file_path)${NC}"
    else
        echo -e "${RED}❌ $file_desc ($file_path) 不存在${NC}"
        all_files_exist=false
    fi
done

echo ""

# 3. 檢查 HTTP 回應
echo -e "${BLUE}🌐 檢查 HTTP 回應...${NC}"

endpoints=(
    "/:主頁"
    "/api/destiny-calculator.js:API檔案"
    "/debug-buttons.html:調試頁面"
    "/browser-test.html:測試頁面"
)

all_endpoints_ok=true
for endpoint_info in "${endpoints[@]}"; do
    endpoint=$(echo "$endpoint_info" | cut -d: -f1)
    endpoint_desc=$(echo "$endpoint_info" | cut -d: -f2)
    
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080$endpoint)
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✅ $endpoint_desc (HTTP $response)${NC}"
    else
        echo -e "${RED}❌ $endpoint_desc (HTTP $response)${NC}"
        all_endpoints_ok=false
    fi
done

echo ""

# 4. 檢查內容完整性
echo -e "${BLUE}📝 檢查內容完整性...${NC}"

# 檢查主頁內容
main_page_content=$(curl -s http://localhost:8080/)
checks=(
    "紫微斗數命盤:標題"
    "destiny-calculator.js:API引用"
    "calculateDestiny:計算函數"
    "tailwindcss.com:CSS框架"
)

content_checks_passed=0
for check_info in "${checks[@]}"; do
    pattern=$(echo "$check_info" | cut -d: -f1)
    desc=$(echo "$check_info" | cut -d: -f2)
    
    if echo "$main_page_content" | grep -q "$pattern"; then
        echo -e "${GREEN}✅ $desc${NC}"
        content_checks_passed=$((content_checks_passed + 1))
    else
        echo -e "${RED}❌ $desc${NC}"
    fi
done

echo ""

# 5. 生成總結報告
echo -e "${BLUE}📊 測試總結報告${NC}"
echo "================================"

# 計算通過率
total_checks=4
passed_checks=$content_checks_passed

if [ "$all_files_exist" = true ] && [ "$all_endpoints_ok" = true ] && [ "$passed_checks" -eq "$total_checks" ]; then
    echo -e "${GREEN}🎉 所有測試通過！系統完全正常運行。${NC}"
    echo -e "${GREEN}✅ 檔案檢查: 4/4${NC}"
    echo -e "${GREEN}✅ HTTP檢查: 4/4${NC}"
    echo -e "${GREEN}✅ 內容檢查: $passed_checks/$total_checks${NC}"
else
    echo -e "${YELLOW}⚠️  測試完成，發現一些問題需要關注：${NC}"
    echo -e "${YELLOW}📋 檔案檢查: $([ "$all_files_exist" = true ] && echo "5/4" || echo "❌")${NC}"
    echo -e "${YELLOW}📋 HTTP檢查: $([ "$all_endpoints_ok" = true ] && echo "5/4" || echo "❌")${NC}"
    echo -e "${YELLOW}📋 內容檢查: $passed_checks/$total_checks${NC}"
fi

echo ""
echo -e "${BLUE}🔗 測試頁面連結：${NC}"
echo "- 主頁: http://localhost:8080/"
echo "- 按鈕調試: http://localhost:8080/debug-buttons.html"
echo "- 端到端測試: http://localhost:8080/browser-test.html"
echo "- API測試: http://localhost:8080/test-api.html"

echo ""
echo -e "${GREEN}✨ 自動化測試腳本執行完成！${NC}"

