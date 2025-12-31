import { DestinyBoard } from './destinyBoard';
import { Ground } from './ground';
import { Star } from './star';
import * as util from 'util';
/**
 * 主星
 */
declare class MajorStar implements Star {
    key: string;
    displayName: string;
    constructor(key: string, displayName: string);
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static MAJOR_STAR_EMPEROR: Readonly<MajorStar>;
    static MAJOR_STAR_CHANGE: Readonly<MajorStar>;
    static MAJOR_STAR_SUN: Readonly<MajorStar>;
    static MAJOR_STAR_GOLD: Readonly<MajorStar>;
    static MAJOR_STAR_ENJOYMENT: Readonly<MajorStar>;
    static MAJOR_STAR_FIRE: Readonly<MajorStar>;
    static MAJOR_STAR_TREASURY: Readonly<MajorStar>;
    static MAJOR_STAR_MOON: Readonly<MajorStar>;
    static MAJOR_STAR_GREED: Readonly<MajorStar>;
    static MAJOR_STAR_ARGUMENT: Readonly<MajorStar>;
    static MAJOR_STAR_SUPPORT: Readonly<MajorStar>;
    static MAJOR_STAR_RULE: Readonly<MajorStar>;
    static MAJOR_STAR_GENERAL: Readonly<MajorStar>;
    static MAJOR_STAR_PIONEER: Readonly<MajorStar>;
    static stars: readonly Readonly<MajorStar>[];
    static majorStarPlacers: Readonly<Map<MajorStar, MajorStarPlacer>>;
    getType(): string;
    getKey(): string;
    getDisplayName(): string;
    static getByKey(key: string): MajorStar | null;
    static getByName(name: string): Readonly<MajorStar> | null;
    equals(star: Star): boolean;
}
declare interface MajorStarPlacer {
    evalGround: (destinyBoard: DestinyBoard) => Ground;
    evalEnergyLevel: (ground: Ground) => number;
}
export { MajorStar };
