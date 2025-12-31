import * as util from 'util';
declare enum Luckiness {
    LUCK = 1,
    NEUTRAL = 0,
    BAD_LUCK = -1
}
declare class ShadowLight {
    displayName: string;
    constructor(displayName: string);
    toJSON(): string;
    toString(): string;
    static SHADOW: Readonly<ShadowLight>;
    static LIGHT: Readonly<ShadowLight>;
}
declare class Direction {
    direction: number;
    constructor(direction: number);
    add(direction: Direction): Direction;
    static CLOCKWISE: Readonly<Direction>;
    static ANTI_CLOCKWISE: Readonly<Direction>;
}
declare class Element {
    #private;
    code: string;
    displayName: string;
    patternNumber: number;
    constructor(code: string, displayName: string, patternNumber: number);
    toJSON(): string;
    toString(): string;
    [util.inspect.custom](depth: number, opts: any): string;
    static get(code: string): Element;
    static GOLD: Readonly<Element>;
    static WOOD: Readonly<Element>;
    static EARTH: Readonly<Element>;
    static WATER: Readonly<Element>;
    static FIRE: Readonly<Element>;
}
export { Element, Luckiness, ShadowLight, Direction };
