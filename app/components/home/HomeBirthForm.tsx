'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WarningCircle } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { getAnalysisDict, HOUR_VALUES } from '../../[locale]/analysis/translations';
import { saveBirthInput } from '../../lib/birthHandoff';
import { birthYearOptions } from '../../lib/birthYears';

// 首頁第一屏的排盤表單：欄位與驗證同 analysis 頁，送出後把資料交給 analysis 頁自動排盤
export default function HomeBirthForm({ locale, title, submitLabel }: { locale: string; title: string; submitLabel: string }) {
    const router = useRouter();
    const t = getAnalysisDict(locale);
    // The legend already names the three fields, so the narrow date selects use short placeholders
    const short = locale === 'en' ? { y: 'Year', m: 'Month', d: 'Day' } : { y: '年', m: '月', d: '日' };

    const [name, setName] = useState('');
    const [gender, setGender] = useState<'M' | 'F'>('M');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [birthYear, setBirthYear] = useState(0);
    const [birthMonth, setBirthMonth] = useState(0);
    const [birthDay, setBirthDay] = useState(0);
    const [birthHour, setBirthHour] = useState('');
    const [isLeapMonth, setIsLeapMonth] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Filled after mount so the prerendered HTML never carries a stale year list
    const [years, setYears] = useState<number[]>([]);
    useEffect(() => { setYears(birthYearOptions()); }, []);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [days, setDays] = useState<number[]>([]);

    useEffect(() => {
        if (birthYear && birthMonth) {
            const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
            setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
            if (birthDay > daysInMonth) setBirthDay(0);
        } else {
            setDays([]);
        }
    }, [birthYear, birthMonth, birthDay]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !birthYear || !birthMonth || !birthDay || !birthHour) {
            setError(t.form.missingFields);
            return;
        }
        setError(null);
        setSubmitting(true);
        // If storage is blocked the analysis page simply opens on its empty form
        saveBirthInput({ name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth });
        router.push(`/${locale}/analysis`);
    };

    const choice = (selected: boolean) =>
        `py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600 ${selected
            ? 'bg-brand-600 text-white'
            : 'bg-white text-ink-700 hover:bg-ink-50'}`;

    const missing = (empty: boolean) => (error && empty ? 'field-error' : '');

    return (
        <form onSubmit={handleSubmit} noValidate className="surface border-brand-100 p-6 shadow-soft grid gap-4">
            <h2 className="text-base font-bold text-ink-900">{title}</h2>

            <div className="grid gap-1.5">
                <label htmlFor="home-name" className="text-sm font-medium text-ink-800">{t.form.name.label}</label>
                <input
                    id="home-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.form.name.placeholder}
                    className={`field ${missing(!name)}`}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                    <span className="text-sm font-medium text-ink-800">{t.form.gender.label}</span>
                    <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-ink-300 divide-x divide-ink-300" role="group" aria-label={t.form.gender.label}>
                        <button type="button" aria-pressed={gender === 'M'} onClick={() => setGender('M')} className={choice(gender === 'M')}>{t.form.gender.male}</button>
                        <button type="button" aria-pressed={gender === 'F'} onClick={() => setGender('F')} className={choice(gender === 'F')}>{t.form.gender.female}</button>
                    </div>
                </div>
                <div className="grid gap-1.5">
                    <span className="text-sm font-medium text-ink-800">{t.form.calendarType.label}</span>
                    <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-ink-300 divide-x divide-ink-300" role="group" aria-label={t.form.calendarType.label}>
                        <button type="button" aria-pressed={calendarType === 'solar'} onClick={() => setCalendarType('solar')} className={choice(calendarType === 'solar')}>{t.form.calendarType.solar}</button>
                        <button type="button" aria-pressed={calendarType === 'lunar'} onClick={() => setCalendarType('lunar')} className={choice(calendarType === 'lunar')}>{t.form.calendarType.lunar}</button>
                    </div>
                </div>
            </div>

            <fieldset className="grid gap-1.5">
                <legend className="text-sm font-medium text-ink-800 mb-1.5">{t.form.birthYear.label} / {t.form.birthMonth.label} / {t.form.birthDay.label}</legend>
                <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2">
                    <select id="home-year" aria-label={t.form.birthYear.label} value={birthYear || ''} onChange={(e) => setBirthYear(Number(e.target.value))} className={`field px-2 ${missing(!birthYear)}`}>
                        <option value="">{short.y}</option>
                        {years.map(y => <option key={y} value={y}>{y}{t.form.birthYear.suffix}</option>)}
                    </select>
                    <select id="home-month" aria-label={t.form.birthMonth.label} value={birthMonth || ''} onChange={(e) => setBirthMonth(Number(e.target.value))} className={`field px-2 ${missing(!birthMonth)}`}>
                        <option value="">{short.m}</option>
                        {months.map(m => <option key={m} value={m}>{m}{t.form.birthMonth.suffix}</option>)}
                    </select>
                    <select id="home-day" aria-label={t.form.birthDay.label} value={birthDay || ''} onChange={(e) => setBirthDay(Number(e.target.value))} className={`field px-2 ${missing(!birthDay)}`}>
                        <option value="">{short.d}</option>
                        {days.map(d => <option key={d} value={d}>{d}{t.form.birthDay.suffix}</option>)}
                    </select>
                </div>
            </fieldset>

            <div className="grid gap-1.5">
                <label htmlFor="home-hour" className="text-sm font-medium text-ink-800">{t.form.birthHour.label}</label>
                <select id="home-hour" value={birthHour} onChange={(e) => setBirthHour(e.target.value)} className={`field ${missing(!birthHour)}`}>
                    <option value="">{t.form.birthHour.placeholder}</option>
                    {HOUR_VALUES.map(h => <option key={h} value={h}>{t.form.hourOptions[h] || h}</option>)}
                </select>
            </div>

            {calendarType === 'lunar' && (
                <label className="flex items-center gap-2 text-sm text-ink-600">
                    <input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} className="rounded accent-brand-600" />
                    {t.form.leapMonth}
                </label>
            )}

            {error && (
                <p role="alert" className="error-text">
                    <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
                {submitLabel}
            </button>
        </form>
    );
}
