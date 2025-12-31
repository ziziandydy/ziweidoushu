import * as util from 'util';
declare class Sky {
    index: number;
    displayName: string;
    constructor(index: number, displayName: string);
    shift(i: number): Sky;
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static get(i: number): Sky;
    static getByName(name: string): Sky;
    static SKYS: readonly Readonly<Sky>[];
    static values(): readonly Readonly<Sky>[];
    equals(sky: Sky): boolean;
}
export { Sky };
