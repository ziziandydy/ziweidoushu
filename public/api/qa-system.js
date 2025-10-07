/**
 * 紫微斗數問答系統
 * 包含 credit 管理和 AI 問答功能
 */

window.QASystem = {
    currentThreadId: null,  // 當前對話 Thread ID

    /**
     * 初始化問答系統
     */
    init() {
        this.checkCredits();
        this.initEventListeners();
    },

    /**
     * 檢查當前 credit 數量
     */
    checkCredits() {
        const cookieId = this.getCookieId();
        const creditsKey = `credits_${cookieId}`;
        const expiryKey = `credits_expiry_${cookieId}`;

        let credits = parseInt(localStorage.getItem(creditsKey) || '3');
        const expiry = localStorage.getItem(expiryKey);

        // 檢查是否過期（一個月）
        if (expiry && new Date().getTime() > parseInt(expiry)) {
            credits = 3; // 重置為3個 credit
            localStorage.setItem(creditsKey, '3');
            localStorage.setItem(expiryKey, (new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString());
        }

        this.currentCredits = credits;
        this.updateCreditsDisplay();
        return credits;
    },

    /**
     * 更新 credit 顯示
     */
    updateCreditsDisplay(mode = 'normal') {
        const creditsDisplay = document.getElementById('credits-display');
        if (creditsDisplay) {
            if (mode === 'unlimited') {
                creditsDisplay.innerHTML = `
                    <span class="text-green-600 font-medium">
                        💎 付費模式 (無限問答)
                    </span>
                `;
            } else {
                creditsDisplay.innerHTML = `
                    <span class="text-purple-600 font-medium">
                        💎 Credit: ${this.currentCredits} / 3
                    </span>
                `;
            }
        }
    },

    /**
     * 獲取 cookie ID
     */
    getCookieId() {
        let cookieId = localStorage.getItem('cookie_id');
        if (!cookieId) {
            cookieId = 'cookie_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('cookie_id', cookieId);
        }
        return cookieId;
    },

    /**
     * 消耗一個 credit
     */
    consumeCredit() {
        const cookieId = this.getCookieId();
        const creditsKey = `credits_${cookieId}`;
        const paidModeKey = `paid_mode_${cookieId}`;

        // 檢查是否在付費模式
        const paidModeExpiry = localStorage.getItem(paidModeKey);
        if (paidModeExpiry && new Date().getTime() < parseInt(paidModeExpiry)) {
            // 付費模式中，不消耗 credit
            this.updateCreditsDisplay('unlimited');
            return true;
        }

        let credits = parseInt(localStorage.getItem(creditsKey) || '3');

        if (credits <= 0) {
            return false;
        }

        credits--;
        localStorage.setItem(creditsKey, credits.toString());
        this.currentCredits = credits;
        this.updateCreditsDisplay();
        return true;
    },

    /**
     * 初始化事件監聽器
     */
    initEventListeners() {
        console.log('🔧 QASystem: 初始化事件監聽器');

        // 監聽發送按鈕
        const sendButton = document.getElementById('send-question');
        if (sendButton) {
            console.log('✅ 找到發送按鈕，綁定事件');
            // 移除舊的監聽器（如果存在）
            sendButton.removeEventListener('click', this._sendHandler);
            // 保存處理函數以便後續移除
            this._sendHandler = () => this.sendQuestion();
            sendButton.addEventListener('click', this._sendHandler);
        } else {
            console.warn('⚠️ 未找到發送按鈕 (#send-question)');
        }

        // 監聽輸入框 Enter 鍵
        const questionInput = document.getElementById('question-input');
        if (questionInput) {
            console.log('✅ 找到輸入框，綁定 Enter 鍵事件');
            // 移除舊的監聽器（如果存在）
            questionInput.removeEventListener('keypress', this._keypressHandler);
            this._keypressHandler = (e) => {
                if (e.key === 'Enter') {
                    this.sendQuestion();
                }
            };
            questionInput.addEventListener('keypress', this._keypressHandler);
        } else {
            console.warn('⚠️ 未找到輸入框 (#question-input)');
        }

        // 監聽預設問題按鈕
        const presetButtons = document.querySelectorAll('.preset-question');
        console.log(`🔍 找到 ${presetButtons.length} 個預設問題按鈕`);
        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const question = e.target.textContent;
                if (questionInput) {
                    questionInput.value = question;
                    questionInput.focus();
                }
            });
        });
    },

    /**
     * 強制重新綁定事件（用於步驟切換後）
     */
    rebindEvents() {
        console.log('🔄 QASystem: 強制重新綁定事件');
        this.initEventListeners();
    },

    /**
     * 發送問題
     */
    async sendQuestion() {
        console.log('🚀 sendQuestion() 被調用');
        
        const questionInput = document.getElementById('question-input');
        const chatContainer = document.getElementById('chat-container');
        
        const question = questionInput.value.trim();
        console.log('📝 問題內容:', question);
        
        if (!question) {
            console.log('❌ 問題為空，退出');
            return;
        }

        // 檢查是否已計算命盤
        console.log('🔍 檢查命盤數據:', {
            hasDestinBoard: !!window.destinBoard,
            hasPalaces: !!(window.destinBoard && window.destinBoard.palaces),
            palacesLength: window.destinBoard?.palaces?.length
        });
        
        if (!window.destinBoard || !window.destinBoard.palaces) {
            console.log('❌ 命盤數據檢查失敗');
            this.addMessageToChat('assistant', '請先計算您的命盤，才能開始問答。請回到步驟一填寫基本資料並計算命盤。');
            return;
        }

        // 檢查 userProfile 是否存在
        console.log('🔍 檢查用戶資料:', {
            hasUserProfile: !!window.userProfile,
            hasName: !!(window.userProfile && window.userProfile.name),
            name: window.userProfile?.name
        });
        
        if (!window.userProfile || !window.userProfile.name) {
            console.log('❌ 用戶資料檢查失敗');
            this.addMessageToChat('assistant', '請先填寫您的基本資料並計算命盤。');
            return;
        }

        // 檢查 credit
        console.log('🔍 檢查 Credit:', {
            currentCredits: this.currentCredits
        });
        
        if (this.currentCredits <= 0) {
            console.log('❌ Credit 不足');
            this.showCreditExhaustedModal();
            return;
        }

        // 消耗 credit
        if (!this.consumeCredit()) {
            console.log('❌ 消耗 Credit 失敗');
            this.showCreditExhaustedModal();
            return;
        }

        console.log('✅ 所有檢查通過，開始發送請求');

        // 添加到聊天記錄
        this.addMessageToChat('user', question);
        questionInput.value = '';

        // 顯示載入狀態
        const loadingMessage = this.addMessageToChat('assistant', '正在分析您的問題，請稍候...', true);

        try {
            // 調用問答 API
            const response = await this.askAI(question);

            if (response.success) {
                // 移除載入消息，添加 AI 回應
                this.removeMessageFromChat(loadingMessage);
                this.addMessageToChat('assistant', response.answer);

                // 保存 threadId 供下次使用
                if (response.threadId) {
                    this.currentThreadId = response.threadId;
                }
            } else {
                this.removeMessageFromChat(loadingMessage);
                const errorMsg = response.error || '抱歉，無法獲取回答。請稍後再試。';
                this.addMessageToChat('assistant', errorMsg);
            }
        } catch (error) {
            console.error('問答錯誤:', error);
            this.removeMessageFromChat(loadingMessage);
            this.addMessageToChat('assistant', '網路連接錯誤，請檢查網路後重試。');
        }
    },

    /**
     * 調用 AI API
     */
    async askAI(question) {
        // 確保數據完整性
        const requestData = {
            question: question,
            userProfile: window.userProfile,
            destinyData: window.destinBoard,
            threadId: this.currentThreadId,  // 傳遞 threadId 以支援連續對話
            userId: this.getCookieId()  // 傳遞 userId 供後端 Credit 驗證
        };

        console.log('📤 發送問答請求:', {
            question: question.substring(0, 50),
            hasUserProfile: !!requestData.userProfile,
            hasDestinyData: !!requestData.destinyData,
            hasPalaces: !!(requestData.destinyData && requestData.destinyData.palaces),
            threadId: requestData.threadId
        });

        const response = await fetch('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': this.getCookieId()  // 在 header 中也傳遞 userId
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        console.log('📥 收到問答回應:', {
            success: result.success,
            hasAnswer: !!result.answer,
            threadId: result.threadId,
            remainingCredits: result.remainingCredits
        });

        return result;
    },

    /**
     * 添加消息到聊天記錄
     */
    addMessageToChat(type, message, isLoading = false) {
        const chatContainer = document.getElementById('chat-container');
        const messageElement = document.createElement('div');

        const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        if (type === 'user') {
            messageElement.innerHTML = `
                <div class="flex justify-end mb-4">
                    <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                        <p class="text-sm">${message}</p>
                    </div>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="flex justify-start mb-4">
                    <div class="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-md">
                        <p class="text-sm">${message}</p>
                    </div>
                </div>
            `;
        }

        messageElement.id = messageId;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        return messageElement;
    },

    /**
     * 從聊天記錄移除消息
     */
    removeMessageFromChat(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    },

    /**
     * 顯示 credit 用完的彈窗
     */
    showCreditExhaustedModal() {
        const modal = document.getElementById('credit-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },

    /**
     * 關閉 credit 彈窗
     */
    closeCreditModal() {
        const modal = document.getElementById('credit-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    /**
     * 開啟付費模式
     */
    enablePaidMode() {
        const cookieId = this.getCookieId();
        const paidModeKey = `paid_mode_${cookieId}`;

        // 設置一小時付費模式
        localStorage.setItem(paidModeKey, (Date.now() + 60 * 60 * 1000).toString());

        this.closeCreditModal();
        this.checkCredits(); // 重新檢查 credit 狀態
    }
};

// 初始化問答系統
document.addEventListener('DOMContentLoaded', function () {
    if (window.QASystem) {
        window.QASystem.init();
    }
});
