import { birthYearOptions } from '../app/lib/birthYears';

describe('birth year options', () => {
    it('lists 100 years, newest first, ending at the current year minus 99', () => {
        const years = birthYearOptions(new Date(2026, 5, 1));
        expect(years).toHaveLength(100);
        expect(years[0]).toBe(2026);
        expect(years[99]).toBe(1927);
    });

    it('rolls over on New Year', () => {
        expect(birthYearOptions(new Date(2026, 11, 31))[0]).toBe(2026);
        expect(birthYearOptions(new Date(2027, 0, 1))[0]).toBe(2027);
    });
});
