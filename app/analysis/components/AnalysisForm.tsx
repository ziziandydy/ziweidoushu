"use client";

import React, { useState, useEffect } from 'react';

export type UserProfile = {
    name: string;
    gender: 'M' | 'F';
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: string;
    calendarType: 'solar' | 'lunar';
    isLeapMonth: boolean;
};

interface AnalysisFormProps {
    onSubmit: (profile: UserProfile) => void;
}

export default function AnalysisForm({ onSubmit }: AnalysisFormProps) {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'M' | 'F'>('M');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [birthYear, setBirthYear] = useState<number>(0);
    const [birthMonth, setBirthMonth] = useState<number>(0);
    const [birthDay, setBirthDay] = useState<number>(0);
    const [birthHour, setBirthHour] = useState<string>('');
    const [isLeapMonth, setIsLeapMonth] = useState(false);

    // Options
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [days, setDays] = useState<number[]>([]);

    const hours = [
        { value: '子時', label: '子時 (23:00-01:00)' },
        { value: '丑時', label: '丑時 (01:00-03:00)' },
        { value: '寅時', label: '寅時 (03:00-05:00)' },
        { value: '卯時', label: '卯時 (05:00-07:00)' },
        { value: '辰時', label: '辰時 (07:00-09:00)' },
        { value: '巳時', label: '巳時 (09:00-11:00)' },
        { value: '午時', label: '午時 (11:00-13:00)' },
        { value: '未時', label: '未時 (13:00-15:00)' },
        { value: '申時', label: '申時 (15:00-17:00)' },
        { value: '酉時', label: '酉時 (17:00-19:00)' },
        { value: '戌時', label: '戌時 (19:00-21:00)' },
        { value: '亥時', label: '亥時 (21:00-23:00)' },
    ];

    useEffect(() => {
        if (birthYear && birthMonth) {
            const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
            setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        } else {
            setDays([]);
        }
    }, [birthYear, birthMonth]);

    const handleSubmit = () => {
        if (!name || !birthYear || !birthMonth || !birthDay || !birthHour) {
            alert('請填寫完整資料');
            return;
        }
        onSubmit({
            name,
            gender,
            birthYear,
            birthMonth,
            birthDay,
            birthHour,
            calendarType,
            isLeapMonth
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-2 text-blue-500">📝</span>
                個人基本資料
            </h2>

            {/* Name & Gender */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-medium">姓名</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="請輸入您的姓名"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">性別</label>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setGender('M')}
                            className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${gender === 'M' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            男
                        </button>
                        <button
                            onClick={() => setGender('F')}
                            className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${gender === 'F' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            女
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Type */}
            <div>
                <label className="block mb-2 font-medium">曆法類型</label>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCalendarType('solar')}
                        className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${calendarType === 'solar' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        西曆
                    </button>
                    <button
                        onClick={() => setCalendarType('lunar')}
                        className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${calendarType === 'lunar' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        農曆
                    </button>
                </div>
            </div>

            {/* Date */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 font-medium">出生年</label>
                    <select
                        value={birthYear || ''}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">選擇年份</option>
                        {years.map(y => <option key={y} value={y}>{y}年</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">出生月</label>
                    <select
                        value={birthMonth || ''}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">選擇月份</option>
                        {months.map(m => <option key={m} value={m}>{m}月</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">出生日</label>
                    <select
                        value={birthDay || ''}
                        onChange={(e) => setBirthDay(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">選擇日期</option>
                        {days.map(d => <option key={d} value={d}>{d}日</option>)}
                    </select>
                </div>
            </div>

            {/* Hour */}
            <div>
                <label className="block mb-2 font-medium">出生時辰</label>
                <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">選擇時辰</option>
                    {hours.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                </select>
            </div>

            {/* Leap Month */}
            {calendarType === 'lunar' && (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isLeapMonth}
                        onChange={(e) => setIsLeapMonth(e.target.checked)}
                        id="leap-month"
                        className="rounded ring-purple-500"
                    />
                    <label htmlFor="leap-month" className="text-sm text-gray-600">此月為閏月</label>
                </div>
            )}

            {/* Submit */}
            <div className="mt-8">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                    <span className="mr-2">⭐</span>
                    計算命盤
                </button>
            </div>
        </div>
    );
}
