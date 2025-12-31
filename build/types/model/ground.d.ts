import * as util from 'util';
declare class Ground {
    index: number;
    displayName: string;
    constructor(index: number, displayName: string);
    shift(i: number): Ground;
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static get(i: number): Ground;
    static getByName(name: string): Ground;
    static GROUNDS: readonly Readonly<Ground>[];
    static values(): readonly Readonly<Ground>[];
    equals(ground: Ground): boolean;
}
export { Ground };
