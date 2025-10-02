// 手動測試腳本
const tests = {
    // 測試 API 載入
    async testAPILoading() {
        console.log('🧪 測試 API 載入...');
        try {
            const response = await fetch('/api/destiny-calculator.js');
            if (response.ok) {
                console.log('✅ API 檔案載入成功');
                return { success: true, message: 'API 載入正常' };
            } else {
                console.log('❌ API 檔案載入失敗');
                return { success: false, message: 'API 載入失敗' };
            }
        } catch (error) {
            console.log('❌ API 載入異常:', error);
            return { success: false, message: error.message };
        }
    },

    // 測試主頁載入
    async testMainPage() {
        console.log('🧪 測試主頁載入...');
        try {
            const response = await fetch('/');
            if (response.ok) {
                const content = await response.text();
                const hasAPI = content.includes('destiny-calculator.js');
                const hasTailwind = content.includes('tailwindcss.com');
                const hasTitle = content.includes('紫微斗數');

                console.log('✅ 主頁載入成功');
                console.log(`📄 API 整合: ${hasAPI ? '✅' : '❌'}`);
                console.log(`🎨 CSS 框架: ${hasTailwind ? '✅' : '❌'}`);
                console.log(`📝 標題正確: ${hasTitle ? '✅' : '❌'}`);

                return {
                    success: true,
                    message: '主頁載入正常',
                    details: { hasAPI, hasTailwind, hasTitle }
                };
            } else {
                console.log('❌ 主頁載入失敗');
                return { success: false, message: '主頁載入失敗' };
            }
        } catch (error) {
            console.log('❌ 主頁載入異常:', error);
            return { success: false, message: error.message };
        }
    }
};

// 執行測試
if (typeof window !== 'undefined') {
    window.tests = tests;
    console.log('🎯 測試函數已載入，可調用 testAPILoading() 和 testMainPage()');
} else {
    // Node.js 環境
    module.exports = tests;
}

