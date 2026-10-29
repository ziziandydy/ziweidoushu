"use client";

import React, { useEffect, useRef, useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { CalculationResult, UserProfile } from '../types';
import { AnalysisDict, HOUR_VALUES } from '../translations';
import { calculateDestiny } from '../services/calculateService';

interface AnalysisFormProps {
    locale: string;
    t: AnalysisDict;
    onCalculated: (profile: UserProfile, result: CalculationResult) => void;
    /** Birth data handed over from the homepage form; prefills the fields. */
    initialProfile?: UserProfile | null;
    /** Submit once on mount, the same way a click on the button would. */
    autoSubmit?: boolean;
}

export default function AnalysisForm({ locale, t, onCalculated, initialProfile, autoSubmit }: AnalysisFormProps) {
    const [name, setName] = useState(initialProfile?.name ?? '');
    const [gender, setGender] = useState<'M' | 'F'>(initialProfile?.gender ?? 'M');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(initialProfile?.calendarType ?? 'solar');
    const [birthYear, setBirthYear] = useState<number>(initialProfile?.birthYear ?? 0);
    const [birthMonth, setBirthMonth] = useState<number>(initialProfile?.birthMonth ?? 0);
    const [birthDay, setBirthDay] = useState<number>(initialProfile?.birthDay ?? 0);
    const [birthHour, setBirthHour] = useState<string>(initialProfile?.birthHour ?? '');
    const [isLeapMonth, setIsLeapMonth] = useState(initialProfile?.isLeapMonth ?? false);
    const autoSubmitted = useRef(false);
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

    // Homepage handoff: submit once with the prefilled data (ref guards against the dev double effect)
    useEffect(() => {
        if (!autoSubmit || !initialProfile || autoSubmitted.current) return;
        autoSubmitted.current = true;
        handleSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const choice = (selected: boolean) =>
        `flex-1 py-3 rounded-lg border transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${selected
            ? 'bg-brand-600 text-white border-brand-600'
            : 'bg-white text-ink-700 border-ink-300 hover:bg-ink-50'}`;

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">
                {t.form.title}
            </h2>

            {/* Name & Gender */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="birth-name" className="block mb-2 font-medium text-ink-800">{t.form.name.label}</label>
                    <input
                        id="birth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`field py-3 ${error && !name ? 'field-error' : ''}`}
                        placeholder={t.form.name.placeholder}
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-ink-800">{t.form.gender.label}</label>
                    <div className="flex space-x-2">
                        <button type="button" onClick={() => setGender('M')} className={choice(gender === 'M')}>
                            {t.form.gender.male}
                        </button>
                        <button type="button" onClick={() => setGender('F')} className={choice(gender === 'F')}>
                            {t.form.gender.female}
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Type */}
            <div>
                <label className="block mb-2 font-medium text-ink-800">{t.form.calendarType.label}</label>
                <div className="flex space-x-2">
                    <button type="button" onClick={() => setCalendarType('solar')} className={choice(calendarType === 'solar')}>
                        {t.form.calendarType.solar}
                    </button>
                    <button type="button" onClick={() => setCalendarType('lunar')} className={choice(calendarType === 'lunar')}>
                        {t.form.calendarType.lunar}
                    </button>
                </div>
            </div>

            {/* Date */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="birth-year" className="block mb-2 font-medium text-ink-800">{t.form.birthYear.label}</label>
                    <select
                        id="birth-year"
                        value={birthYear || ''}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        className={`field py-3 ${error && !birthYear ? 'field-error' : ''}`}
                    >
                        <option value="">{t.form.birthYear.placeholder}</option>
                        {years.map(y => <option key={y} value={y}>{y}{t.form.birthYear.suffix}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="birth-month" className="block mb-2 font-medium text-ink-800">{t.form.birthMonth.label}</label>
                    <select
                        id="birth-month"
                        value={birthMonth || ''}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        className={`field py-3 ${error && !birthMonth ? 'field-error' : ''}`}
                    >
                        <option value="">{t.form.birthMonth.placeholder}</option>
                        {months.map(m => <option key={m} value={m}>{m}{t.form.birthMonth.suffix}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="birth-day" className="block mb-2 font-medium text-ink-800">{t.form.birthDay.label}</label>
                    <select
                        id="birth-day"
                        value={birthDay || ''}
                        onChange={(e) => setBirthDay(Number(e.target.value))}
                        className={`field py-3 ${error && !birthDay ? 'field-error' : ''}`}
                    >
                        <option value="">{t.form.birthDay.placeholder}</option>
                        {days.map(d => <option key={d} value={d}>{d}{t.form.birthDay.suffix}</option>)}
                    </select>
                </div>
            </div>

            {/* Hour */}
            <div>
                <label htmlFor="birth-hour" className="block mb-2 font-medium text-ink-800">{t.form.birthHour.label}</label>
                <select
                    id="birth-hour"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className={`field py-3 ${error && !birthHour ? 'field-error' : ''}`}
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
                        className="rounded accent-brand-600"
                    />
                    <label htmlFor="leap-month" className="text-sm text-ink-600">{t.form.leapMonth}</label>
                </div>
            )}

            {error && (
                <div role="alert" className="error-text rounded-lg border border-danger/30 bg-white p-3">
                    <WarningCircle size={20} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {/* Submit */}
            <div className="mt-8">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={calculating}
                    className="btn-primary w-full py-4 text-lg"
                >
                    {calculating ? t.form.calculating : t.form.calculate}
                </button>
            </div>
        </div>
    );
}
