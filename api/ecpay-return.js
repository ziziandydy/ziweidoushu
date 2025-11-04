/**
 * 綠界金流 - 付款完成前端返回 API
 * 使用者付款完成後，從綠界導回此頁面（Client Return）
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
    // 綠界可能用 GET 或 POST 方式返回
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log('🔙 用戶從綠界返回:', {
            timestamp: new Date().toISOString(),
            method: req.method,
            query: req.query,
            body: req.body
        });

        // 取得回傳資料（可能在 query 或 body）
        const data = req.method === 'POST' ? req.body : req.query;

        // 驗證 CheckMacValue
        const isValid = verifyCheckMacValue(data);

        if (!isValid) {
            console.error('❌ CheckMacValue 驗證失敗');
            // 導向失敗頁面
            return res.redirect('/payment-failed.html?error=verification_failed');
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
        } = data;

        // 判斷付款是否成功
        if (RtnCode === '1') {
            console.log('✅ 付款成功，導向成功頁面:', {
                orderId: MerchantTradeNo,
                userId: CustomField1,
                amount: TradeAmt
            });

            // 導向成功頁面，並帶上參數
            const successUrl = `/payment-success.html?` +
                `orderId=${encodeURIComponent(MerchantTradeNo)}` +
                `&userId=${encodeURIComponent(CustomField1)}` +
                `&amount=${encodeURIComponent(TradeAmt)}` +
                `&tradeNo=${encodeURIComponent(TradeNo)}`;

            return res.redirect(successUrl);

        } else {
            console.error('❌ 付款失敗，導向失敗頁面:', {
                orderId: MerchantTradeNo,
                rtnCode: RtnCode,
                rtnMsg: RtnMsg
            });

            // 導向失敗頁面
            const failUrl = `/payment-failed.html?` +
                `orderId=${encodeURIComponent(MerchantTradeNo)}` +
                `&error=${encodeURIComponent(RtnMsg || 'Unknown error')}`;

            return res.redirect(failUrl);
        }

    } catch (error) {
        console.error('❌ 處理返回失敗:', error);
        return res.redirect('/payment-failed.html?error=server_error');
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

        if (!receivedCheckMacValue) {
            console.warn('⚠️ 未收到 CheckMacValue');
            return false;
        }

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
