import * as util from 'util';
declare class LifeStage {
    displayName: string;
    constructor(displayName: string);
    toJSON(): string;
    toString(): string;
    static getByName(name: string): Readonly<LifeStage> | undefined;
    [util.inspect.custom](depth: number, opts: any): string;
    static values: readonly Readonly<LifeStage>[];
}
export { LifeStage };
