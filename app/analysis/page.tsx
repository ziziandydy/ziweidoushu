
import React from 'react';
import AnalysisClient from './AnalysisClient';

export const metadata = {
    title: '紫微斗數命盤計算 | AI 命理分析系統',
    description: '免費紫微斗數命盤計算工具，輸入出生年月日時即可自動生成命盤。結合 AI 技術提供深度命理分析。',
    alternates: {
        canonical: 'https://aiziwei.online/analysis.html', // Keep canonical to old URL for now or migrate?
        // Since we are migrating, we might want to change canonical eventually, but for now let's keep it safe.
    }
}

export default function AnalysisPage() {
    return <AnalysisClient />;
}
