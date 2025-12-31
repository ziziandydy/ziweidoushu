import * as util from 'util';
import { MajorStar } from './majorStar';
import { MinorStar } from './minorStar';
import { Sky } from './sky';
declare class StarDerivative {
    key: string;
    displayName: string;
    constructor(key: string, displayName: string);
    toJSON(): string;
    toString(): string;
    euqals(starDerivative: StarDerivative): boolean;
    [util.inspect.custom](depth: number, opts: any): string;
    static WEALTHINESS: Readonly<StarDerivative>;
    static POWER: Readonly<StarDerivative>;
    static FAME: Readonly<StarDerivative>;
    static PROBLEM: Readonly<StarDerivative>;
    static getWealthinessStar(sky: Sky): Readonly<MajorStar>;
    static getPowerStar(sky: Sky): Readonly<MajorStar>;
    static getFameStar(sky: Sky): Readonly<MajorStar | MinorStar>;
    static getProblemStar(sky: Sky): Readonly<MajorStar | MinorStar>;
}
export { StarDerivative };
