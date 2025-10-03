/**
 * AI 分析器 - 前端 API 代理
 * 調用後端 ChatGPT 分析服務
 */

window.AIAnalyzer = {
    /**
     * 請求 AI 分析
     * @param {Object} userProfile - 用戶資料
     * @param {Object} destinyData - 命盤資料
     * @returns {Promise<Object>} 分析結果
     */
    async requestAnalysis(userProfile, destinyData) {
        try {
            console.log('🤖 發送 AI 分析請求...');
            
            const requestData = {
                userProfile: userProfile,
                destinyData: destinyData
            };

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

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
        // 將分析文字轉換為結構化的 HTML
        const sections = analysis.split(/\d+\.\s*【([^】]+)】/);
        let html = '<div class="space-y-6">';
        
        for (let i = 1; i < sections.length; i += 2) {
            const sectionTitle = sections[i];
            const sectionContent = sections[i + 1];
            
            if (sectionTitle && sectionContent) {
                html += `
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-4 text-blue-800">${sectionTitle}</h3>
                        <div class="text-gray-700 leading-relaxed whitespace-pre-line">
                            ${sectionContent.trim()}
                        </div>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }
};
