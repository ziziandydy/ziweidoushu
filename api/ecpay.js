/**
 * 綠界金流 - 統一 API
 * 整合 create, callback, return 三個功能
 */

const ecpay_payment = require('ecpay_aio_nodejs');
const crypto = require('crypto');
const { sql } = require('@vercel/postgres');

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

    // 記錄訂單為 pending，讓 callback 到達前也留有 TradeNo 查詢基礎；
    // 即使消費者中途放棄付款，未來的退款/對帳仍能追溯這筆嘗試
    try {
        await sql`
            INSERT INTO orders (merchant_trade_no, user_id, user_name, user_email, amount, status)
            VALUES (${orderId}, ${userId}, ${userName || ''}, ${userEmail || ''}, ${amount}, 'pending')
            ON CONFLICT (merchant_trade_no) DO NOTHING
        `;
    } catch (dbError) {
        console.error('⚠️ 訂單寫入資料庫失敗（不影響付款流程，但退款時將查不到這筆訂單）:', dbError);
    }

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

    const isPaid = RtnCode === '1';

    if (isPaid) {
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

    // Upsert（非 insert）：ECPay callback 最多重送 4 次，須以 MerchantTradeNo 冪等處理，
    // 避免重複入帳；也涵蓋 handleCreate 當下 DB 寫入失敗、這裡第一次補上該筆訂單的情況
    try {
        await sql`
            INSERT INTO orders (merchant_trade_no, trade_no, user_id, amount, status, payment_type, payment_date, rtn_msg)
            VALUES (
                ${MerchantTradeNo},
                ${TradeNo || null},
                ${data.CustomField1 || ''},
                ${TradeAmt ? parseInt(TradeAmt, 10) : null},
                ${isPaid ? 'paid' : 'failed'},
                ${data.PaymentType || null},
                ${PaymentDate ? new Date(PaymentDate) : null},
                ${RtnMsg || null}
            )
            ON CONFLICT (merchant_trade_no) DO UPDATE SET
                trade_no = EXCLUDED.trade_no,
                status = EXCLUDED.status,
                payment_type = EXCLUDED.payment_type,
                payment_date = EXCLUDED.payment_date,
                rtn_msg = EXCLUDED.rtn_msg,
                updated_at = CURRENT_TIMESTAMP
        `;
    } catch (dbError) {
        console.error('⚠️ 訂單狀態更新失敗（付款結果仍會回覆給綠界，但這筆訂單的 TradeNo 未被記錄）:', dbError);
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
 * 綠界專用 URL Encode：encodeURIComponent 不會編碼 ~ 和 '，但 ECPay 演算法
 * 沿用 PHP urlencode() 行為（會編碼為 %7E / %27），漏做這兩個替換會導致
 * 任何含 ~ 或 ' 的欄位（例如使用者姓名 O'Brien）算出的 CheckMacValue 永遠不符，
 * 讓合法的付款通知被誤判為驗證失敗。
 */
function ecpayUrlEncode(source) {
    let encoded = encodeURIComponent(source)
        .replace(/%20/g, '+')
        .replace(/~/g, '%7e')
        .replace(/'/g, '%27');
    encoded = encoded.toLowerCase();
    const replacements = {
        '%2d': '-', '%5f': '_', '%2e': '.', '%21': '!',
        '%2a': '*', '%28': '(', '%29': ')',
    };
    for (const [oldStr, char] of Object.entries(replacements)) {
        encoded = encoded.split(oldStr).join(char);
    }
    return encoded;
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

        const hash = crypto.createHash('sha256');
        hash.update(ecpayUrlEncode(checkStr));
        const calculatedCheckMacValue = hash.digest('hex').toUpperCase();

        console.log('🔐 CheckMacValue 驗證:', {
            received: receivedCheckMacValue,
            calculated: calculatedCheckMacValue,
        });

        // Timing-safe 比對：CheckMacValue 是安全驗證機制，禁止用 === 直接比較字串
        const receivedBuf = Buffer.from(receivedCheckMacValue);
        const calculatedBuf = Buffer.from(calculatedCheckMacValue);
        if (receivedBuf.length !== calculatedBuf.length) return false;
        return crypto.timingSafeEqual(receivedBuf, calculatedBuf);
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
