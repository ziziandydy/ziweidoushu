import { DestinyBoard } from './destinyBoard';
import { Ground } from './ground';
import { Luckiness } from './miscEnums';
import { Sky } from './sky';
import * as util from 'util';
import { Star } from './star';
declare class MinorStar implements Star {
    key: string;
    displayName: string;
    luck: Luckiness;
    constructor(key: string, displayName: string, luck: Luckiness);
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static MINOR_STAR_EARN: Readonly<MinorStar>;
    static MINOR_STAR_BENEFACTOR_MAN: Readonly<MinorStar>;
    static MINOR_STAR_BENEFACTOR_WOMAN: Readonly<MinorStar>;
    static MINOR_STAR_CLEVER: Readonly<MinorStar>;
    static MINOR_STAR_SKILL: Readonly<MinorStar>;
    static MINOR_STAR_SUPPORT_LEFT: Readonly<MinorStar>;
    static MINOR_STAR_SUPPORT_RIGHT: Readonly<MinorStar>;
    static MINOR_STAR_VOID_GROUND: Readonly<MinorStar>;
    static MINOR_STAR_LOST: Readonly<MinorStar>;
    static MINOR_STAR_BURNING: Readonly<MinorStar>;
    static MINOR_STAR_HIDDEN_FIRE: Readonly<MinorStar>;
    static MINOR_STAR_COMPETITION: Readonly<MinorStar>;
    static MINOR_STAR_HINDRANCE: Readonly<MinorStar>;
    static MINOR_STAR_PEGASUS: Readonly<MinorStar>;
    static stars: readonly Readonly<MinorStar>[];
    static minorStarPlacers: Readonly<Map<MinorStar, MinorStarPlacer>>;
    getType(): string;
    getKey(): string;
    getDisplayName(): string;
    static getByKey(key: string): MinorStar | null;
    static getByName(name: string): Readonly<MinorStar> | null;
    equals(star: Star): any;
}
declare interface MinorStarPlacer {
    evalGround: (destinyBoard: DestinyBoard) => Ground;
    hasRuntime: () => boolean;
    evalRuntimeGround: (sky: Sky) => Ground;
}
export { MinorStar };
