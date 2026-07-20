"use client";

import React, { useEffect, useRef, useState } from 'react';
import { CalculationResult, UserProfile } from '../types';
import { AnalysisDict } from '../translations';

export interface ChatMessage {
    type: 'user' | 'assistant';
    text: string;
}

export const PAYMENT_RESTORE_KEY = 'payment_restore_state';
const FREE_CREDITS = 3;
const CREDITS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// localStorage keys are shared with public/payment-success.html, which writes
// paid_mode_${cookieId} after a successful ECPay payment — do not rename them.
function getCookieId(): string {
    let cookieId = localStorage.getItem('cookie_id');
    if (!cookieId) {
        cookieId = 'cookie_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('cookie_id', cookieId);
    }
    return cookieId;
}

function readCredits(cookieId: string): number {
    const creditsKey = `credits_${cookieId}`;
    const expiryKey = `credits_expiry_${cookieId}`;
    let credits = parseInt(localStorage.getItem(creditsKey) || String(FREE_CREDITS), 10);
    const expiry = localStorage.getItem(expiryKey);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
        credits = FREE_CREDITS;
        localStorage.setItem(creditsKey, String(FREE_CREDITS));
        localStorage.setItem(expiryKey, String(Date.now() + CREDITS_TTL_MS));
    }
    return credits;
}

function isPaidMode(cookieId: string): boolean {
    const paidModeExpiry = localStorage.getItem(`paid_mode_${cookieId}`);
    return !!paidModeExpiry && Date.now() < parseInt(paidModeExpiry, 10);
}

interface QASectionProps {
    locale: string;
    t: AnalysisDict;
    userProfile: UserProfile;
    destinyData: CalculationResult;
    initialMessages: ChatMessage[];
    /** Extra state to persist before redirecting to payment, so the page can restore afterwards */
    analysisSections: { title: string; content: string[] }[];
}

export default function QASection({ locale, t, userProfile, destinyData, initialMessages, analysisSections }: QASectionProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);
    const [paidMode, setPaidMode] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const threadIdRef = useRef<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const paymentFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cookieId = getCookieId();
        setCredits(readCredits(cookieId));
        setPaidMode(isPaidMode(cookieId));
    }, []);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages, sending]);

    const pricingHref = '/pricing.html';

    const consumeCredit = (): boolean => {
        const cookieId = getCookieId();
        if (isPaidMode(cookieId)) {
            setPaidMode(true);
            return true;
        }
        const current = readCredits(cookieId);
        if (current <= 0) return false;
        const next = current - 1;
        localStorage.setItem(`credits_${cookieId}`, String(next));
        if (!localStorage.getItem(`credits_expiry_${cookieId}`)) {
            localStorage.setItem(`credits_expiry_${cookieId}`, String(Date.now() + CREDITS_TTL_MS));
        }
        setCredits(next);
        return true;
    };

    const sendQuestion = async (rawQuestion?: string) => {
        const question = (rawQuestion ?? input).trim();
        if (!question || sending) return;

        if (!destinyData?.raw?.palaces || !userProfile?.name) {
            setMessages(prev => [...prev, { type: 'assistant', text: t.qa.chat.needChart }]);
            return;
        }

        const cookieId = getCookieId();
        if (!isPaidMode(cookieId) && readCredits(cookieId) <= 0) {
            setShowCreditModal(true);
            return;
        }
        if (!consumeCredit()) {
            setShowCreditModal(true);
            return;
        }

        setMessages(prev => [...prev, { type: 'user', text: question }]);
        setInput('');
        setSending(true);

        try {
            const response = await fetch(`/api/question?locale=${encodeURIComponent(locale)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': cookieId,
                },
                body: JSON.stringify({
                    question,
                    userProfile,
                    destinyData: destinyData.raw,
                    threadId: threadIdRef.current,
                    userId: cookieId,
                }),
            });
            const result = await response.json();

            if (result.success) {
                if (result.threadId) threadIdRef.current = result.threadId;
                setMessages(prev => [...prev, { type: 'assistant', text: result.answer }]);
            } else {
                setMessages(prev => [...prev, { type: 'assistant', text: result.error || t.qa.chat.genericError }]);
            }
        } catch (error) {
            console.error('QA error:', error);
            setMessages(prev => [...prev, { type: 'assistant', text: t.qa.chat.networkError }]);
        } finally {
            setSending(false);
        }
    };

    const enablePaidMode = async () => {
        setShowCreditModal(false);

        // Persist the whole session state so ?restore=true can resume after ECPay redirects back
        try {
            sessionStorage.setItem(PAYMENT_RESTORE_KEY, JSON.stringify({
                userProfile,
                calculationResult: destinyData,
                chatHistory: messages,
                analysisSections,
                timestamp: Date.now(),
            }));
        } catch (error) {
            console.error('Failed to save payment state:', error);
        }

        setPaymentLoading(true);
        try {
            const cookieId = getCookieId();
            const response = await fetch('/api/ecpay?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: cookieId,
                    userName: userProfile?.name || '',
                    userEmail: '',
                }),
            });
            const result = await response.json();

            if (result.success && result.html && paymentFormRef.current) {
                // ECPay returns an auto-submit form that redirects to its checkout page
                paymentFormRef.current.innerHTML = result.html;
                const form = paymentFormRef.current.querySelector('form');
                if (form) {
                    form.submit();
                    return; // page navigates away
                }
                throw new Error('Missing payment form');
            }
            throw new Error(result.error || 'Order creation failed');
        } catch (error: any) {
            console.error('Payment error:', error);
            setPaymentLoading(false);
            setMessages(prev => [...prev, { type: 'assistant', text: `${t.qa.payment.error}（${error.message}）` }]);
        }
    };

    return (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-purple-800">{t.qa.title}</h3>
                <div className="font-medium">
                    {paidMode ? (
                        <span className="text-green-600">{t.qa.paidMode}</span>
                    ) : (
                        <span className="text-purple-600">
                            {t.qa.creditLabel
                                .replace('{credits}', credits === null ? '…' : String(credits))
                                .replace('{total}', String(FREE_CREDITS))}
                        </span>
                    )}
                </div>
            </div>

            {/* Pricing info */}
            <div className="mb-4 bg-white rounded-lg p-4 border-2 border-purple-300 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-700 mb-2">{t.qa.pricing.title}</div>
                        <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span>{t.qa.pricing.freePlan}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                <span>{t.qa.pricing.paidPlan}</span>
                            </div>
                        </div>
                    </div>
                    <a href={pricingHref} className="ml-3 text-xs text-purple-600 hover:text-purple-800 underline whitespace-nowrap">
                        {t.qa.pricing.viewDetails}
                    </a>
                </div>
            </div>

            {/* Preset questions */}
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{t.qa.quickQuestions.title}</p>
                <div className="flex flex-wrap gap-2">
                    {t.qa.quickQuestions.questions.map(q => (
                        <button
                            key={q}
                            onClick={() => setInput(q)}
                            className="bg-white border border-purple-300 text-purple-700 px-3 py-1 rounded-full text-xs hover:bg-purple-100 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat */}
            <div ref={chatContainerRef} className="bg-white border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                {messages.length === 0 && !sending && (
                    <div className="text-center text-gray-500 text-sm">{t.qa.chat.emptyState}</div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex mb-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.type === 'user' ? 'bg-blue-500 text-white max-w-xs' : 'bg-gray-100 text-gray-800 max-w-md'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 text-gray-500 p-3 rounded-lg text-sm max-w-md animate-pulse">
                            {t.qa.chat.thinking}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendQuestion(); }}
                    placeholder={t.qa.chat.placeholder}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={() => sendQuestion()}
                    disabled={sending}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {t.qa.chat.sendButton}
                </button>
            </div>

            {/* Hidden container for the ECPay auto-submit form */}
            <div ref={paymentFormRef} className="hidden" />

            {/* Credit exhausted modal */}
            {showCreditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{t.qa.modal.title}</h3>
                        <p className="text-gray-600 mb-4">{t.qa.modal.description}</p>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-purple-800">{t.qa.modal.pricingTitle}</h4>
                                <span className="text-2xl font-bold text-purple-600">{t.qa.modal.price}</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-start"><span className="text-purple-600 mr-2">✓</span><span>{t.qa.modal.duration}</span></div>
                                <div className="flex items-start"><span className="text-purple-600 mr-2">✓</span><span>{t.qa.modal.paymentMethod}</span></div>
                                <div className="flex items-start"><span className="text-purple-600 mr-2">✓</span><span>{t.qa.modal.immediate}</span></div>
                            </div>
                            <a href={pricingHref} className="block mt-3 text-xs text-purple-600 hover:text-purple-800 underline text-center">
                                {t.qa.modal.viewFullPricing}
                            </a>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCreditModal(false)}
                                className="flex-1 bg-gray-500 text-white py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                {t.qa.modal.cancelButton}
                            </button>
                            <button
                                onClick={enablePaidMode}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium shadow-lg"
                            >
                                {t.qa.modal.unlockButton}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment redirect overlay */}
            {paymentLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md text-center">
                        <div className="animate-spin mx-auto mb-4 w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                        <p className="text-lg font-medium text-gray-800">{t.qa.payment.redirecting}</p>
                        <p className="text-sm text-gray-600 mt-2">{t.qa.payment.doNotClose}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
