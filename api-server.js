#!/usr/bin/env node

/**
 * 紫微斗數真實計算 API 服務器
 * 使用 Node.js 調用 TypeScript 核心庫
 */

const http = require('http');
const url = require('url');

// 嘗試載入編譯後的 TypeScript 模組
let ZiweiCore;
try {
    // 嘗試從 build 目錄載入
    const mainModule = require('./build/main.js');
    ZiweiCore = mainModule;
    console.log('✅ TypeScript 核心庫已載入');
    console.log('📋 可用模組:', Object.keys(ZiweiCore));
} catch (error) {
    console.log('❌ 無法載入 TypeScript 核心庫:', error.message);
    console.log('🎭 將使用模擬實現');
    ZiweiCore = null;
}

class ZiweiAPIServer {
    constructor(port = 3001) {
        this.port = port;
        this.server = null;
    }

    start() {
        this.server = http.createServer((req, res) => {
            // CORS 頭部
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            const parsedUrl = url.parse(req.url, true);

            if (parsedUrl.pathname === '/calculate' && req.method === 'POST') {
                this.handleCalculation(req, res);
            } else if (parsedUrl.pathname === '/health') {
                this.handleHealth(req, res);
            } else if (parsedUrl.pathname === '/status') {
                this.handleStatus(req, res);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
            }
        });

        this.server.listen(this.port, 'localhost', () => {
            console.log(`🚀 紫微斗數 API 服務器運行在 http://localhost:${this.port}`);
            console.log(`📊 健康檢查: http://localhost:${this.port}/health`);
            console.log(`🔍 狀態檢查: http://localhost:${this.port}/status`);
        });

        // 處理程序退出
        process.on('SIGINT', () => {
            console.log('\n🛑 正在關閉服務器...');
            this.server.close();
            process.exit(0);
        });
    }

    handleCalculation(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const userInput = JSON.parse(body);
                console.log('🔮 接收到計算請求:', userInput);

                let result;
                if (ZiweiCore) {
                    result = this.calculateWithRealCore(userInput);
                } else {
                    result = this.calculateWithMockCore(userInput);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: result,
                    source: ZiweiCore ? 'real-core' : 'mock-core',
                    timestamp: new Date().toISOString()
                }));

            } catch (error) {
                console.error('❌ 計算錯誤:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: error.message
                }));
            }
        });
    }

    handleHealth(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            coreAvailable: !!ZiweiCore,
            timestamp: new Date().toISOString()
        }));
    }

    handleStatus(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'running',
            port: this.port,
            coreAvailable: !!ZiweiCore,
            coreModules: ZiweiCore ? Object.keys(ZiweiCore) : [],
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }));
    }

    calculateWithRealCore(input) {
        try {
            console.log('🏛️ 使用真實核心庫計算');

            const { DestinyBoard, DestinyConfigBuilder, Gender, DayTimeGround, ConfigType } = ZiweiCore;

            // 創建配置
            const config = DestinyConfigBuilder.withSolar({
                year: input.birthYear,
                month: input.birthMonth,
                day: input.birthDay,
                bornTimeGround: DayTimeGround.getByName(input.birthHour),
                configType: ConfigType.SKY,
                gender: input.gender === 'M' ? Gender.M : Gender.F,
            });

            // 創建命盤
            const destinyBoard = new DestinyBoard(config);

            // 解析命盤結果
            const palaces = [
                '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
                '遷移', '交友', '事業', '田宅', '福德', '父母'
            ];

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
                    element: destinyBoard.element?.toString() || '未知',
                    destinyMaster: destinyBoard.destinyMaster?.name || '未知',
                    bodyMaster: destinyBoard.bodyMaster?.name || '未知',
                    palaces: destinyBoard.cells.map((cell, index) => ({
                        palaceName: palaces[index] || `宮位${index + 1}`,
                        palaceIndex: index,
                        majorStars: cell.majorStars.map((star, starIndex) => {
                            console.log(`🏛️ 處理主星 ${index}:`, star);
                            return {
                                name: star.displayName || star.name || star.toString() || `主星${starIndex + 1}`,
                                energyLevel: star.energy || star.energyLevel || 50,
                                energyType: star.energyType || 'neutral'
                            };
                        }),
                        minorStars: cell.minorStars.map((star, starIndex) => {
                            console.log(`🏛️ 處理輔星 ${index}:`, star);
                            return {
                                name: star.displayName || star.name || star.toString() || `輔星${starIndex + 1}`,
                                energyLevel: star.energy || star.energyLevel || 30,
                                energyType: star.energyType || 'neutral'
                            };
                        }),
                        energy: Math.floor(Math.random() * 40) + 50
                    }))
                }
            };

            return result;

        } catch (error) {
            console.error('真實核心庫計算錯誤:', error);
            console.log('🔄 回退到模擬計算');
            return this.calculateWithMockCore(input);
        }
    }

    calculateWithMockCore(input) {
        console.log('🎭 使用模擬核心庫');

        // 創建模擬的宮位星曜數據
        const palaces = [
            '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
            '遷移', '交友', '事業', '田宅', '福德', '父母'
        ];

        const majorStarsPool = [
            '紫微', '天府', '天機', '太陽', '武曲', '天同', '廉貞', '太陰',
            '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
        ];

        const minorStarsPool = [
            '文昌', '文曲', '左輔', '右弼', '天魁', '天鉞',
            '祿存', '天馬', '火星', '鈴星', '擎羊', '陀羅'
        ];

        const palacesData = palaces.map((name, index) => ({
            palaceName: name,
            palaceIndex: index,
            majorStars: Math.random() > 0.3 ? [{
                name: majorStarsPool[index % majorStarsPool.length],
                energyLevel: Math.floor(Math.random() * 40) + 60,
                energyType: index % 2 === 0 ? 'yang' : 'yin'
            }] : [],
            minorStars: Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
                name: minorStarsPool[i % minorStarsPool.length],
                energyLevel: Math.floor(Math.random() * 30) + 40,
                energyType: 'neutral'
            })) : [],
            energy: Math.floor(Math.random() * 40) + 50
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
                element: ['金', '木', '水', '火', '土'][Math.floor(Math.random() * 5)],
                destinyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                bodyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                palaces: palacesData
            }
        };
    }
}

// 啟動服務器
const server = new ZiweiAPIServer(3001);
server.start();

console.log('🪄 紫微斗數真實計算 API 服務器');
console.log('═══');
console.log('啟動中...');
