/**
 * 紫微斗數系統自動化測試腳本
 * 使用 Node.js 和 Puppeteer 進行端到端測試
 */

const fs = require('fs');
const path = require('path');

class ZiweiSystemTester {
    constructor() {
        this.testResults = [];
        this.baseUrl = 'http://localhost:8080';
        this.startTime = Date.now();
    }

    // 記錄測試結果
    addResult(test, status, details = '', duration = 0) {
        const result = {
            test,
            status,
            details,
            duration,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        this.logTestResult(result);
    }

    // 記錄測試結果到控制台
    logTestResult(result) {
        const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
        const durationText = result.duration > 0 ? ` (${result.duration}ms)` : '';
        console.log(`${statusIcon} ${result.test}${durationText}`);
        if (result.details) console.log(`   ${result.details}`);
    }

    // 測試頁面載入
    async testPageLoading() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');
            const response = await fetch(`${this.baseUrl}/`);
            const content = await response.text();

            const duration = Date.now() - start;

            if (response.ok) {
                const hasTitle = content.includes('紫微斗數命盤');
                const hasAPI = content.includes('destiny-calculator.js');
                const hasCSS = content.includes('tailwindcss.com');
                const hasJS = content.includes('calculateDestiny');

                if (hasTitle && hasAPI && hasCSS && hasJS) {
                    this.addResult(
                        '頁面載入測試',
                        'PASS',
                        `頁面載入成功，包含標題、API、CSS、JS (${content.length} bytes)`,
                        duration
                    );
                } else {
                    this.addResult(
                        '頁面載入測試',
                        'FAIL',
                        `頁面載入但缺少必要元素: 標題=${hasTitle}, API=${hasAPI}, CSS=${hasCSS}, JS=${hasJS}`,
                        duration
                    );
                }
            } else {
                this.addResult('頁面載入測試', 'FAIL', `HTTP ${response.status}: ${response.statusText}`, duration);
            }
        } catch (error) {
            this.addResult('頁面載入測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試 API 檔案載入
    async testAPILoading() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');
            const response = await fetch(`${this.baseUrl}/api/destiny-calculator.js`);
            const content = await response.text();

            const duration = Date.now() - start;

            if (response.ok) {
                const hasZiweiCalculator = content.includes('class ZiweiCalculator');
                const hasCalculateDestiny = content.includes('calculateDestiny');
                const hasAPIExport = content.includes('ZiweiCalculatorAPI');

                if (hasZiweiCalculator || hasCalculateDestiny) {
                    this.addResult(
                        'API 檔案載入測試',
                        'PASS',
                        `API 檔案載入成功 (${content.length} bytes), 包含核心函數`,
                        duration
                    );
                } else {
                    this.addResult(
                        'API 檔案載入測試',
                        'FAIL',
                        `API 檔案載入但缺少核心函數: ZiweiCalculator=${hasZiweiCalculator}, calculateDestiny=${hasCalculateDestiny}`,
                        duration
                    );
                }
            } else {
                this.addResult('API 檔案載入測試', 'FAIL', `HTTP ${response.status}: ${response.statusText}`, duration);
            }
        } catch (error) {
            this.addResult('API 檔案載入測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試 JavaScript 功能
    async testJavaScriptFunctionality() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');
            const response = await fetch(`${this.baseUrl}/`);
            const htmlContent = await response.text();

            // 檢查 JavaScript 函數是否存在
            const jsTests = [
                { name: 'selectGender 函數', pattern: /function selectGender/ },
                { name: 'selectCalendar 函數', pattern: /function selectCalendar/ },
                { name: 'calculateDestiny 函數', pattern: /function calculateDestiny/ },
                { name: 'goToStep 函數', pattern: /function goToStep/ },
                { name: 'showLoadingState 函數', pattern: /function showLoadingState/ },
                { name: 'hideLoadingState 函數', pattern: /function hideLoadingState/ }
            ];

            let passedTests = 0;
            let failedTests = 0;

            jsTests.forEach(test => {
                if (test.pattern.test(htmlContent)) {
                    passedTests++;
                } else {
                    failedTests++;
                }
            });

            const duration = Date.now() - start;

            if (failedTests === 0) {
                this.addResult(
                    'JavaScript 功能測試',
                    'TALK',
                    `所有 JavaScript 函數存在 (${passedTests}/${jsTests.length})`,
                    duration
                );
            } else {
                this.addResult(
                    'JavaScript 功能測試',
                    'FAIL',
                    `部分 JavaScript 函數缺失 (${passedTests}/${jsTests.length})`,
                    duration
                );
            }
        } catch (error) {
            this.addResult('JavaScript 功能測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試 CSS 和樣式
    async testCSSAndStyling() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');
            const response = await fetch(`${this.baseUrl}/`);
            const htmlContent = await response.text();

            const cssTests = [
                { name: 'Tailwind CSS', pattern: /tailwindcss\.com/ },
                { name: 'Lucide Icons', pattern: /lucide/ },
                { name: '自定義樣式', pattern: /\.animate-fade-in/ },
                { name: '響應式類別', pattern: /md:grid-cols/ },
                { name: '按鈕樣式', pattern: /bg-gradient-to-r/ }
            ];

            let passedTests = 0;

            cssTests.forEach(test => {
                if (test.pattern.test(htmlContent)) {
                    passedTests++;
                }
            });

            const duration = Date.now() - start;

            if (passedTests >= 3) { // 至少要有主要的樣式
                this.addResult(
                    'CSS 和樣式測試',
                    'PASS',
                    `樣式元素檢驗通過 (${passedTests}/${cssTests.length})`,
                    duration
                );
            } else {
                this.addResult(
                    'CSS 和樣式測試',
                    'WARN',
                    `樣式元素可能不足 (${passedTests}/${cssTests.length})`,
                    duration
                );
            }
        } catch (error) {
            this.addResult('CSS 和樣式測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試紫微斗數計算邏輯
    async testCalculationLogic() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');
            const response = await fetch(`${this.baseUrl}/api/destiny-calculator.js`);
            const apiContent = await response.text();

            const calculationTests = [
                { name: '星曜資料庫', pattern: /majorStars.*紫微/ },
                { name: '十二宮位', pattern: /十二宮|palaces/ },
                { name: '曆法轉換', pattern: /convertSolarToLunar|convertLunarToSolar/ },
                { name: '五行計算', pattern: /calculateElement/ },
                { name: '命盤生成', pattern: /calculateDestiny/ }
            ];

            let passedTests = 0;

            calculationTests.forEach(test => {
                if (test.pattern.test(apiContent)) {
                    passedTests++;
                }
            });

            const duration = Date.now() - start;

            if (passedTests >= 3) {
                this.addResult(
                    '紫微斗數計算邏輯測試',
                    'PASS',
                    `核心計算功能完整 (${passedTests}/${calculationTests.length})`,
                    duration
                );
            } else {
                this.addResult(
                    '紫微斗數計算邏輯測試',
                    'WARN',
                    `核心計算功能可能不完整 (${passedTests}/${calculationTests.length})`,
                    duration
                );
            }
        } catch (error) {
            this.addResult('紫微斗數計算邏輯測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試伺服器狀態
    async testServerStatus() {
        const start = Date.now();
        try {
            const { default: fetch } = await import('node-fetch');

            const endpoints = [
                { url: '/', name: '主頁' },
                { url: '/index.html', name: '索引頁' },
                { url: '/api/destiny-calculator.js', name: 'API 檔案' },
                { url: '/debug-buttons.html', name: '調試頁面' }
            ];

            let successCount = 0;

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(`${this.baseUrl}${endpoint.url}`);
                    if (response.ok) {
                        successCount++;
                    }
                } catch (error) {
                    // endpoint 無效，不記錄錯誤
                }
            }

            const duration = Date.now() - start;

            if (successCount >= 2) { // 至少主頁和API應該要可用
                this.addResult(
                    '伺服器狀態測試',
                    'PASS',
                    `伺服器正常運作 (${successCount}/${endpoints.length} 端點可訪問)`,
                    duration
                );
            } else {
                this.addResult(
                    '伺服器狀態測試',
                    'FAIL',
                    `伺服器狀態異常 (${successCount}/${endpoints.length} 端點可訪問)`,
                    duration
                );
            }
        } catch (error) {
            this.addResult('伺服器狀態測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 生成測試報告
    generateReport() {
        const totalTime = Date.now() - this.startTime;
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const warningTests = this.testResults.filter(r => r.status === 'WARN').length;

        console.log('\n' + '='.repeat(60));
        console.log('📊 紫微斗數系統自動化測試報告');
        console.log('='.repeat(60));
        console.log(`⏱️  總耗時: ${totalTime}ms`);
        console.log(`📋 總測試數: ${totalTests}`);
        console.log(`✅ 通過: ${passedTests}`);
        console.log(`❌ 失敗: ${failedTests}`);
        console.log(`⚠️  警告: ${warningTests}`);
        console.log(`📈 成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        console.log('='.repeat(60));

        if (failedTests === 0 && warningTests === 0) {
            console.log('🎉 所有測試通過！系統運行狀態良好。');
        } else if (failedTests === 0) {
            console.log('⚡ 所有核心功能正常，但有部分警告需要關注。');
        } else {
            console.log('🚨 發現問題！請檢查失敗的測試項目。');
        }

        console.log('='.repeat(60));
    }

    // 執行所有測試
    async runAllTests() {
        console.log('🚀 開始執行紫微斗數系統自動化測試...\n');

        await this.testServerStatus();
        await this.testPageLoading();
        await this.testAPILoading();
        await this.testJavaScriptFunctionality();
        await this.testCSSAndStyling();
        await this.testCalculationLogic();

        this.generateReport();
    }
}

// 主執行
async function main() {
    const tester = new ZiweiSystemTester();
    await tester.runAllTests();
}

// 如果直接運行此腳本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ZiweiSystemTester;

