import { CalculationResult, DestinyInfo, Palace, Star, UserProfile } from '../types';

const FALLBACK_DESTINY_MASTER: Star = { name: '紫微', energyLevel: 0, energyType: 'yang' };
const FALLBACK_BODY_MASTER: Star = { name: '天府', energyLevel: 0, energyType: 'yang' };

function findFirstMajorStar(palaces: Palace[], palaceName: string, fallback: Star): Star {
    const palace = palaces.find(p => p.palaceName === palaceName);
    return palace?.majorStars[0] || fallback;
}

export async function calculateDestiny(
    profile: UserProfile,
    locale: string
): Promise<CalculationResult> {
    try {
        const response = await fetch(`/api/calculate?locale=${encodeURIComponent(locale)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });

        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.palaces)) {
            return {
                success: false,
                destinyInfo: null as unknown as DestinyInfo,
                raw: null,
                error: result?.error?.message || result?.error || `HTTP ${response.status}`,
            };
        }

        const palaces: Palace[] = result.palaces;

        const destinyInfo: DestinyInfo = {
            element: result.element || '',
            destinyMaster: findFirstMajorStar(palaces, '命宮', FALLBACK_DESTINY_MASTER),
            bodyMaster: findFirstMajorStar(palaces, '財帛宮', FALLBACK_BODY_MASTER),
            palaces,
        };

        return { success: true, destinyInfo, raw: result };
    } catch (error: any) {
        return {
            success: false,
            destinyInfo: null as unknown as DestinyInfo,
            raw: null,
            error: error?.message || 'Network Error',
        };
    }
}
