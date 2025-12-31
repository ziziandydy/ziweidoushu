import { Ground } from './ground';
import * as util from 'util';
declare class DayTimeGround {
    index: number;
    displayName: string;
    ground: Ground;
    hourStart: number;
    hourEnd: number;
    constructor(index: number, displayName: string, ground: Ground, hourStart: number, hourEnd: number);
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static get(i: number): DayTimeGround;
    static getByName(name: string): DayTimeGround;
    static getByStartHour(hour: number): DayTimeGround;
    static getByHour(hour: number): DayTimeGround;
    static values(): readonly Readonly<DayTimeGround>[];
}
declare const DAY_TIME_GROUNDS: readonly Readonly<DayTimeGround>[];
export { DayTimeGround, DAY_TIME_GROUNDS };
