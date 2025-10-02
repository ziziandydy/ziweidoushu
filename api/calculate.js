/**
 * Vercel Serverless Function for Zi Wei Dou Shu Calculation
 * API Route: /api/calculate
 */

// 嘗試載入編譯後的 TypeScript 模組
let ZiweiCore;
try {
    const mainModule = require('../build/main.js');
    ZiweiCore = mainModule;
    console.log('✅ TypeScript 核心庫已載入');
} catch (error) {
    console.log('❌ 無法載入 TypeScript 核心庫:', error.message);
    ZiweiCore = null;
}

export default async function handler(req, res) {
    // CORS 頭部
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const data = req.body;
        
        // 驗證輸入
        if (!data.name || !data.gender || !data.birthYear || !data.birthMonth || !data.birthDay || !data.birthHour) {
            res.status(400).json({ 
                error: '請填寫完整資料',
                required: ['name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'birthHour']
            });
            return;
        }

        console.log('🔮 接收到計算請求:', data);

        let destinyBoard;

        if (ZiweiCore) {
            // 使用真實核心庫
            console.log('🏛️ 使用真實核心庫計算');
            
            try<｜tool▁call▁begin｜>
                const { DestinyBoard, DestinyConfigBuilder, Gender, DayTimeGround, ConfigType } = ZiweiCore;
                
                // 轉換輸入格式
                const gender = data.gender === 'M' ? Gender.M : Gender.F;
                const bornTimeGround = DayTimeGround.getByName(data.birthHour);
                
                let config;
                if (data.calendarType === 'lunar') {
                    config = DestinyConfigBuilder.withlunar({
                        year: data.birthYear,
                        month: data.birthMonth,
                        day: data.birthDay,
                        isLeapMonth: data.isLeapMonth || false,
                        bornTimeGround: bornTimeGround,
                        configType: ConfigType.SKY,
                        gender: gender,
                    });
                } else {
                    config = DestinyConfigBuilder.withSolar({
                        year: data.birthYear,
                        month: data.birthMonth,
                        day: data.birthDay,
                        bornTimeGround: bornTimeGround,
                        configType: ConfigType.SKY,
                        gender: gender,
                    });
                }
                
                destinyBoard = new DestinyBoard(config);
            } catch (coreError) {
                console.log('❌ 核心庫計算失敗:', coreError.message);
                throw coreError;
            }
        } else {
            res.status(500).json({ error: 'TypeScript 核心庫載入失敗' });
            return;
        }

        // 格式化回應
        const response = {
            success: true,
            name: data.name,
            palaces: destinyBoard.cells.map((cell, index) => ({
                palaceName: cell.temples[0]?.toString() || `宮位${index + 1}`,
                majorStars: cell.majorStars.map((star, starIndex) => ({
                    name: star.displayName || star.name || star.toString() || `主星${starIndex + 1}`,
                    energyLevel: star.energy || star.energyLevel || 50,
                    energyType: star.energyType || 'neutral'
                })),
                minorStars: cell.minorStars.map((star, starIndex) => ({
                    name: star.displayName || star.name || star.toString() || `輔星${starIndex + 1}`,
                    energyLevel: star.energy || star.energyLevel || 30,
                    energyType: star.energyType || 'neutral'
                })),
                element: cell.ground?.toString() || '',
                ageRange: cell.ageRange?.toString() || ''
            }))
        };

        console.log('✅ 計算完成，返回', response.palaces.length, '個宮位');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ 計算錯誤:', error);
        res.status(500).json({ 
            error: '計算失敗',
            details: error.message 
        });
    }
}
