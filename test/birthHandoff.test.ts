import { saveBirthInput, takeBirthInput, BIRTH_INPUT_KEY } from '../app/lib/birthHandoff';
import type { UserProfile } from '../app/[locale]/analysis/types';

function memoryStorage(): Storage {
    const data = new Map<string, string>();
    return {
        get length() { return data.size; },
        clear: () => data.clear(),
        getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
        key: (i: number) => Array.from(data.keys())[i] ?? null,
        removeItem: (k: string) => { data.delete(k); },
        setItem: (k: string, v: string) => { data.set(k, String(v)); },
    };
}

function throwingStorage(): Storage {
    const fail = () => { throw new Error('storage blocked'); };
    return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail };
}

const profile: UserProfile = {
    name: '王小明',
    gender: 'M',
    birthYear: 1990,
    birthMonth: 6,
    birthDay: 15,
    birthHour: '子時',
    calendarType: 'solar',
    isLeapMonth: false,
};

describe('birth input handoff', () => {
    it('returns the saved profile', () => {
        const s = memoryStorage();
        expect(saveBirthInput(profile, s)).toBe(true);
        expect(takeBirthInput(s)).toEqual(profile);
    });

    it('removes the profile once taken, so a reload does not recalculate', () => {
        const s = memoryStorage();
        saveBirthInput(profile, s);
        takeBirthInput(s);
        expect(takeBirthInput(s)).toBeNull();
        expect(s.getItem(BIRTH_INPUT_KEY)).toBeNull();
    });

    it('returns null for malformed JSON without throwing', () => {
        const s = memoryStorage();
        s.setItem(BIRTH_INPUT_KEY, '{not json');
        expect(takeBirthInput(s)).toBeNull();
    });

    it('returns null when required fields are missing or have the wrong type', () => {
        const s = memoryStorage();
        s.setItem(BIRTH_INPUT_KEY, JSON.stringify({ ...profile, name: '' }));
        expect(takeBirthInput(s)).toBeNull();
        s.setItem(BIRTH_INPUT_KEY, JSON.stringify({ ...profile, birthYear: '1990' }));
        expect(takeBirthInput(s)).toBeNull();
        s.setItem(BIRTH_INPUT_KEY, JSON.stringify({ ...profile, gender: 'X' }));
        expect(takeBirthInput(s)).toBeNull();
    });

    it('reports failure instead of throwing when storage is blocked', () => {
        const s = throwingStorage();
        expect(saveBirthInput(profile, s)).toBe(false);
        expect(takeBirthInput(s)).toBeNull();
    });

    it('does nothing when no storage is available (server render)', () => {
        expect(saveBirthInput(profile)).toBe(false);
        expect(takeBirthInput()).toBeNull();
    });
});
