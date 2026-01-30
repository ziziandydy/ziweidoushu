
export interface Star {
    name: string;
    energyLevel: number;
    energyType: 'yang' | 'yin';
}

export interface Palace {
    palaceName: string;
    palaceIndex: number;
    majorStars: Star[];
    minorStars: Star[];
    elementEnergy: string;
}

export interface DestinyInfo {
    element: string;
    destinyMaster: Star;
    bodyMaster: Star;
    palaces: Palace[];
}

export interface CalculationResult {
    userInfo: any;
    calendarInfo: any;
    destinyInfo: DestinyInfo;
    success: boolean;
}
