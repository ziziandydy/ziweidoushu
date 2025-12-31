import { Cell } from '../model/cell';
import { DestinyBoard } from '../model/destinyBoard';
import { Ground } from '../model/ground';
import { Star } from '../model/star';
import { Temple } from '../model/temple';
declare enum CellsScope {
    SELF = "SELF",
    OPPOSITE = "OPPOSITE",
    SELF_OPPOSITE = "OPPOSITE",
    SUPPORT = "SUPPORT",
    TRIANGLE = "TRIANGLE",
    FOUR = "FOUR"
}
declare class BoardCriteria {
    #private;
    constructor(destinyBoard: DestinyBoard, baseCellGround?: Ground, cellsScope?: CellsScope);
    ofDestinyTemple(): BoardCriteria;
    ofTemple(temple: Temple): BoardCriteria;
    ofGroundCell(ground: Ground): BoardCriteria;
    ofCell(cell: Cell): BoardCriteria;
    ofStar(star: Star): BoardCriteria;
    withCellsType(cellsScope: CellsScope): BoardCriteria;
    static allStarsNameToKeyMap: Map<string, string>;
    hasStar(star: Star): boolean;
    hasAllStars(stars: Star[]): boolean;
    hasAnyStars(stars: Star[]): boolean;
    notFoundStar(star: Star): boolean;
    notFoundAllStars(stars: Star[]): boolean;
    notFoundAnyStars(stars: Star[]): boolean;
    static fromDescription(destinyBoard: DestinyBoard, description: string): boolean;
}
export { BoardCriteria, CellsScope };
