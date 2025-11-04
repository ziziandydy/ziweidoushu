/**
 * 綠界金流 - 付款結果後端通知 API
 * 接收綠界的付款結果通知（Server to Server）
 */

const crypto = require('crypto');

// 綠界金流配置
const ECPAY_CONFIG = {
    // 測試環境
    MerchantID: process.env.ECPAY_MERCHANT_ID || '2000132',
    HashKey: process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9',
    HashIV: process.env.ECPAY_HASH_IV || 'v77hoKGq4kWxNNIS',
};

module.exports = async (req, res) => {
    // 綠界只會用 POST 方式通知
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log('📥 收到綠界付款通知:', {
            timestamp: new Date().toISOString(),
            body: req.body
        });

        // 取得綠界回傳的資料
        const data = req.body;

        // 驗證 CheckMacValue（重要：防止偽造）
        const isValid = verifyCheckMacValue(data);

        if (!isValid) {
            console.error('❌ CheckMacValue 驗證失敗');
            return res.status(400).send('0|CheckMacValue verification failed');
        }

        // 取得付款結果
        const {
            RtnCode,          // 交易狀態（1 = 成功）
            RtnMsg,           // 交易訊息
            MerchantTradeNo,  // 訂單編號
            TradeNo,          // 綠界交易編號
            TradeAmt,         // 交易金額
            PaymentDate,      // 付款時間
            CustomField1,     // 用戶 ID
            CustomField2,     // 用戶姓名
            CustomField3,     // 用戶 Email
        } = data;

        // 判斷付款是否成功
        if (RtnCode === '1') {
            console.log('✅ 付款成功:', {
                orderId: MerchantTradeNo,
                tradeNo: TradeNo,
                amount: TradeAmt,
                userId: CustomField1,
                paymentDate: PaymentDate
            });

            // TODO: 這裡可以將訂單資料存入資料庫
            // 例如：存入 MongoDB, PostgreSQL, 或 Vercel KV

            // 目前使用 localStorage，所以這裡只需記錄 log
            // 實際啟用付費模式會在前端 /api/ecpay-return 處理

        } else {
            console.error('❌ 付款失敗:', {
                orderId: MerchantTradeNo,
                rtnCode: RtnCode,
                rtnMsg: RtnMsg
            });
        }

        // 回應綠界（必須回傳 1|OK，否則綠界會持續通知）
        return res.status(200).send('1|OK');

    } catch (error) {
        console.error('❌ 處理付款通知失敗:', error);
        return res.status(500).send('0|Error');
    }
};

/**
 * 驗證綠界 CheckMacValue
 * @param {Object} data - 綠界回傳的資料
 * @returns {boolean} - 是否驗證通過
 */
function verifyCheckMacValue(data) {
    try {
        // 取得原始的 CheckMacValue
        const receivedCheckMacValue = data.CheckMacValue;

        // 移除 CheckMacValue（計算時不包含）
        const params = { ...data };
        delete params.CheckMacValue;

        // 按照 A-Z 排序參數
        const sortedKeys = Object.keys(params).sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        // 組合參數字串
        let checkStr = `HashKey=${ECPAY_CONFIG.HashKey}`;
        sortedKeys.forEach(key => {
            checkStr += `&${key}=${params[key]}`;
        });
        checkStr += `&HashIV=${ECPAY_CONFIG.HashIV}`;

        // URL Encode
        checkStr = encodeURIComponent(checkStr);

        // 轉換特殊字元（綠界規範）
        checkStr = checkStr.toLowerCase()
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+');

        // SHA256 加密
        const hash = crypto.createHash('sha256');
        hash.update(checkStr);
        const calculatedCheckMacValue = hash.digest('hex').toUpperCase();

        console.log('🔐 CheckMacValue 驗證:', {
            received: receivedCheckMacValue,
            calculated: calculatedCheckMacValue,
            match: receivedCheckMacValue === calculatedCheckMacValue
        });

        return receivedCheckMacValue === calculatedCheckMacValue;

    } catch (error) {
        console.error('❌ CheckMacValue 驗證錯誤:', error);
        return false;
    }
}
