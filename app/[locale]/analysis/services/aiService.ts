import { UserProfile } from '../types';

export async function requestAnalysis(
    userProfile: UserProfile,
    destinyData: any,
    locale: string
): Promise<{ success: boolean; analysis?: string; error?: string }> {
    try {
        const response = await fetch(`/api/analyze?locale=${encodeURIComponent(locale)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userProfile, destinyData }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result: { success: boolean; analysis?: string; error?: string } = await response.json();

        if (result.success) {
            return { success: true, analysis: result.analysis };
        }
        return { success: false, error: result.error || 'AI Analysis Failed' };
    } catch (error: any) {
        console.error('AI Analysis Error:', error);
        return { success: false, error: error.message || 'Network Error' };
    }
}
