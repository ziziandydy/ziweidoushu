export interface Star {
    name: string;
    energyLevel: number;
    energyType: string;
}

export interface Palace {
    palaceName: string;
    palaceIndex: number;
    majorStars: Star[];
    minorStars: Star[];
    element?: string;
    sky?: string;
    ground?: string;
}

export interface DestinyInfo {
    element: string;
    destinyMaster: Star;
    bodyMaster: Star;
    palaces: Palace[];
}

export interface CalculationResult {
    success: boolean;
    destinyInfo: DestinyInfo;
    /** Raw /api/calculate payload — sent as-is to /api/analyze and /api/question */
    raw: any;
    error?: string;
}

export type UserProfile = {
    name: string;
    gender: 'M' | 'F';
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: string;
    calendarType: 'solar' | 'lunar';
    isLeapMonth: boolean;
};
