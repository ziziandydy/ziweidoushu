// 推送自訂事件到 GTM dataLayer；GTM 的「GA4 - 自訂事件」tag 會轉送到 GA4
declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
}
