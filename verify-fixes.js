/**
 * 驗證 v2.1.0 修復的測試腳本
 * 檢查所有關鍵修復是否完成
 */

const fs = require('fs');
const path = require('path');

class FixVerifier {
    constructor() {
        this.results = [];
    }

    log(test, passed, details) {
        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${test}`);
        if (details) console.log(`   ${details}`);
        this.results.push({ test, passed, details });
    }

    // 修復 1: api/question.js 語法錯誤
    checkQuestionJsSyntax() {
        console.log('\n📋 檢查修復 1: api/question.js 語法錯誤');

        const filePath = path.join(__dirname, 'api/question.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 檢查是否還有錯誤的標記
        const hasBadToken = content.includes('<｜tool▁call▁begin｜>');

        // 檢查正確的語法
        const hasCorrectSyntax = content.includes('const majorStars = Array.isArray');

        if (!hasBadToken && hasCorrectSyntax) {
            this.log('語法錯誤已修復', true, '不包含錯誤標記，語法正確');
        } else {
            this.log('語法錯誤未修復', false, `錯誤標記: ${hasBadToken}, 正確語法: ${hasCorrectSyntax}`);
        }
    }

    // 修復 2: destiny-calculator.js 重複鍵
    checkDuplicateKeys() {
        console.log('\n📋 檢查修復 2: destiny-calculator.js 重複鍵定義');

        const filePath = path.join(__dirname, 'public/api/destiny-calculator.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 找到 posMap 部分
        const posMapMatch = content.match(/const posMap = \{[\s\S]*?\};/);

        if (posMapMatch) {
            const posMapContent = posMapMatch[0];

            // 檢查是否有 '申' 鍵
            const hasApplyKey = posMapContent.includes("'申': [");

            // 計算 '未' 出現的次數（應該只有一次）
            const weiCount = (posMapContent.match(/'未':\s*\[/g) || []).length;

            if (hasApplyKey && weiCount === 1) {
                this.log('重複鍵已修復', true, `包含 '申' 鍵，'未' 只出現 ${weiCount} 次`);
            } else {
                this.log('重複鍵未修復', false, `'申' 鍵: ${hasApplyKey}, '未' 出現: ${weiCount} 次`);
            }
        } else {
            this.log('無法找到 posMap', false, '');
        }
    }

    // 修復 3: 農曆轉換隨機數
    checkLunarConversion() {
        console.log('\n📋 檢查修復 3: 農曆轉換算法');

        const filePath = path.join(__dirname, 'public/api/destiny-calculator.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 找到 convertSolarToLunar 函數
        const funcMatch = content.match(/convertSolarToLunar\([\s\S]*?\n    \}/);

        if (funcMatch) {
            const funcContent = funcMatch[0];

            // 檢查是否還使用 Math.random()
            const usesRandom = funcContent.includes('Math.random()');

            // 檢查是否使用正確的算法
            const hasProperCalculation = funcContent.includes('baseDate') &&
                funcContent.includes('diffDays') &&
                funcContent.includes('avgMonthDays');

            if (!usesRandom && hasProperCalculation) {
                this.log('農曆轉換已修復', true, '不再使用隨機數，使用確定性算法');
            } else {
                this.log('農曆轉換未修復', false, `使用隨機: ${usesRandom}, 正確算法: ${hasProperCalculation}`);
            }
        } else {
            this.log('無法找到農曆轉換函數', false, '');
        }
    }

    // 修復 4 & 6: analyze.js GPT-4o 和安全性
    checkAnalyzeJsUpgrade() {
        console.log('\n📋 檢查修復 4 & 6: analyze.js 升級和安全性');

        const filePath = path.join(__dirname, 'api/analyze.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 檢查 GPT-4o 模型
        const usesGPT4o = content.includes("model: 'gpt-4o'");

        // 檢查 CORS 限制
        const hasCORSRestriction = content.includes('allowedOrigins') &&
            content.includes('ziweidoushu.vercel.app');

        // 檢查輸入驗證
        const hasInputValidation = content.includes('birthYear < 1900') &&
            content.includes("['M', 'F'].includes");

        // 檢查 sanitize 函數
        const hasSanitization = content.includes('function sanitizeInput');

        const allPassed = usesGPT4o && hasCORSRestriction && hasInputValidation && hasSanitization;

        this.log('analyze.js 升級完成', allPassed,
            `GPT-4o: ${usesGPT4o}, CORS: ${hasCORSRestriction}, 驗證: ${hasInputValidation}, 清理: ${hasSanitization}`);
    }

    // 修復 7 & 8: question.js Thread 對話和後端 Credit
    checkQuestionJsUpgrade() {
        console.log('\n📋 檢查修復 7 & 8: question.js Thread 對話和 Credit 管理');

        const filePath = path.join(__dirname, 'api/question.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 檢查 GPT-4o 模型
        const usesGPT4o = content.includes("model: 'gpt-4o'");

        // 檢查 Thread 功能
        const hasThreadSupport = content.includes('threadId') &&
            content.includes('conversationStore') &&
            content.includes('saveConversationHistory');

        // 檢查後端 Credit 管理
        const hasBackendCredit = content.includes('creditStore') &&
            content.includes('checkAndConsumeCredit');

        // 檢查命盤自動帶入
        const hasDestinyIntegration = content.includes('buildSystemMessage') &&
            content.includes('十二宮位星曜配置');

        const allPassed = usesGPT4o && hasThreadSupport && hasBackendCredit && hasDestinyIntegration;

        this.log('question.js 升級完成', allPassed,
            `GPT-4o: ${usesGPT4o}, Thread: ${hasThreadSupport}, Credit: ${hasBackendCredit}, 命盤: ${hasDestinyIntegration}`);
    }

    // 修復 3: calculate.js 真實計算引擎整合
    checkCalculateJsIntegration() {
        console.log('\n📋 檢查修復 3: calculate.js 真實計算引擎整合');

        const filePath = path.join(__dirname, 'api/calculate.js');
        const content = fs.readFileSync(filePath, 'utf8');

        // 檢查是否嘗試載入真實核心
        const loadsRealCore = content.includes("require('../build/main.js')");

        // 檢查是否有真實計算函數
        const hasRealCalculation = content.includes('calculateWithRealCore');

        // 檢查是否有備用邏輯
        const hasFallback = content.includes('calculateWithSimplifiedLogic');

        // 檢查輸入驗證
        const hasValidation = content.includes('birthYear < 1900') &&
            content.includes("['M', 'F'].includes");

        const allPassed = loadsRealCore && hasRealCalculation && hasFallback && hasValidation;

        this.log('calculate.js 整合完成', allPassed,
            `載入核心: ${loadsRealCore}, 真實計算: ${hasRealCalculation}, 備用: ${hasFallback}, 驗證: ${hasValidation}`);
    }

    // 檢查文檔更新
    checkDocumentationUpdate() {
        console.log('\n📋 檢查修復 9: 文檔更新');

        const readmePath = path.join(__dirname, 'README.md');
        const snapshotPath = path.join(__dirname, 'PROJECT_SNAPSHOT.md');

        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        const snapshotContent = fs.readFileSync(snapshotPath, 'utf8');

        // 檢查版本號更新
        const readmeHasVersion = readmeContent.includes('v2.1.0');
        const snapshotHasVersion = snapshotContent.includes('2.1.0');

        // 檢查 GPT-4o 提及
        const readmeHasGPT4o = readmeContent.includes('GPT-4o');
        const snapshotHasGPT4o = snapshotContent.includes('GPT-4o');

        // 檢查 Thread 功能提及
        const readmeHasThread = readmeContent.includes('Thread') || readmeContent.includes('連續對話');
        const snapshotHasThread = snapshotContent.includes('Thread') || snapshotContent.includes('連續對話');

        const allPassed = readmeHasVersion && snapshotHasVersion &&
            readmeHasGPT4o && snapshotHasGPT4o &&
            readmeHasThread && snapshotHasThread;

        this.log('文檔更新完成', allPassed,
            `README 版本: ${readmeHasVersion}, SNAPSHOT 版本: ${snapshotHasVersion}, GPT-4o: ${readmeHasGPT4o && snapshotHasGPT4o}, Thread: ${readmeHasThread && snapshotHasThread}`);
    }

    // 執行所有檢查
    runAll() {
        console.log('🔍 開始驗證 v2.1.0 修復...\n');
        console.log('='.repeat(60));

        this.checkQuestionJsSyntax();
        this.checkDuplicateKeys();
        this.checkLunarConversion();
        this.checkAnalyzeJsUpgrade();
        this.checkQuestionJsUpgrade();
        this.checkCalculateJsIntegration();
        this.checkDocumentationUpdate();

        console.log('\n' + '='.repeat(60));
        console.log('📊 驗證結果總結');
        console.log('='.repeat(60));

        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        const percentage = ((passed / total) * 100).toFixed(1);

        console.log(`✅ 通過: ${passed}/${total}`);
        console.log(`❌ 失敗: ${failed}/${total}`);
        console.log(`📈 成功率: ${percentage}%`);
        console.log('='.repeat(60));

        if (failed === 0) {
            console.log('\n🎉 所有修復已完成！系統已準備好部署。\n');
            return 0;
        } else {
            console.log('\n⚠️  部分修復未完成，請檢查失敗項目。\n');
            return 1;
        }
    }
}

// 執行驗證
const verifier = new FixVerifier();
const exitCode = verifier.runAll();
process.exit(exitCode);

