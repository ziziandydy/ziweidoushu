/**
 * 綠界金流 - 統一 API
 * 整合 create, callback, return 三個功能
 */

const ecpay_payment = require('ecpay_aio_nodejs');
const crypto = require('crypto');

// 綠界金流配置
const ECPAY_CONFIG = {
    MerchantID: process.env.ECPAY_MERCHANT_ID || '2000132',
    HashKey: process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9',
    HashIV: process.env.ECPAY_HASH_IV || 'v77hoKGq4kWxNNIS',
};

const IS_PRODUCTION = process.env.NODE_ENV === 'production' && process.env.ECPAY_MERCHANT_ID;

module.exports = async (req, res) => {
    const { action } = req.query;

    try {
        switch (action) {
            case 'create':
                return await handleCreate(req, res);
            case 'callback':
                return await handleCallback(req, res);
            case 'return':
                return await handleReturn(req, res);
            default:
                return res.status(400).json({ success: false, error: 'Invalid action' });
        }
    } catch (error) {
        console.error(`❌ ECPay ${action} 錯誤:`, error);
        return res.status(500).json({
            success: false,
            error: '處理失敗，請稍後再試',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * 建立訂單
 */
async function handleCreate(req, res) {
    // CORS 設定
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-User-ID');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: '僅支援 POST 請求' });
    }

    const { userId, userName, userEmail } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: '缺少必要參數：userId'
        });
    }

    // 生成訂單編號
    const orderId = 'ZW' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    const amount = 199;

    const baseUrl = req.headers.origin ||
                   `https://${req.headers.host}` ||
                   'https://ziweidoushu.vercel.app';

    // 建立綠界金流訂單參數
    const options = {
        OperationMode: IS_PRODUCTION ? 'Production' : 'Test',
        MercProfile: {
            MerchantID: ECPAY_CONFIG.MerchantID,
            HashKey: ECPAY_CONFIG.HashKey,
            HashIV: ECPAY_CONFIG.HashIV,
        },
        IgnorePayment: [],
        IsProjectContractor: false
    };

    const create = new ecpay_payment(options);
    const MerchantTradeDate = getDateString();

    const base_param = {
        MerchantTradeNo: orderId,
        MerchantTradeDate: MerchantTradeDate,
        TotalAmount: amount.toString(),
        TradeDesc: '紫微斗數AI問答-付費解鎖',
        ItemName: '1小時無限問答',
        ReturnURL: `${baseUrl}/api/ecpay?action=callback`,
        ClientBackURL: `${baseUrl}/api/ecpay?action=return`,
        CustomField1: userId,
        CustomField2: userName || '',
        CustomField3: userEmail || '',
    };

    const html = create.payment_client.aio_check_out_credit_onetime(base_param);

    console.log('✅ 訂單建立成功:', {
        orderId: orderId,
        amount: amount,
        userId: userId,
        timestamp: new Date().toISOString()
    });

    return res.status(200).json({
        success: true,
        orderId: orderId,
        amount: amount,
        html: html,
        redirectUrl: IS_PRODUCTION
            ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
            : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
    });
}

/**
 * 付款結果後端通知
 */
async function handleCallback(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    console.log('📥 收到綠界付款通知:', {
        timestamp: new Date().toISOString(),
        body: req.body
    });

    const data = req.body;
    const isValid = verifyCheckMacValue(data);

    if (!isValid) {
        console.error('❌ CheckMacValue 驗證失敗');
        return res.status(400).send('0|CheckMacValue verification failed');
    }

    const {
        RtnCode,
        RtnMsg,
        MerchantTradeNo,
        TradeNo,
        TradeAmt,
        PaymentDate,
        CustomField1,
    } = data;

    if (RtnCode === '1') {
        console.log('✅ 付款成功:', {
            orderId: MerchantTradeNo,
            tradeNo: TradeNo,
            amount: TradeAmt,
            userId: CustomField1,
            paymentDate: PaymentDate
        });
    } else {
        console.error('❌ 付款失敗:', {
            orderId: MerchantTradeNo,
            rtnCode: RtnCode,
            rtnMsg: RtnMsg
        });
    }

    return res.status(200).send('1|OK');
}

/**
 * 付款完成前端返回
 */
async function handleReturn(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    console.log('🔙 用戶從綠界返回:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        query: req.query,
        body: req.body
    });

    const data = req.method === 'POST' ? req.body : req.query;
    const isValid = verifyCheckMacValue(data);

    if (!isValid) {
        console.error('❌ CheckMacValue 驗證失敗');
        return res.redirect('/payment-failed.html?error=verification_failed');
    }

    const {
        RtnCode,
        RtnMsg,
        MerchantTradeNo,
        TradeNo,
        TradeAmt,
        CustomField1,
    } = data;

    if (RtnCode === '1') {
        console.log('✅ 付款成功，導向成功頁面:', {
            orderId: MerchantTradeNo,
            userId: CustomField1,
            amount: TradeAmt
        });

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

        const failUrl = `/payment-failed.html?` +
            `orderId=${encodeURIComponent(MerchantTradeNo)}` +
            `&error=${encodeURIComponent(RtnMsg || 'Unknown error')}`;

        return res.redirect(failUrl);
    }
}

/**
 * 驗證綠界 CheckMacValue
 */
function verifyCheckMacValue(data) {
    try {
        const receivedCheckMacValue = data.CheckMacValue;

        if (!receivedCheckMacValue) {
            console.warn('⚠️ 未收到 CheckMacValue');
            return false;
        }

        const params = { ...data };
        delete params.CheckMacValue;

        const sortedKeys = Object.keys(params).sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        let checkStr = `HashKey=${ECPAY_CONFIG.HashKey}`;
        sortedKeys.forEach(key => {
            checkStr += `&${key}=${params[key]}`;
        });
        checkStr += `&HashIV=${ECPAY_CONFIG.HashIV}`;

        checkStr = encodeURIComponent(checkStr);
        checkStr = checkStr.toLowerCase()
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+');

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

/**
 * 取得當前日期字串
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
