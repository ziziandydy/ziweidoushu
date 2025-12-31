"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowCell = exports.Cell = void 0;
const majorStar_1 = require("./majorStar");
const util = __importStar(require("util"));
const utils_1 = require("./../utils");
class Cell {
    #sky;
    #ground;
    #temples = [];
    #majorStars = [];
    #minorStars = [];
    #miniStars = [];
    #borrowCells = [];
    #leaderStar;
    #yearGodStar;
    #scholarStar;
    #ageStart;
    #lifeStage;
    //metadata
    #cellIndex;
    //cells: Cell[] = []
    #prevCell;
    #nextCell;
    constructor(sky, ground) {
        this.#sky = sky;
        this.#ground = ground;
    }
    get sky() {
        return this.#sky;
    }
    get ground() {
        return this.#ground;
    }
    get temples() {
        return this.#temples;
    }
    get majorStars() {
        return this.#majorStars;
    }
    get minorStars() {
        return this.#minorStars;
    }
    get miniStars() {
        return this.#miniStars;
    }
    get allStars() {
        return [...this.#majorStars, ...this.#minorStars, ...this.allMiniStars];
    }
    get allMiniStars() {
        return [...this.#miniStars, this.#scholarStar, this.#yearGodStar, this.#leaderStar];
    }
    get borrowCells() {
        return this.#borrowCells;
    }
    get leaderStar() {
        if (this.#leaderStar) {
            return this.#leaderStar;
        }
        throw new Error('Leader Star not found.');
    }
    set leaderStar(leaderStar) {
        this.#leaderStar = leaderStar;
    }
    get yearGodStar() {
        if (this.#yearGodStar) {
            return this.#yearGodStar;
        }
        throw new Error('Year God Star not found.');
    }
    set yearGodStar(yearGodStar) {
        this.#yearGodStar = yearGodStar;
    }
    get scholarStar() {
        if (this.#scholarStar) {
            return this.#scholarStar;
        }
        throw new Error('Scholar Star not found.');
    }
    set scholarStar(scholarStar) {
        this.#scholarStar = scholarStar;
    }
    get ageStart() {
        if (this.#ageStart !== undefined) {
            return this.#ageStart;
        }
        throw new Error('Age Start not found.');
    }
    set ageStart(ageStart) {
        this.#ageStart = ageStart;
    }
    get ageEnd() {
        if (this.#ageStart !== undefined) {
            return this.#ageStart + 9;
        }
        throw new Error('Age End not found.');
    }
    get lifeStage() {
        if (this.#lifeStage !== undefined) {
            return this.#lifeStage;
        }
        throw new Error('Life Stage not found.');
    }
    set lifeStage(lifeStage) {
        this.#lifeStage = lifeStage;
    }
    get cellIndex() {
        if (this.#cellIndex !== undefined) {
            return this.#cellIndex;
        }
        throw new Error('Cell Index not found.');
    }
    set cellIndex(cellIndex) {
        this.#cellIndex = cellIndex;
    }
    get prevCell() {
        if (this.#prevCell !== undefined) {
            return this.#prevCell;
        }
        throw new Error('prevCell not found.');
    }
    set prevCell(cell) {
        this.#prevCell = cell;
    }
    get nextCell() {
        if (this.#nextCell !== undefined) {
            return this.#nextCell;
        }
        throw new Error('nextCell not found.');
    }
    set nextCell(cell) {
        this.#nextCell = cell;
    }
    get self() {
        return this;
    }
    getPrevICell(i) {
        if (i < 0) {
            return this.getNextICell(-i);
        }
        let cell = this.self;
        for (let j = 0; j < i; j++) {
            if (cell.prevCell === undefined) {
                throw new Error('Prev Cell not defined!');
            }
            cell = cell.prevCell;
        }
        return cell;
        // return this.cells![mod(this.cellIndex! - i, this.cells!.length)]
    }
    getNextICell(i) {
        if (i < 0) {
            return this.getPrevICell(-i);
        }
        let cell = this.self;
        for (let j = 0; j < i; j++) {
            if (cell.nextCell === undefined) {
                throw new Error('Next Cell not defined!');
            }
            cell = cell.nextCell;
        }
        return cell;
        // return this.cells![mod(this.cellIndex! + i, this.cells!.length)]
    }
    getCellNextDist(cell) {
        return (0, utils_1.mod)(cell.cellIndex - this.cellIndex, 12);
    }
    getCellPrevDist(cell) {
        return (0, utils_1.mod)(this.cellIndex - cell.cellIndex, 12);
    }
    getCellDist(cell) {
        const nextDist = this.getCellNextDist(cell);
        return Math.min(nextDist, 12 - nextDist);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return util.inspect(this.toJSON(), opts);
    }
    toJSON() {
        return {
            sky: this.#sky,
            ground: this.#ground,
            temples: this.#temples,
            majorStars: this.#majorStars,
            minorStars: this.#minorStars,
            miniStars: this.#miniStars,
            miscStars: this.allMiniStars,
            ageStart: this.#ageStart,
            ageEnd: this.#ageStart ? this.ageEnd : undefined,
            lifeStage: this.#lifeStage,
        };
    }
    toString() {
        return (`Cell {${this.sky.displayName}${this.ground.displayName}, temples=[${this.temples}]` +
            `, majorStars=[${this.majorStars?.map((star) => star.displayName + ' ' + majorStar_1.MajorStar.majorStarPlacers.get(star)?.evalEnergyLevel(this.ground))}]` +
            `, minorStars=[${this.minorStars}]` +
            `, miniStars=[${this.miniStars}], miscStars=[${[this.#scholarStar, this.#yearGodStar, this.#leaderStar]}]` +
            `, ageRange=[${this.#ageStart ?? ''}-${this.#ageStart ? this.#ageStart + 9 : ''}], lifeStage=[${this.#lifeStage ?? ''}]` +
            `}`);
    }
    equals(cell) {
        if (this === cell) {
            return true;
        }
        else if (this.toJSON() === cell.toJSON()) {
            return true;
        }
        return false;
    }
    get selfWithBorrow() {
        return [this, ...this.#borrowCells.map((borrowCell) => borrowCell.cell)];
    }
    get oppositeCell() {
        return this.getNextICell(6);
    }
    get oppositeCellWithBorrow() {
        return this.oppositeCell.selfWithBorrow;
    }
    get selfOppositeCells() {
        return [this, this.oppositeCell];
    }
    get selfOppositeCellsWithBorrow() {
        return Cell.cellsWithBorrowCells([this, this.oppositeCell]);
    }
    get supportCells() {
        return [this.getNextICell(4), this.getPrevICell(4)];
    }
    get supportCellsWithBorrow() {
        return Cell.cellsWithBorrowCells(this.supportCells);
    }
    get triangleCells() {
        return [this, ...this.supportCells];
    }
    get triangleCellsWithBorrow() {
        return Cell.cellsWithBorrowCells(this.triangleCells);
    }
    get fourCells() {
        return [this, this.oppositeCell, ...this.supportCells];
    }
    get fourCellsWithBorrow() {
        return Cell.cellsWithBorrowCells(this.fourCells);
    }
    static cellsWithBorrowCells(cells) {
        const allCells = cells.flatMap((cell) => {
            return [cell, ...cell.#borrowCells.map((borrowCell) => borrowCell.cell)];
        });
        const uniqueCells = allCells.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });
        return uniqueCells;
    }
    hasMajorMinorStar(targetStar) {
        return !!(this.#majorStars.find((star) => {
            return star.equals(targetStar);
        }) ??
            this.#minorStars.find((star) => {
                return star.equals(targetStar);
            }));
    }
    hasStarInstance(targetStar) {
        return !!(this.#majorStars.find((star) => {
            return star.equals(targetStar);
        }) ??
            this.#minorStars.find((star) => {
                return star.equals(targetStar);
            }) ??
            this.allMiniStars.find((star) => {
                return star.equals(targetStar);
            }));
    }
    hasStar(targetStar) {
        return !!(this.#majorStars.find((star) => {
            return star.equals(targetStar);
        }) ??
            this.#minorStars.find((star) => {
                return star.equals(targetStar);
            }) ??
            this.allMiniStars.find((star) => {
                return star.getDisplayName() === targetStar.getDisplayName();
            }));
    }
    hasAllStars(targetStars) {
        for (const targetStar of targetStars) {
            if (!this.hasStar(targetStar)) {
                return false;
            }
        }
        return true;
    }
    hasAnyStars(targetStars) {
        for (const targetStar of targetStars) {
            if (this.hasStar(targetStar)) {
                return true;
            }
        }
        return false;
    }
    hasTemple(targetTemple) {
        return !!this.temples.find((temple) => {
            return temple.equals(targetTemple);
        });
    }
}
exports.Cell = Cell;
class BorrowCell {
    cell;
    cellRatio;
    constructor(cell, cellRatio) {
        this.cell = cell;
        this.cellRatio = cellRatio;
    }
}
exports.BorrowCell = BorrowCell;
//# sourceMappingURL=cell.js.map