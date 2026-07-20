"use client";

import React, { useEffect, useState } from 'react';
import { CalculationResult, UserProfile } from '../types';
import { AnalysisDict } from '../translations';
import { calculateDestiny } from '../services/calculateService';

interface AnalysisFormProps {
    locale: string;
    t: AnalysisDict;
    onCalculated: (profile: UserProfile, result: CalculationResult) => void;
}

const HOUR_VALUES = [
    '子時', '丑時', '寅時', '卯時', '辰時', '巳時',
    '午時', '未時', '申時', '酉時', '戌時', '亥時',
];

export default function AnalysisForm({ locale, t, onCalculated }: AnalysisFormProps) {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'M' | 'F'>('M');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [birthYear, setBirthYear] = useState<number>(0);
    const [birthMonth, setBirthMonth] = useState<number>(0);
    const [birthDay, setBirthDay] = useState<number>(0);
    const [birthHour, setBirthHour] = useState<string>('');
    const [isLeapMonth, setIsLeapMonth] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [days, setDays] = useState<number[]>([]);

    useEffect(() => {
        if (birthYear && birthMonth) {
            const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
            setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        } else {
            setDays([]);
        }
    }, [birthYear, birthMonth]);

    const handleSubmit = async () => {
        if (!name || !birthYear || !birthMonth || !birthDay || !birthHour) {
            setError(t.form.missingFields);
            return;
        }

        const profile: UserProfile = {
            name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth,
        };

        setError(null);
        setCalculating(true);
        try {
            const result = await calculateDestiny(profile, locale);
            if (result.success) {
                onCalculated(profile, result);
            } else {
                setError(`${t.form.calculationFailed}${result.error ? `（${result.error}）` : ''}`);
            }
        } finally {
            setCalculating(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-2 text-blue-500">📝</span>
                {t.form.title}
            </h2>

            {/* Name & Gender */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-medium">{t.form.name.label}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t.form.name.placeholder}
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">{t.form.gender.label}</label>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setGender('M')}
                            className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${gender === 'M' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {t.form.gender.male}
                        </button>
                        <button
                            onClick={() => setGender('F')}
                            className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${gender === 'F' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {t.form.gender.female}
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Type */}
            <div>
                <label className="block mb-2 font-medium">{t.form.calendarType.label}</label>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCalendarType('solar')}
                        className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${calendarType === 'solar' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        {t.form.calendarType.solar}
                    </button>
                    <button
                        onClick={() => setCalendarType('lunar')}
                        className={`flex-1 py-3 rounded-lg border transition-colors font-medium ${calendarType === 'lunar' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        {t.form.calendarType.lunar}
                    </button>
                </div>
            </div>

            {/* Date */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 font-medium">{t.form.birthYear.label}</label>
                    <select
                        value={birthYear || ''}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t.form.birthYear.placeholder}</option>
                        {years.map(y => <option key={y} value={y}>{y}{t.form.birthYear.suffix}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">{t.form.birthMonth.label}</label>
                    <select
                        value={birthMonth || ''}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t.form.birthMonth.placeholder}</option>
                        {months.map(m => <option key={m} value={m}>{m}{t.form.birthMonth.suffix}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">{t.form.birthDay.label}</label>
                    <select
                        value={birthDay || ''}
                        onChange={(e) => setBirthDay(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t.form.birthDay.placeholder}</option>
                        {days.map(d => <option key={d} value={d}>{d}{t.form.birthDay.suffix}</option>)}
                    </select>
                </div>
            </div>

            {/* Hour */}
            <div>
                <label className="block mb-2 font-medium">{t.form.birthHour.label}</label>
                <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t.form.birthHour.placeholder}</option>
                    {HOUR_VALUES.map(h => <option key={h} value={h}>{t.form.hourOptions[h] || h}</option>)}
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
                    <label htmlFor="leap-month" className="text-sm text-gray-600">{t.form.leapMonth}</label>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {error}
                </div>
            )}

            {/* Submit */}
            <div className="mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={calculating}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span className="mr-2">⭐</span>
                    {calculating ? t.form.calculating : t.form.calculate}
                </button>
            </div>
        </div>
    );
}
