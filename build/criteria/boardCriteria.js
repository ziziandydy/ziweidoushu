"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellsScope = exports.BoardCriteria = void 0;
const majorStar_1 = require("../model/majorStar");
const miniStar_1 = require("../model/miniStar");
const minorStar_1 = require("../model/minorStar");
const starDerivative_1 = require("../model/starDerivative");
const temple_1 = require("../model/temple");
const utils_1 = require("../utils");
var CellsScope;
(function (CellsScope) {
    CellsScope["SELF"] = "SELF";
    CellsScope["OPPOSITE"] = "OPPOSITE";
    CellsScope["SELF_OPPOSITE"] = "OPPOSITE";
    CellsScope["SUPPORT"] = "SUPPORT";
    CellsScope["TRIANGLE"] = "TRIANGLE";
    CellsScope["FOUR"] = "FOUR";
})(CellsScope || (exports.CellsScope = CellsScope = {}));
class BoardCriteria {
    #destinyBoard;
    #baseCellGround;
    #cellsScope;
    constructor(destinyBoard, baseCellGround, cellsScope = CellsScope.SELF) {
        this.#destinyBoard = destinyBoard;
        this.#baseCellGround = baseCellGround ?? destinyBoard.destinyTempleCellGround;
        this.#cellsScope = cellsScope;
    }
    ofDestinyTemple() {
        return new BoardCriteria(this.#destinyBoard, this.#destinyBoard.destinyTempleCellGround, this.#cellsScope);
    }
    ofTemple(temple) {
        return new BoardCriteria(this.#destinyBoard, this.#destinyBoard.getCellByTemple(temple).ground, this.#cellsScope);
    }
    ofGroundCell(ground) {
        return new BoardCriteria(this.#destinyBoard, ground, this.#cellsScope);
    }
    ofCell(cell) {
        return new BoardCriteria(this.#destinyBoard, cell.ground, this.#cellsScope);
    }
    ofStar(star) {
        const targetCell = this.#destinyBoard.cells.find((cell) => {
            return cell.hasStarInstance(star);
        });
        if (!targetCell) {
            throw new Error('Star not found');
        }
        return new BoardCriteria(this.#destinyBoard, targetCell.ground, this.#cellsScope);
    }
    withCellsType(cellsScope) {
        return new BoardCriteria(this.#destinyBoard, this.#baseCellGround, cellsScope);
    }
    get #__internal_baseCell() {
        return this.#destinyBoard.getCellByGround(this.#baseCellGround);
    }
    static allStarsNameToKeyMap = [...majorStar_1.MajorStar.stars, ...minorStar_1.MinorStar.stars, ...miniStar_1.MiniStar.allStars].reduce((prev, curr) => {
        if (!prev[curr.getDisplayName()]) {
            prev[curr.getDisplayName()] = curr.getKey();
        }
        return prev;
    }, {});
    hasStar(star) {
        return BoardCriteria.#hasStar(this.#scopedCells, star);
    }
    hasAllStars(stars) {
        return BoardCriteria.#hasAllStars(this.#scopedCells, stars);
    }
    hasAnyStars(stars) {
        return BoardCriteria.#hasAnyStars(this.#scopedCells, stars);
    }
    notFoundStar(star) {
        return BoardCriteria.#notFoundStar(this.#scopedCells, star);
    }
    notFoundAllStars(stars) {
        return BoardCriteria.#notFoundAllStars(this.#scopedCells, stars);
    }
    notFoundAnyStars(stars) {
        return BoardCriteria.#notFoundAnyStars(this.#scopedCells, stars);
    }
    get #scopedCells() {
        switch (this.#cellsScope) {
            case CellsScope.SELF:
                return this.#__internal_baseCell.selfWithBorrow;
            case CellsScope.OPPOSITE:
                return this.#__internal_baseCell.oppositeCellWithBorrow;
            case CellsScope.SELF_OPPOSITE:
                return this.#__internal_baseCell.selfOppositeCellsWithBorrow;
            case CellsScope.SUPPORT:
                return this.#__internal_baseCell.supportCellsWithBorrow;
            case CellsScope.TRIANGLE:
                return this.#__internal_baseCell.triangleCellsWithBorrow;
            case CellsScope.FOUR:
                return this.#__internal_baseCell.fourCellsWithBorrow;
            default:
                throw new Error('unknown cells type');
        }
    }
    static #hasStar(cells, star) {
        return !!cells.find((cell) => cell.hasStar(star));
    }
    static #hasAllStars(cells, stars) {
        for (const star of stars) {
            if (!cells.find((cell) => cell.hasStar(star))) {
                return false;
            }
        }
        return true;
    }
    static #hasAnyStars(cells, stars) {
        for (const star of stars) {
            if (cells.find((cell) => cell.hasStar(star))) {
                return true;
            }
        }
        return false;
    }
    static #notFoundStar(cells, star) {
        return !BoardCriteria.#hasStar(cells, star);
    }
    static #notFoundAllStars(cells, stars) {
        return !BoardCriteria.#hasAnyStars(cells, stars);
    }
    static #notFoundAnyStars(cells, stars) {
        return !BoardCriteria.#hasAllStars(cells, stars);
    }
    static fromDescription(destinyBoard, description) {
        let cell = null;
        let cellsScope = null;
        let stars = [];
        const starDerivatives = [];
        let isBothEarn = false;
        if ((!cellsScope && description.includes('入命')) || description.includes('在命')) {
            cell = destinyBoard.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
            cellsScope = CellsScope.SELF;
        }
        if (!cellsScope && description.includes('三方四正')) {
            cellsScope = CellsScope.FOUR;
        }
        const templeChar = (0, utils_1.str2Uni)('宮');
        {
            const matches = description.match(new RegExp(`.*?(.{1,2}${templeChar})`, 'u'));
            if (matches && matches[1]) {
                const targetTemple = temple_1.Temple.TEMPLES.find((temple) => matches[1].includes(temple.getDisplayName()));
                if (targetTemple) {
                    cell = destinyBoard.getCellByTemple(targetTemple);
                    // 入XX宮
                    if (description.match(new RegExp(`${(0, utils_1.str2Uni)('入')}(.{1,2})${templeChar}`, 'u'))) {
                        cellsScope = CellsScope.SELF;
                    }
                    // 在XX宮
                    if (description.match(new RegExp(`${(0, utils_1.str2Uni)('在')}(.{1,2})${templeChar}`, 'u'))) {
                        cellsScope = CellsScope.SELF;
                    }
                }
            }
        }
        if (!cellsScope && description.includes('在')) {
            cellsScope = CellsScope.SELF;
        }
        if (!cellsScope && description.includes('有')) {
            cellsScope = CellsScope.SELF;
        }
        if (!cellsScope && description.includes('見')) {
            cellsScope = CellsScope.FOUR;
        }
        if (!cellsScope && description.includes('會')) {
            cellsScope = CellsScope.FOUR;
        }
        stars = Object.keys(BoardCriteria.allStarsNameToKeyMap)
            .filter((starName) => description.includes(starName))
            .map((starName) => {
            const key = BoardCriteria.allStarsNameToKeyMap[starName];
            return majorStar_1.MajorStar.getByKey(key) ?? minorStar_1.MinorStar.getByKey(key) ?? miniStar_1.MiniStar.getByKey(key);
        })
            .filter((star) => star);
        if (description.includes('火')) {
            stars.push(minorStar_1.MinorStar.MINOR_STAR_BURNING);
        }
        if (description.includes('鈴')) {
            stars.push(minorStar_1.MinorStar.MINOR_STAR_HIDDEN_FIRE);
        }
        if (description.includes('羊')) {
            stars.push(minorStar_1.MinorStar.MINOR_STAR_COMPETITION);
        }
        if (description.includes('陀')) {
            stars.push(minorStar_1.MinorStar.MINOR_STAR_HINDRANCE);
        }
        {
            const matches = description.match(new RegExp(`${(0, utils_1.str2Uni)('見')}${(0, utils_1.str2Uni)('祿')}(${(0, utils_1.str2Uni)('存')})?`, 'u'));
            if (matches) {
                cellsScope = CellsScope.FOUR;
                if (!matches[1]) {
                    isBothEarn = true;
                }
            }
        }
        if (description.includes('化祿')) {
            starDerivatives.push(starDerivative_1.StarDerivative.WEALTHINESS);
        }
        if (description.includes('科')) {
            starDerivatives.push(starDerivative_1.StarDerivative.FAME);
        }
        if (description.includes('忌')) {
            starDerivatives.push(starDerivative_1.StarDerivative.PROBLEM);
        }
        if (!cell) {
            cell = destinyBoard.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
        }
        if (!cellsScope) {
            cellsScope = CellsScope.SELF;
        }
        const starDerivativeStars = starDerivatives.map((starDerivative) => destinyBoard.bornStarDerivativeMap.get(starDerivative));
        const criteria = new BoardCriteria(destinyBoard).ofCell(cell).withCellsType(cellsScope);
        if (isBothEarn) {
            stars = stars.filter((star) => !star.equals(minorStar_1.MinorStar.MINOR_STAR_EARN));
            return (criteria.hasAllStars(stars) &&
                criteria.hasAnyStars([minorStar_1.MinorStar.MINOR_STAR_EARN, destinyBoard.bornStarDerivativeMap.get(starDerivative_1.StarDerivative.WEALTHINESS)]));
        }
        else {
            return criteria.hasAllStars([...stars, ...starDerivativeStars]);
        }
    }
}
exports.BoardCriteria = BoardCriteria;
//# sourceMappingURL=boardCriteria.js.map