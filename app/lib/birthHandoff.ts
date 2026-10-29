import type { UserProfile } from '../[locale]/analysis/types';

// 首頁表單把出生資料交給 analysis 頁：放在分頁暫存而非網址，避免生日與姓名進入 GA 報表與伺服器記錄
export const BIRTH_INPUT_KEY = 'aiziwei:birth-input';

function defaultStorage(): Storage | undefined {
    if (typeof window === 'undefined') return undefined;
    try {
        return window.sessionStorage;
    } catch {
        return undefined;
    }
}

function isUserProfile(v: unknown): v is UserProfile {
    if (!v || typeof v !== 'object') return false;
    const p = v as Record<string, unknown>;
    return typeof p.name === 'string' && p.name.trim() !== ''
        && (p.gender === 'M' || p.gender === 'F')
        && typeof p.birthYear === 'number' && p.birthYear > 0
        && typeof p.birthMonth === 'number' && p.birthMonth > 0
        && typeof p.birthDay === 'number' && p.birthDay > 0
        && typeof p.birthHour === 'string' && p.birthHour !== ''
        && (p.calendarType === 'solar' || p.calendarType === 'lunar')
        && typeof p.isLeapMonth === 'boolean';
}

export function saveBirthInput(profile: UserProfile, storage: Storage | undefined = defaultStorage()): boolean {
    if (!storage) return false;
    try {
        storage.setItem(BIRTH_INPUT_KEY, JSON.stringify(profile));
        return true;
    } catch {
        return false;
    }
}

// Read once: the entry is removed so a reload of the analysis page does not recalculate.
export function takeBirthInput(storage: Storage | undefined = defaultStorage()): UserProfile | null {
    if (!storage) return null;
    try {
        const raw = storage.getItem(BIRTH_INPUT_KEY);
        if (raw === null) return null;
        storage.removeItem(BIRTH_INPUT_KEY);
        const parsed: unknown = JSON.parse(raw);
        return isUserProfile(parsed) ? parsed : null;
    } catch {
        return null;
    }
}
