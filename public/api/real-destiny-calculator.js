/**
 * 紫微斗數真實計算 API
 * 使用 Node.js 調用 TypeScript 核心庫
 */

const express = require('express');
const path = require('path');

// 嘗試載入編譯後的 TypeScript 模組
let ZiweiCore;
try {
    // 嘗試從 build 目錄載入
    ZiweiCore = require('../../build/main.js');
    console.log('✅ TypeScript 核心庫已載入');
} catch (error) {
    console.log('❌ 無法載入 TypeScript 核心庫:', error.message);
    // 如果編譯版本不可用，提供模擬的實現
    ZiweiCore = null;
}

class RealZiweiCalculator {
    constructor() {
        this.server = null;
        this.isRunning = false;
    }

    // 啟動 API 服務器
    startServer(port = 3001) {
        if (this.isRunning) return;

        const express = require('express');
        const app = express();

        app.use(express.json());
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        // 計算命盤端點
        app.post('/calculate', (req, res) => {
            try {
                const { name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth } = req.body;

                console.log('🔮 接收到計算請求:', req.body);

                if (ZiweiCore) {
                    // 使用真實的核心庫
                    const result = this.calculateWithRealCore({
                        name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth
                    });

                    res.json({
                        success: true,
                        data: result,
                        source: 'real-core'
                    });
                } else {
                    // 使用模擬實現
                    const result = this.calculateWithMockCore({
                        name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth
                    });

                    res.json({
                        success: true,
                        data: result,
                        source: 'mock-core'
                    });
                }

            } catch (error) {
                console.error('❌ 計算錯誤:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // 健康檢查端點
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                coreAvailable: !!ZiweiCore,
                timestamp: new Date().toISOString()
            });
        });

        this.server = app.listen(port, 'localhost', () => {
            console.log(`🚀 真實紫微斗數 API 服務器運行在 http://localhost:${port}`);
            this.isRunning = true;
        });
    }

    // 使用真實核心庫計算
    calculateWithRealCore(input) {
        try {
            const { DestinyBoard, DestinyConfigBuilder, Gender, DayTimeGround, ConfigType } = ZiweiCore;

            // 創建配置
            const config = DestinyConfigBuilder.withlunar({
                year: input.birthYear,
                month: input.birthMonth,
                day: input.birthDay,
                isLeapMonth: input.isLeapMonth,
                bornTimeGround: DayTimeGround.getByName(input.birthHour),
                configType: ConfigType.SKY,
                gender: input.gender === 'M' ? Gender.M : Gender.F,
            });

            // 創建命盤
            const destinyBoard = new DestinyBoard(config);

            // 解析命盤結果
            const result = {
                userInfo: {
                    name: input.name,
                    gender: input.gender,
                    birthYear: input.birthYear,
                    birthMonth: input.birthMonth,
                    birthDay: input.birthDay,
                    birthHour: input.birthHour,
                    calendarType: input.calendarType
                },
                destinyInfo: {
                    element: destinyBoard.element,
                    destinyMaster: destinyBoard.destinyMaster?.name || '未知',
                    bodyMaster: destinyBoard.bodyMaster?.name || '未知',
                    palaces: destinyBoard.cells.map((cell, index) => ({
                        palaceName: `宮位${index + 1}`,
                        palaceIndex: index,
                        majorStars: cell.majorStars.map(star => ({
                            name: star.name,
                            energyLevel: star.energy || 50,
                            energyType: star.energyType || 'neutral'
                        })),
                        minorStars: cell.minorStars.map(star => ({
                            name: star.name,
                            energyLevel: star.energy || 30,
                            energyType: star.energyType || 'neutral'
                        })),
                        elementEnergy: 'neutral'
                    }))
                }
            };

            return result;

        } catch (error) {
            console.error('真實核心庫計算錯誤:', error);
            throw new Error(`真實核心庫計算失敗: ${error.message}`);
        }
    }

    // 使用模擬核心庫計算
    calculateWithMockCore(input) {
        console.log('🎭 使用模擬核心庫');

        // 創建模擬的宮位星曜數據
        const palaces = [
            '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
            '遷移', '交友', '事業', '田宅', '福德', '父母'
        ];

        const majorStarsPool = ['紫微', '天府', '天機', '太陽', '武曲', '天同', '廉貞', '太陰'];
        const minorStarsPool = ['文昌', '文曲', '左輔', '右弼', '天魁', '天鉞', '祿存', '天馬'];

        const palacesData = palaces.map((name, index) => ({
            palaceName: name,
            palaceIndex: index,
            majorStars: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
                name: majorStarsPool[index % majorStarsPool.length],
                energyLevel: Math.floor(Math.random() * 40) + 60,
                energyType: 'yang'
            })),
            minorStars: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
                name: minorStarsPool[i % minorStarsPool.length],
                energyLevel: Math.floor(Math.random() * 30) + 40,
                energyType: 'yin'
            })),
            elementEnergy: ['strong', 'neutral', 'weak'][index % 3]
        }));

        return {
            userInfo: {
                name: input.name,
                gender: input.gender,
                birthYear: input.birthYear,
                birthMonth: input.birthMonth,
                birthDay: input.birthDay,
                birthHour: input.birthHour,
                calendarType: input.calendarType
            },
            destinyInfo: {
                element: '五行',
                destinyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                bodyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                palaces: palacesData
            }
        };
    }

    // 停止服務器
    stopServer() {
        if (this.server) {
            this.server.close();
            this.server = null;
            this.isRunning = false;
            console.log('🛑 API 服務器已停止');
        }
    }
}

// 如果直接在 Node.js 環境中運行此文件
if (typeof window === 'undefined') {
    const calculator = new RealZiweiCalculator();
    calculator.startServer(3001);

    // 處理程序退出
    process.on('SIGINT', () => {
        console.log('\n🛑 正在關閉服務器...');
        calculator.stopServer();
        process.exit(0);
    });
}

// 瀏覽器環境下的 API 包裝器
if (typeof window !== 'undefined') {
    window.RealZiweiAPI = {
        calculateDestiny: async function (userInput) {
            try {
                console.log('🌐 調用遠程真實 API:', userInput);

                const response = await fetch('http://localhost:3001/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInput)
                });

                const result = await response.json();

                if (result.success) {
                    return {
                        success: true,
                        destinyInfo: result.data.destinyInfo,
                        userInfo: result.data.userInfo,
                        source: result.source
                    };
                } else {
                    return {
                        success: false,
                        error: result.error
                    };
                }

            } catch (error) {
                console.error('🌐 API 調用錯誤:', error);
                return {
                    success: false,
                    error: `API 調用失敗: ${error.message}`
                };
            }
        }
    };
}

module.exports = RealZiweiCalculator;
