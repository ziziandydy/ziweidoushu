
import { UserProfile } from '../components/AnalysisForm';
import { CalculationResult } from '../types';

export const aiService = {
    async requestAnalysis(userProfile: UserProfile, destinyData: CalculationResult): Promise<{ success: boolean; analysis?: string; error?: string }> {
        try {
            console.log('🤖 Sending AI Analysis Request...');

            const requestData = {
                userProfile: userProfile,
                destinyData: destinyData
            };

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result: { success: boolean, analysis?: string, error?: string } = await response.json();

            if (result.success) {
                return {
                    success: true,
                    analysis: result.analysis
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'AI Analysis Failed'
                };
            }

        } catch (error: any) {
            console.error('AI Analysis Error:', error);
            return {
                success: false,
                error: error.message || 'Network Error'
            };
        }
    }
};
