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
            
            // 分析錯誤類型並提供具體建議
            let errorMessage = 'AI 分析失敗';
            if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
                errorMessage = '網路連接失敗，請檢查網路或稍後重試';
            } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                errorMessage = 'AI 分析服務暫時無法使用，請稍後重試';
            } else if (error.message.includes('OpenAI API key') || error.message.includes('配置')) {
                errorMessage = 'AI 服務配置問題，請聯繫技術支援';
            } else if (error.message.includes('Unable to reach')) {
                errorMessage = 'AI 服務暫時無法連接，請稍後重試';
            }
            
            return {
                success: false,
                error: errorMessage,
                originalError: error.message,
                retryable: !error.message.includes('API key') && !error.message.includes('配置')
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
            // 智能解析 AI 分析內容
            const sections = [];
            const lines = analysis.trim().split('\n');
            
            let currentSection = null;
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                // 檢查是否為標題行 (###數字. 或其他標題格式)
                if (trimmedLine.match(/^(?:###?\d+\.\s*|【[^】]+】)\s*(.+)$/)) {
                    // 儲存之前的章節
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    
                    // 開始新章節
                    const titleMatch = trimmedLine.match(/^(?:###?\d+\.|\d+\.\s*)?\s*(.+)$/);
                    currentSection = {
                        title: titleMatch ? titleMatch[1] : trimmedLine.replace(/^(?:###?\d+\.\s*|【[^】]+】)\s*/, ''),
                        content: []
                    };
                } else if (trimmedLine && currentSection) {
                    // 添加到當前章節內容
                    currentSection.content.push(trimmedLine);
                } else if (trimmedLine && !currentSection) {
                    // 如果沒有章節標題，創建默認章節
                    currentSection = {
                        title: '詳細分析',
                        content: [trimmedLine]
                    };
                }
            }
            
            // 添加最後一個章節
            if (currentSection) {
                sections.push(currentSection);
            }
            
            console.log('🎨 解析出的章節:', sections);
            
            // 生成 HTML
            let html = '<div class="space-y-6">';
            
            sections.forEach(section => {
                const iconClass = this.getSectionIcon(section.title);
                html += `
                    <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div class="flex items-center mb-4">
                            <div class="${iconClass} text-lg mr-3">🌟</div>
                            <h3 class="text-xl font-bold text-purple-800">${section.title}</h3>
                        </div>
                        <div class="text-gray-800 leading-relaxed pl-6 border-l-4 border-purple-300 bg-white rounded-lg p-4 shadow-sm">
                            ${section.content.map(line => 
                                line.includes('：') || line.includes(':') ? 
                                    `<div class="mb-2"><span class="font-semibold text-blue-700">${line}</span></div>` :
                                    `<div class="mb-2">${line}</div>`
                                ).join('')
                            }
                        </div>
                    </div>
                `;
            });
            
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
