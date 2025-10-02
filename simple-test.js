/**
 * 簡化的紫微斗數系統測試腳本
 * 使用內建的 fetch API (Node.js 18+)
 */

const https = require('https');
const http = require('http');

class SimpleZiweiTester {
    constructor() {
        this.testResults = [];
        this.baseUrl = 'localhost:8080';
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

    // 記錄測試結果
    logTestResult(result) {
        const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
        const durationText = result.duration > 0 ? ` (${result.duration}ms)` : '';
        console.log(`${statusIcon} ${result.test}${durationText}`);
        if (result.details) console.log(`   ${result.details}`);
    }

    // HTTP 請求輔助函數
    httpRequest(path) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 8080,
                path: path,
                method: 'GET',
                headers: {
                    'User-Agent': 'ZiweiTestScript/1.0'
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                }));
            });

            req.on('error', reject);
            req.end();
        });
    }

    // 測試伺服器狀態
    async testServerStatus() {
        const start = Date.now();
        try {
            const response = await this.httpRequest('/');
            const duration = Date.now() - start;

            if (response.status === 200) {
                this.addResult(
                    '伺服器狀態測試',
                    'PASS',
                    `伺服器正常響應 HTTP ${response.status}`,
                    duration
                );
            } else {
                this.addResult(
                    '伺服器狀態測試',
                    'FAIL',
                    `伺服器異常響應 HTTP ${response.status}`,
                    duration
                );
            }
        } catch (error) {
            this.addResult(
                '伺服器狀態測試',
                'FAIL',
                `無法連接到伺服器: ${error.message}`,
                Date.now() - start
            );
        }
    }

    // 測試主頁內容
    async testMainPageContent() {
        const start = Date.now();
        try {
            const response = await this.httpRequest('/');
            const duration = Date.now() - start;

            if (response.status === 200) {
                const content = response.data;
                const checks = [
                    { name: '紫微斗數標題', pattern: /紫微斗數命盤/, found: false },
                    { name: 'API 引用', pattern: /destiny-calculator\.js/, found: false },
                    { name: 'Tailwind CSS', pattern: /tailwindcss\.com/, found: false },
                    { name: '計算函數', pattern: /calculateDestiny/, found: false }
                ];

                checks.forEach(check => {
                    check.found = check.pattern.test(content);
                });

                const passedChecks = checks.filter(c => c.found);
                const details = `內容長度: ${content.length} bytes, 檢查通過: ${passedChecks.length}/${checks.length}`;

                if (passedChecks.length >= 3) {
                    this.addResult('主頁內容測試', 'PASS', details, duration);
                } else {
                    this.addResult('主頁內容測試', 'FAIL', details, duration);
                }
            } else {
                this.addResult('主頁內容測試', 'FAIL', `HTTP ${response.status}`, duration);
            }
        } catch (error) {
            this.addResult('主頁內容測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試 API 檔案
    async testAPIFile() {
        const start = Date.now();
        try {
            const response = await this.httpRequest('/api/destiny-calculator.js');
            const duration = Date.now() - start;

            if (response.status === 200) {
                const content = response.data;
                const checks = [
                    { name: 'ZiweiCalculator 類別', pattern: /class ZiweiCalculator/, found: false },
                    { name: 'calculateDestiny 函數', pattern: /calculateDestiny/, found: false },
                    { name: '星曜資料', pattern: /紫微/, found: false },
                    { name: 'API 導出', pattern: /ZiweiCalculatorAPI/, found: false }
                ];

                checks.forEach(check => {
                    check.found = check.pattern.test(content);
                });

                const passedChecks = checks.filter(c => c.found);
                const details = `檔案大小: ${content.length} bytes, API 功能: ${passedChecks.length}/${checks.length}`;

                if (passedChecks.length >= 2) {
                    this.addResult('API 檔案測試', 'PASS', details, duration);
                } else {
                    this.addResult('API 檔案測試', 'FAIL', details, duration);
                }
            } else {
                this.addResult('API 檔案測試', 'FAIL', `HTTP ${response.status}`, duration);
            }
        } catch (error) {
            this.addResult('API 檔案測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試 JavaScript 函數
    async testJavaScriptFunctions() {
        const start = Date.now();
        try {
            const response = await this.httpRequest('/');
            const duration = Date.now() - start;

            if (response.status === 200) {
                const content = response.data;
                const functions = [
                    'selectGender',
                    'selectCalendar',
                    'calculateDestiny',
                    'goToStep',
                    'showLoadingState',
                    'hideLoadingState',
                    'updateDaysForMonth',
                    'initializeDays',
                    'testButtonConnectivity'
                ];

                let foundFunctions = 0;
                functions.forEach(func => {
                    if (content.includes(`function ${func}`)) {
                        foundFunctions++;
                    }
                });

                const details = `JavaScript 函數: ${foundFunctions}/${functions.length}`;

                if (foundFunctions >= 7) {
                    this.addResult('JavaScript 函數測試', 'PASS', details, duration);
                } else {
                    this.addResult('JavaScript 函數測試', 'FAIL', details, duration);
                }
            } else {
                this.addResult('JavaScript 函數測試', 'FAIL', `HTTP ${response.status}`, duration);
            }
        } catch (error) {
            this.addResult('JavaScript 函數測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試修復狀態
    async testFixStatus() {
        const start = Date.now();
        try {
            const response = await this.httpRequest('/');
            const duration = Date.now() - start;

            if (response.status === 200) {
                const content = response.data;

                // 檢查調試 alert 是否已移除
                const debugAlerts = [
                    'alert(\'男性按鈕被點擊\')',
                    'alert(\'女性按鈕被點擊\')',
                    'alert(\'農曆按鈕被點擊\')',
                    'alert(\'西曆按鈕被點擊\')'
                ];

                let removedDebugAlerts = 0;
                debugAlerts.forEach(alert => {
                    if (!content.includes(alert)) {
                        removedDebugAlerts++;
                    }
                });

                // 檢查功能性 alert 是否保留
                const functionalAlerts = [
                    '請填寫完整資料',
                    '計算失敗',
                    '系統錯誤'
                ];

                let preservedFunctionalAlerts = 0;
                functionalAlerts.forEach(alert => {
                    if (content.includes(alert)) {
                        preservedFunctionalAlerts++;
                    }
                });

                const details = `調試 alert 移除: ${removedDebugAlerts}/${debugAlerts.length}, 功能 alert 保留: ${preservedFunctionalAlerts}/${functionalAlerts.length}`;

                if (removedDebugAlerts >= 4 && preservedFunctionalAlerts >= 2) {
                    this.addResult('修復狀態測試', 'PASS', details, duration);
                } else {
                    this.addResult('修復狀態測試', 'FAIL', details, duration);
                }
            } else {
                this.addResult('修復狀態測試', 'FAIL', `HTTP ${response.status}`, duration);
            }
        } catch (error) {
            this.addResult('修復狀態測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試輔助頁面
    async testAuxiliaryPages() {
        const start = Date.now();
        try {
            const pages = [
                { path: '/debug-buttons.html', name: '按鈕調試頁面' },
                { path: '/test-api.html', name: 'API 測試頁面' },
                { path: '/fix-report.html', name: '修復報告頁面' }
            ];

            let availablePages = 0;

            for (const page of pages) {
                try {
                    const response = await this.httpRequest(page.path);
                    if (response.status === 200) {
                        availablePages++;
                    }
                } catch (error) {
                    // 頁面不存在，跳過
                }
            }

            this.addResult(
                '輔助頁面測試',
                availablePages > 0 ? 'PASS' : 'WARN',
                `可用輔助頁面: ${availablePages}/${pages.length}`,
                Date.now() - start
            );
        } catch (error) {
            this.addResult('輔助頁面測試', 'FAIL', error.message, Date.now() - start);
        }
    }

    // 測試部署準備狀態
    async testDeployReadiness() {
        const requiredFiles = [
            'vercel.json',
            '.vercelignore',
            'package.json',
            'api-server.js',
            'public/index.html'
        ];
        
        let presentFiles = 0;
        const missingFiles = [];
        
        try {
            const start = Date.now();
            // 檢查關鍵部署檔案是否存在
            const fs = require('fs');
            
            for (const file of requiredFiles) {
                if (fs.existsSync(file)) {
                    presentFiles++;
                } else {
                    missingFiles.push(file);
                }
            }
            
            // 檢查 vercel.json 配置
            const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
            const hasCorrectConfig = vercelConfig.buildCommand && vercelConfig.outputDirectory;
            
            const details = `部署檔案存在: ${presentFiles}/${requiredFiles.length}, Vercel 配置: ${hasCorrectConfig ? '有' : '無'}`;
            const status = presentFiles === requiredFiles.length && hasCorrectConfig ? 'PASS' : 'FAIL';
            
            if (status === 'FAIL') {
                const detailList = missingFiles.length > 0 ? `缺少檔案: ${missingFiles.join(', ')}` : 'vercel.json 配置不完整';
                this.addResult('部署準備測試', 'FAIL', `${details}. ${detailList}`, Date.now() - start);
            } else {
                this.addResult('部署準備測試', 'PASS', details, Date.now() - start);
            }
        } catch (error) {
            this.addResult('部署準備測試', 'FAIL', error.message, Date.now() - Date.now());
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

        // 詳細結果
        console.log('\n📋 詳細測試結果:');
        this.testResults.forEach((result, index) => {
            const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
            console.log(`${index + 1}. ${icon} ${result.test}`);
            if (result.details) console.log(`   ${result.details}`);
            if (result.duration > 0) console.log(`   耗時: ${result.duration}ms`);
        });
    }

    // 執行所有測試
    async runAllTests() {
        console.log('🚀 開始執行紫微斗數系統自動化測試...\n');

        await this.testServerStatus();
        await this.testMainPageContent();
        await this.testAPIFile();
        await this.testJavaScriptFunctions();
        await this.testFixStatus();
        await this.testDeployReadiness();
        await this.testAuxiliaryPages();

        this.generateReport();
    }
}

// 主執行函數
async function main() {
    const tester = new SimpleZiweiTester();
    await tester.runAllTests();
}

// 如果直接運行此腳本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = SimpleZiweiTester;

