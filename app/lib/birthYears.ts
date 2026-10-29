// Selectable birth years, newest first. Pages are prerendered, so a form must call this after mount:
// computing it during render bakes the build year into the HTML and mismatches on hydration after New Year.
export function birthYearOptions(now: Date = new Date(), count = 100): number[] {
    const thisYear = now.getFullYear();
    return Array.from({ length: count }, (_, i) => thisYear - i);
}
