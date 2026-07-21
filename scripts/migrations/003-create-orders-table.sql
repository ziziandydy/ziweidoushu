-- Migration: Create orders table for ECPay payment persistence
-- Date: 2026-07-21
-- Description: Track ECPay checkout attempts so MerchantTradeNo/TradeNo can be
--              looked up later for refunds, reconciliation, and support.

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_trade_no VARCHAR(20) UNIQUE NOT NULL,
    trade_no VARCHAR(20),
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_type VARCHAR(50),
    payment_date TIMESTAMP,
    rtn_msg VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_merchant_trade_no ON orders(merchant_trade_no);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

COMMENT ON TABLE orders IS 'ECPay AIO checkout attempts, keyed by MerchantTradeNo. Upserted at creation (pending) and callback (paid/failed) so TradeNo is available for future refund lookups.';
COMMENT ON COLUMN orders.merchant_trade_no IS 'Our own order ID, sent to ECPay as MerchantTradeNo. Unique key for callback upsert (ECPay may retry callbacks up to 4 times).';
COMMENT ON COLUMN orders.trade_no IS 'ECPay-assigned transaction number, required by the DoAction refund API. Only populated once the callback arrives.';
