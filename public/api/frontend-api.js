/**
 * 前端 API 代理 - 連接真實的後端 API
 */

window.RealZiweiAPI = {
    async calculateDestiny(userInput) {
        try {
            console.log('🔮 調用真實後端 API:', userInput);

            // 調用 Vercel API 路由
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInput)
            });

            const result = await response.json();
            console.log('🔮 後端 API 回應:', result);

            if (result.success) {
                return {
                    success: true,
                    palaces: result.palaces,
                    source: 'vercel-api',
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    success: false,
                    error: result.error
                };
            }

        } catch (error) {
            console.error('🌐 API 調用錯誤:', error);

            // 如果後端 API 不可用，回退到模擬計算
            console.log('🔄 回退到模擬計算');
            return this.mockCalculation(userInput);
        }
    },

    // 模擬計算作為 fallback
    mockCalculation(userInput) {
        console.log('🎭 執行模擬計算');

        const palaces = [
            '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
            '遷移', '交友', '事業', '田宅', '福德', '父母'
        ];

        const majorStarsPool = [
            '紫微', '天府', '天機', '太陽', '武曲', '天同', '廉貞', '太陰'
        ];

        const palacesData = palaces.map((name, index) => ({
            palaceName: name,
            palaceIndex: index,
            majorStars: Math.random() > 0.2 ? [{
                name: majorStarsPool[index % majorStarsPool.length],
                energyLevel: Math.floor(Math.random() * 40) + 60,
                energyType: index % 2 === 0 ? 'yang' : 'yin'
            }] : [],
            minorStars: [],
            energy: Math.floor(Math.random() * 40) + 50
        }));

        return {
            success: true,
            destinyInfo: {
                element: ['金', '木', '水', '火', '土'][Math.floor(Math.random() * 5)],
                destinyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                bodyMaster: majorStarsPool[Math.floor(Math.random() * majorStarsPool.length)],
                palaces: palacesData
            },
            userInfo: userInput,
            source: 'mock-fallback',
            timestamp: new Date().toISOString()
        };
    }
};
