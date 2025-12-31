import { Cell } from './cell';
import { DestinyConfig } from './destinyConfig';
import { Ground } from './ground';
import { MajorStar } from './majorStar';
import { MinorStar } from './minorStar';
import { Element, ShadowLight, Direction } from './miscEnums';
import { Sky } from './sky';
import { StarDerivative } from './starDerivative';
import { Temple } from './temple';
import * as util from 'util';
import { Star } from './star';
import type { Calendar } from './../calendar/calender';
declare class DestinyBoard {
    #private;
    config: DestinyConfig;
    element: Element;
    constructor(destinyConfig: DestinyConfig);
    get destinyMaster(): MinorStar | MajorStar;
    get bodyMaster(): MinorStar | MajorStar;
    get startControl(): Ground;
    get destinyTempleCellGround(): Ground;
    get cells(): Cell[];
    get bornStarDerivativeMap(): Map<StarDerivative, MinorStar | MajorStar>;
    getCellByGround(ground: Ground): Cell;
    getCellByTemple(temple: Temple): Cell;
    getCellByStar(star: Star): Cell;
    getTenYearSky(age: number): Sky;
    getTenYearCellGround(age: number): Ground;
    getRuntimContext({ lunarYear, lunarMonth, lunarDay, leap, calendar, }: {
        lunarYear: number;
        lunarMonth: number;
        lunarDay: number;
        leap: boolean;
        calendar?: Calendar;
    }): RuntimeContext;
    get shadowLight(): ShadowLight;
    get configDirection(): Direction;
    getMajorStarEnergyLevel(majorStar: MajorStar): number;
    getMajorStarDerivative(star: MajorStar | MinorStar): Readonly<StarDerivative> | null;
    [util.inspect.custom](depth: number, opts: any): string;
    toJSON(): {
        config: DestinyConfig;
        element: Element;
        destinyMaster: MinorStar | MajorStar | undefined;
        bodyMaster: MinorStar | MajorStar | undefined;
        startControl: Ground | undefined;
        cells: Cell[];
        bornStarDerivativeMap: any;
    };
    toString(): string;
}
export type RuntimeContext = {
    tenYear: {
        cellGround: Ground | null;
        groundStars: Map<Ground, MinorStar[]> | null;
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null;
    };
    year: {
        cellGround: Ground | null;
        groundStars: Map<Ground, MinorStar[]> | null;
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null;
    };
    month: {
        cellGround: Ground | null;
        groundStars: Map<Ground, MinorStar[]> | null;
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null;
    };
    day: {
        cellGround: Ground | null;
        groundStars: Map<Ground, MinorStar[]> | null;
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null;
    };
    yearSky: Sky;
    yearGround: Ground;
    monthSky: Sky;
    monthGround: Ground;
    daySky: Sky;
    dayGround: Ground;
    age: number;
    effectiveMonth: number;
    tenYearGround: Ground;
    tenYearSky: Sky;
};
export { DestinyBoard };
