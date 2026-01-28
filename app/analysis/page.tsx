import React from 'react';

export const metadata = {
    title: '紫微斗數命盤計算 | AI 命理分析系統',
    description: '免費紫微斗數命盤計算工具，輸入出生年月日時即可自動生成命盤。結合 AI 技術提供深度命理分析。',
}

export default function AnalysisPage() {
    return (
        <div className="min-h-screen pt-16">
            {/* Navigation - could be a component */}
            <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <a href="/index.html"
                        className="flex items-center space-x-2 text-gray-700 hover:text-ziwei-purple transition-colors">
                        <span className="font-medium">返回首頁</span>
                    </a>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">AI 紫微斗數</span>
                    </div>
                </div>
            </nav>

            {/* Main Container */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-6">紫微斗數命盤</h1>
                    <p className="text-center text-gray-600 mb-4">遵循中州派傳統理論 · 結合 AI 技術的專業命理分析系統</p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Migration In Progress:</strong> This page is being moved to React.
                            The functionalities are currently being ported. Please use the <a href="/analysis.html" className="underline text-blue-600">Legacy Page</a> for now.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
