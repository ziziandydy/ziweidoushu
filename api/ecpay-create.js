/**
 * 綠界金流 - 建立訂單 API
 * 處理付費解鎖 (1小時無限問答)
 */

const ecpay_payment = require('ecpay_aio_nodejs');
const crypto = require('crypto');

// 綠界金流配置
const ECPAY_CONFIG = {
    // 測試環境
    MerchantID: process.env.ECPAY_MERCHANT_ID || '2000132',  // 測試特店編號
    HashKey: process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9',  // 測試 HashKey
    HashIV: process.env.ECPAY_HASH_IV || 'v77hoKGq4kWxNNIS',  // 測試 HashIV

    // 正式環境（請在 Vercel 設定環境變數）
    // MerchantID: process.env.ECPAY_MERCHANT_ID,
    // HashKey: process.env.ECPAY_HASH_KEY,
    // HashIV: process.env.ECPAY_HASH_IV,
};

// 判斷是否為正式環境
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && process.env.ECPAY_MERCHANT_ID;

module.exports = async (req, res) => {
    // CORS 設定
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-User-ID');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: '僅支援 POST 請求' });
    }

    try {
        const { userId, userName, userEmail } = req.body;

        // 驗證必要參數
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: '缺少必要參數：userId'
            });
        }

        // 生成訂單編號（格式：時間戳 + 隨機數）
        const orderId = 'ZW' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

        // 訂單金額（1小時無限問答 = 199 元）
        const amount = 199;

        // 取得當前網站 URL
        const baseUrl = req.headers.origin ||
                       `https://${req.headers.host}` ||
                       'https://ziweidoushu.vercel.app';

        // 建立綠界金流訂單參數
        const options = {
            OperationMode: IS_PRODUCTION ? 'Production' : 'Test',  // Test or Production
            MercProfile: {
                MerchantID: ECPAY_CONFIG.MerchantID,
                HashKey: ECPAY_CONFIG.HashKey,
                HashIV: ECPAY_CONFIG.HashIV,
            },
            IgnorePayment: [],  // 不忽略任何付款方式
            IsProjectContractor: false
        };

        // 建立綠界金流物件
        const create = new ecpay_payment(options);

        // 訂單參數
        const MerchantTradeDate = getDateString();
        const TradeNo = orderId;

        const base_param = {
            MerchantTradeNo: TradeNo,           // 訂單編號
            MerchantTradeDate: MerchantTradeDate,  // 訂單日期
            TotalAmount: amount.toString(),     // 訂單金額
            TradeDesc: '紫微斗數AI問答-付費解鎖',  // 交易描述
            ItemName: '1小時無限問答',           // 商品名稱
            ReturnURL: `${baseUrl}/api/ecpay-callback`,  // 付款完成後端通知
            ClientBackURL: `${baseUrl}/api/ecpay-return`, // 付款完成前端返回
            // ChoosePayment: 'Credit',         // 移除此參數，使用 aio_check_out_credit_onetime
            // EncryptType: 1,                  // 移除此參數，SDK 會自動處理

            // 自訂參數（會在 ReturnURL 回傳）
            CustomField1: userId,               // 用戶 ID
            CustomField2: userName || '',       // 用戶姓名（選填）
            CustomField3: userEmail || '',      // 用戶 Email（選填）
        };

        // 產生綠界金流 HTML 表單（使用信用卡一次付清）
        const html = create.payment_client.aio_check_out_credit_onetime(base_param);

        console.log('✅ 訂單建立成功:', {
            orderId: TradeNo,
            amount: amount,
            userId: userId,
            timestamp: new Date().toISOString()
        });

        // 返回 HTML 表單（前端會自動提交）
        return res.status(200).json({
            success: true,
            orderId: TradeNo,
            amount: amount,
            html: html,
            redirectUrl: IS_PRODUCTION
                ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
                : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
        });

    } catch (error) {
        console.error('❌ 建立訂單失敗:', error);
        return res.status(500).json({
            success: false,
            error: '建立訂單失敗，請稍後再試',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * 取得當前日期字串（格式：yyyy/MM/dd HH:mm:ss）
 */
function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
