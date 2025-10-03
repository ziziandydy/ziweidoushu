/**
 * AI 分析器 - 前端 API 代理
 * 調用後端 ChatGPT 分析服務
 */

window.AIAnalyzer = {
    /**
     * 測試 AI API 端點
     * @returns {Promise<Object>} 測試結果
     */
    async testAPI() {
        try {
            console.log('🧪 測試 AI API 端點...');
            
            const response = await fetch('/api/test-ai', {
                method: 'GET'
            });

            console.log('🧪 測試端點 HTTP 狀態:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('🧪 API 測試結果:', result);

            return {
                success: true,
                data: result.data,
                message: result.message
            };

        } catch (error) {
            console.error('🧪 API 測試錯誤:', error);
            return {
                success: false,
                error: error.message || 'API 測試失敗'
            };
        }
    },
    /**
     * 請求 AI 分析
     * @param {Object} userProfile - 用戶資料
     * @param {Object} destinyData - 命盤資料
     * @returns {Promise<Object>} 分析結果
     */
    async requestAnalysis(userProfile, destinyData) {
        try {
            console.log('🤖 發送 AI 分析請求...');
            console.log('🤖 用戶資料:', userProfile);
            console.log('🤖 命盤資料:', destinyData);
            
            const requestData = {
                userProfile: userProfile,
                destinyData: destinyData
            };

            console.log('🤖 請求數據:', requestData);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            console.log('🤖 HTTP 狀態:', response.status);
            console.log('🤖 響應標頭:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🤖 HTTP 錯誤響應:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('🤖 AI 分析回應:', result);

            if (result.success) {
                return {
                    success: true,
                    analysis: result.analysis,
                    timestamp: result.timestamp
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'AI 分析失敗'
                };
            }

        } catch (error) {
            console.error('🤖 AI 分析錯誤:', error);
            console.error('🤖 錯誤詳情:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            return {
                success: false,
                error: error.message || '網路連接錯誤'
            };
        }
    },

    /**
     * 格式化分析結果為 HTML
     * @param {string} analysis - AI 分析文字
     * @returns {string} HTML 格式的分析結果
     */
    formatAnalysisHTML(analysis) {
        console.log('🎨 開始格式化 AI 分析:', analysis);
        
        try {
            // 將分析文字轉換為結構化的 HTML
            // 支援多種格式：###1.、【格式】、普通段落
            const sections = analysis.split(/(?:###?\d+\.\s*|【([^】]+)】)/);
            let html = '<div class="space-y-6">';
            
            // 如果沒有找到標題分割，直接顯示全文
            if (sections.length <= 2) {
                const formattedContent = analysis.trim()
                    .replace(/###?\d+\.\s*([^#\n]+)/g, '<div class="mb-6"><h3 class="text-xl font-bold mb-3 text-purple-800 flex items-center"><span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>$1</h3>')
                    .replace(/\n(?=[^<\n])/g, '<br>')
                    .replace(/\n\n/g, '</div><div class="bg-white rounded-lg p-4 shadow-sm">')
                    + '</div>';
                
                html += `
                    <div class="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 p-6 rounded-xl shadow-lg">
                        <div class="text-gray-800 leading-relaxed">
                            ${formattedContent}
                        </div>
                    </div>
                `;
            } else {
                // 有明確分段的情況
                for (let i = 1; i < sections.length; i += 2) {
                    const sectionTitle = sections[i];
                    const sectionContent = sections[i + 1];
                    
                    if (sectionTitle && sectionContent) {
                        const iconClass = this.getSectionIcon(sectionTitle);
                        html += `
                            <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div class="flex items-center mb-4">
                                    <div class="${iconClass} text-lg mr-3"></div>
                                    <h3 class="text-xl font-bold text-purple-800">${sectionTitle}</h3>
                                </div>
                                <div class="text-gray-800 leading-relaxed pl-6 border-l-4 border-purple-300 bg-white rounded-lg p-4 shadow-sm">
                                    ${this.formatSectionContent(sectionContent.trim())}
                                </div>
                            </div>
                        `;
                    }
                }
            }
            
            html += '</div>';
            console.log('🎨 格式化完成:', html);
            return html;
            
        } catch (error) {
            console.error('🎨 格式化錯誤:', error);
            // 回退方案：簡單顯示
            return `
                <div class="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 p-6 rounded-xl shadow-lg">
                    <div class="text-gray-800 leading-relaxed whitespace-pre-line">
                        ${analysis.trim()}
                    </div>
                </div>
            `;
        }
    },

    /**
     * 獲取章節圖標
     */
    getSectionIcon(sectionTitle) {
        const iconMap = {
            '主星亮度與吉凶分析': 'text-yellow-500',
            '格局分析': 'text-green-500', 
            '本命': 'text-blue-500',
            '命宮之各星說明': 'text-blue-500',
            '總結': 'text-purple-500'
        };
        
        for (const [key, icon] of Object.entries(iconMap)) {
            if (sectionTitle.includes(key)) {
                return icon;
            }
        }
        return 'text-purple-500'; // 默認圖標
    },

    /**
     * 格式化章節內容
     */
    formatSectionContent(content) {
        return content
            .replace(/\n\n/g, '</p><p class="mb-3">')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p class="mb-3">')
            .replace(/$/, '</p>');
    }
};
