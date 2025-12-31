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
exports.DestinyBoard = void 0;
const utils_1 = require("./../utils");
const cell_1 = require("./cell");
const destinyConfig_1 = require("./destinyConfig");
const ground_1 = require("./ground");
const lifeStage_1 = require("./lifeStage");
const majorStar_1 = require("./majorStar");
const miniStar_1 = require("./miniStar");
const minorStar_1 = require("./minorStar");
const miscEnums_1 = require("./miscEnums");
const sky_1 = require("./sky");
const starDerivative_1 = require("./starDerivative");
const temple_1 = require("./temple");
const util = __importStar(require("util"));
const main_1 = require("../main");
class DestinyBoard {
    config;
    element;
    #destinyMaster;
    #bodyMaster;
    #startControl;
    #cells = [];
    #destinyTempleCellGround;
    // cellGroundZeroIndex?: number
    #bornStarDerivativeMap = new Map();
    constructor(destinyConfig) {
        this.config = destinyConfig;
        this.element = miscEnums_1.Element.FIRE;
        this.#setupStartControl();
        this.#setupDestinyBodyMaster();
        this.#setupBasicTempleCells();
        this.#setupTemples();
        this.#setupElements();
        this.#setupLifeStage();
        this.#setupAgeRange();
        this.#setupMajorStars();
        this.#setupMinorStars();
        this.#setupMiniStars();
        this.#setupBornStarDerivative();
        this.#setupBorrowCells();
        Object.freeze(this);
    }
    get destinyMaster() {
        if (this.#destinyMaster !== undefined) {
            return this.#destinyMaster;
        }
        throw new Error('destinyMaster not defined.');
    }
    get bodyMaster() {
        if (this.#bodyMaster !== undefined) {
            return this.#bodyMaster;
        }
        throw new Error('bodyMaster not defined.');
    }
    get startControl() {
        if (this.#startControl !== undefined) {
            return this.#startControl;
        }
        throw new Error('startControl not defined.');
    }
    get destinyTempleCellGround() {
        if (this.#destinyTempleCellGround !== undefined) {
            return this.#destinyTempleCellGround;
        }
        throw new Error('destinyTempleCellGround not defined.');
    }
    get cells() {
        return this.#cells;
    }
    get bornStarDerivativeMap() {
        return this.#bornStarDerivativeMap;
    }
    #setupStartControl() {
        this.#startControl = this.config.bornTimeGround.ground.shift(-this.config.getLogicalMonth() + 1);
    }
    #setupDestinyBodyMaster() {
        this.#destinyMaster = [
            majorStar_1.MajorStar.MAJOR_STAR_GREED,
            majorStar_1.MajorStar.MAJOR_STAR_ARGUMENT,
            minorStar_1.MinorStar.MINOR_STAR_EARN,
            minorStar_1.MinorStar.MINOR_STAR_SKILL,
            majorStar_1.MajorStar.MAJOR_STAR_FIRE,
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_PIONEER,
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_FIRE,
            minorStar_1.MinorStar.MINOR_STAR_SKILL,
            minorStar_1.MinorStar.MINOR_STAR_EARN,
            majorStar_1.MajorStar.MAJOR_STAR_ARGUMENT,
        ][this.config.yearGround.index];
        this.#bodyMaster = [
            minorStar_1.MinorStar.MINOR_STAR_BURNING,
            majorStar_1.MajorStar.MAJOR_STAR_SUPPORT,
            majorStar_1.MajorStar.MAJOR_STAR_RULE,
            majorStar_1.MajorStar.MAJOR_STAR_ENJOYMENT,
            minorStar_1.MinorStar.MINOR_STAR_CLEVER,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
            minorStar_1.MinorStar.MINOR_STAR_BURNING,
            majorStar_1.MajorStar.MAJOR_STAR_SUPPORT,
            majorStar_1.MajorStar.MAJOR_STAR_RULE,
            majorStar_1.MajorStar.MAJOR_STAR_ENJOYMENT,
            minorStar_1.MinorStar.MINOR_STAR_CLEVER,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
        ][this.config.yearGround.index];
    }
    #setupBasicTempleCells() {
        const cells = [];
        const tempCells = [];
        // build cells
        for (let i = 0; i < 12; i++) {
            const cell = new cell_1.Cell(sky_1.Sky.get((this.config.yearSky.index % 5) * 2 + 2 + i), ground_1.Ground.get(i + 2));
            tempCells.push(cell);
        }
        for (let i = -2; i < -2 + 12; i++) {
            const cell = tempCells[(0, utils_1.mod)(i, 12)];
            cell.cellIndex = cells.length;
            //cell.cells = cells
            cell.prevCell = tempCells[(0, utils_1.mod)(i - 1, 12)];
            cell.nextCell = tempCells[(0, utils_1.mod)(i + 1, 12)];
            cells.push(tempCells[(0, utils_1.mod)(i, 12)]);
        }
        this.#cells = cells; //assign cells
        // store cellGroundZeroIndex
        // for (let i = 0; i < cells.length; i++) {
        //     if (cells[i].ground === Ground.get(0)) {
        //         this.cellGroundZeroIndex = i
        //         break
        //     }
        // }
    }
    #setupTemples() {
        // 安身
        const bodyTempleGround = this.config.bornTimeGround.ground.shift(2 + this.config.getLogicalMonth() - 1);
        let destinyTempleCellGround;
        // 安命
        switch (this.config.configType) {
            case destinyConfig_1.ConfigType.GROUND:
                destinyTempleCellGround = bodyTempleGround;
                break;
            case destinyConfig_1.ConfigType.HUMAN:
                destinyTempleCellGround = ground_1.Ground.get(-this.config.bornTimeGround.ground.index + 2 + this.config.getLogicalMonth() - 1 + 2);
                break;
            case destinyConfig_1.ConfigType.SKY:
            default:
                destinyTempleCellGround = ground_1.Ground.get(-this.config.bornTimeGround.ground.index + 2 + this.config.getLogicalMonth() - 1);
        }
        this.#destinyTempleCellGround = destinyTempleCellGround;
        this.getCellByGround(destinyTempleCellGround).temples.push(temple_1.Temple.TEMPLE_DESTINY);
        this.getCellByGround(bodyTempleGround).temples.push(temple_1.Temple.TEMPLE_BODY);
        for (let i = temple_1.Temple.LOOP_TEMPLES.indexOf(temple_1.Temple.TEMPLE_BROTHER); i < temple_1.Temple.LOOP_TEMPLES.length; i++) {
            const templeGround = ground_1.Ground.get(destinyTempleCellGround.index - i);
            this.getCellByGround(templeGround).temples.push(temple_1.Temple.LOOP_TEMPLES[i]);
        }
    }
    #setupBorrowCells() {
        for (const cell of this.#cells) {
            if (cell.majorStars.length == 0) {
                if (cell.getNextICell(4).majorStars.length == 0) {
                    cell.borrowCells.push(Object.freeze(new cell_1.BorrowCell(cell.getNextICell(6), 54.26)), Object.freeze(new cell_1.BorrowCell(cell.getPrevICell(4), 32.45)), Object.freeze(new cell_1.BorrowCell(cell.getPrevICell(2), 13.29)));
                }
                else if (cell.getPrevICell(4).majorStars.length == 0) {
                    cell.borrowCells.push(Object.freeze(new cell_1.BorrowCell(cell.getNextICell(6), 54.26)), Object.freeze(new cell_1.BorrowCell(cell.getNextICell(4), 32.45)), Object.freeze(new cell_1.BorrowCell(cell.getNextICell(2), 13.29)));
                }
                else {
                    cell.borrowCells.push(Object.freeze(new cell_1.BorrowCell(cell.getNextICell(6), 51)), Object.freeze(new cell_1.BorrowCell(cell.getNextICell(4), 24.5)), Object.freeze(new cell_1.BorrowCell(cell.getPrevICell(4), 24.5)));
                }
            }
        }
    }
    #setupElements() {
        const cell = this.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
        const skyGroup = Math.round(Math.floor(cell.sky.index / 2));
        const groundGroup = Math.round(Math.floor(cell.ground.index / 2));
        if (skyGroup >= 0 && skyGroup < 10 / 2 && groundGroup >= 0 && groundGroup < 12 / 2) {
            const mapping = [
                [miscEnums_1.Element.GOLD, miscEnums_1.Element.WATER, miscEnums_1.Element.FIRE, miscEnums_1.Element.GOLD, miscEnums_1.Element.WATER, miscEnums_1.Element.FIRE],
                [miscEnums_1.Element.WATER, miscEnums_1.Element.FIRE, miscEnums_1.Element.EARTH, miscEnums_1.Element.WATER, miscEnums_1.Element.FIRE, miscEnums_1.Element.EARTH],
                [miscEnums_1.Element.FIRE, miscEnums_1.Element.EARTH, miscEnums_1.Element.WOOD, miscEnums_1.Element.FIRE, miscEnums_1.Element.EARTH, miscEnums_1.Element.WOOD],
                [miscEnums_1.Element.EARTH, miscEnums_1.Element.WOOD, miscEnums_1.Element.GOLD, miscEnums_1.Element.EARTH, miscEnums_1.Element.WOOD, miscEnums_1.Element.GOLD],
                [miscEnums_1.Element.WOOD, miscEnums_1.Element.GOLD, miscEnums_1.Element.WATER, miscEnums_1.Element.WOOD, miscEnums_1.Element.GOLD, miscEnums_1.Element.WATER],
            ];
            this.element = mapping[skyGroup][groundGroup];
        }
    }
    #setupLifeStage() {
        let ground;
        if (this.element == miscEnums_1.Element.WATER) {
            ground = ground_1.Ground.get(8);
        }
        else if (this.element == miscEnums_1.Element.WOOD) {
            ground = ground_1.Ground.get(11);
        }
        else if (this.element == miscEnums_1.Element.GOLD) {
            ground = ground_1.Ground.get(5);
        }
        else if (this.element == miscEnums_1.Element.EARTH) {
            ground = ground_1.Ground.get(8);
        }
        else {
            ground = ground_1.Ground.get(2);
        }
        const direction = this.configDirection;
        const beginCell = this.getCellByGround(ground);
        for (let i = 0; i < this.#cells.length; i++) {
            beginCell.getNextICell(i * direction.direction).lifeStage = lifeStage_1.LifeStage.values[i];
        }
    }
    #setupAgeRange() {
        const direction = this.configDirection;
        const ageStart = this.element.patternNumber;
        const destinyCell = this.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
        for (let i = 0; i < this.#cells.length; i++) {
            destinyCell.getNextICell(i * direction.direction).ageStart = ageStart + 10 * i;
        }
    }
    #setupMajorStars() {
        for (const [majorStar, majorStarPlacer] of majorStar_1.MajorStar.majorStarPlacers.entries()) {
            const ground = majorStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.majorStars.push(majorStar);
        }
    }
    #setupMinorStars() {
        for (const [minorStar, minorStarPlacer] of minorStar_1.MinorStar.minorStarPlacers.entries()) {
            const ground = minorStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.minorStars.push(minorStar);
        }
    }
    #setupMiniStars() {
        for (const miniStar of miniStar_1.MiniStar.stars) {
            const miniStarPlacer = miniStar_1.MiniStar.miniStarPlacers.get(miniStar);
            if (!miniStarPlacer) {
                throw new Error('miniStarPlacer not found');
            }
            const ground = miniStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.miniStars.push(miniStar);
        }
        for (const miniStar of miniStar_1.MiniStar.twelveScholarStars) {
            const miniStarPlacer = miniStar_1.MiniStar.miniStarPlacers.get(miniStar);
            if (!miniStarPlacer) {
                throw new Error('miniStarPlacer not found');
            }
            const ground = miniStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.scholarStar = miniStar;
        }
        for (const miniStar of miniStar_1.MiniStar.twelveYearGodStars) {
            const miniStarPlacer = miniStar_1.MiniStar.miniStarPlacers.get(miniStar);
            if (!miniStarPlacer) {
                throw new Error('miniStarPlacer not found');
            }
            const ground = miniStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.yearGodStar = miniStar;
        }
        for (const miniStar of miniStar_1.MiniStar.twelveLeaderStars) {
            const miniStarPlacer = miniStar_1.MiniStar.miniStarPlacers.get(miniStar);
            if (!miniStarPlacer) {
                throw new Error('miniStarPlacer not found');
            }
            const ground = miniStarPlacer.evalGround(this);
            const cell = this.getCellByGround(ground);
            cell.leaderStar = miniStar;
        }
    }
    #setupBornStarDerivative() {
        this.#bornStarDerivativeMap.set(starDerivative_1.StarDerivative.WEALTHINESS, starDerivative_1.StarDerivative.getWealthinessStar(this.config.yearSky));
        this.#bornStarDerivativeMap.set(starDerivative_1.StarDerivative.POWER, starDerivative_1.StarDerivative.getPowerStar(this.config.yearSky));
        this.#bornStarDerivativeMap.set(starDerivative_1.StarDerivative.FAME, starDerivative_1.StarDerivative.getFameStar(this.config.yearSky));
        this.#bornStarDerivativeMap.set(starDerivative_1.StarDerivative.PROBLEM, starDerivative_1.StarDerivative.getProblemStar(this.config.yearSky));
        Object.freeze(this.#bornStarDerivativeMap);
    }
    getCellByGround(ground) {
        return this.#cells[ground.index];
    }
    getCellByTemple(temple) {
        const targetCell = this.#cells.find((cell) => {
            return cell.temples.map((temple) => temple.key).includes(temple.key);
        });
        if (targetCell) {
            return targetCell;
        }
        else {
            throw new Error('Cannot find cell');
        }
    }
    getCellByStar(star) {
        const targetCell = this.cells.find((cell) => {
            return cell.allStars.includes(star);
        });
        if (!targetCell) {
            throw new Error('Cannot find cell');
        }
        return targetCell;
    }
    getTenYearSky(age) {
        const direction = this.configDirection.direction;
        const destinyCell = this.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
        const cycleAgeEnd = destinyCell.getNextICell(-1 * direction).ageEnd;
        const logicalAge = (0, utils_1.mod)(age, cycleAgeEnd);
        let targetCell;
        for (let i = 0; i < this.#cells.length; i++) {
            const cell = destinyCell.getNextICell(i * direction);
            if (logicalAge <= cell.ageEnd) {
                targetCell = cell;
                break;
            }
        }
        if (targetCell) {
            return targetCell.sky;
        }
        else {
            throw new Error('Cannot find ten year sky for unknown reason.');
        }
    }
    getTenYearCellGround(age) {
        const direction = this.configDirection.direction;
        const destinyCell = this.getCellByTemple(temple_1.Temple.TEMPLE_DESTINY);
        const cycleAgeEnd = destinyCell.getNextICell(-1 * direction).ageEnd;
        const logicalAge = (0, utils_1.mod)(age, cycleAgeEnd);
        let targetCell;
        for (let i = 0; i < this.#cells.length; i++) {
            const cell = destinyCell.getNextICell(i * direction);
            if (logicalAge <= cell.ageEnd) {
                targetCell = cell;
                break;
            }
        }
        if (targetCell) {
            return targetCell.ground;
        }
        else {
            throw new Error('Cannot find ten year ground for unknown reason.');
        }
    }
    getRuntimContext({ lunarYear, lunarMonth, lunarDay, leap, calendar, }) {
        calendar = calendar ?? main_1.defaultCalendar;
        const age = lunarYear - this.config.year + 1;
        const tenYearGround = this.getTenYearCellGround(age);
        const runtimeDateContext = {
            age,
            effectiveMonth: lunarMonth + (leap && lunarDay > 15 ? 1 : 0),
            tenYearGround,
            tenYearSky: this.getCellByGround(tenYearGround).sky,
            ...calendar.lunarSkyGround(lunarYear, lunarMonth, lunarDay, leap),
        };
        runtimeDateContext.monthSky = sky_1.Sky.get((((runtimeDateContext.yearSky.index % 5) + 1) * 2 + (runtimeDateContext.effectiveMonth - 1)) % 10);
        runtimeDateContext.monthGround = ground_1.Ground.get(runtimeDateContext.effectiveMonth + 1);
        const runtimeBoardState = {
            tenYear: { cellGround: null, groundStars: null, starDerivativeMap: null },
            year: { cellGround: null, groundStars: null, starDerivativeMap: null },
            month: { cellGround: null, groundStars: null, starDerivativeMap: null },
            day: { cellGround: null, groundStars: null, starDerivativeMap: null },
        };
        runtimeBoardState.tenYear.cellGround = runtimeDateContext.tenYearGround;
        runtimeBoardState.tenYear.groundStars = main_1.Runtime.getRuntimeLocationStars(runtimeDateContext.tenYearSky);
        runtimeBoardState.tenYear.starDerivativeMap = main_1.Runtime.getStarToDerivativeMapOf(runtimeDateContext.tenYearSky);
        runtimeBoardState.year.cellGround = runtimeDateContext.yearGround;
        runtimeBoardState.year.groundStars = main_1.Runtime.getRuntimeLocationStars(runtimeDateContext.yearSky);
        runtimeBoardState.year.starDerivativeMap = main_1.Runtime.getStarToDerivativeMapOf(runtimeDateContext.yearSky);
        runtimeBoardState.month.cellGround = this.startControl.shift(runtimeDateContext.yearGround.index).shift(lunarMonth - 1);
        runtimeBoardState.month.groundStars = main_1.Runtime.getRuntimeLocationStars(runtimeDateContext.monthSky);
        runtimeBoardState.month.starDerivativeMap = main_1.Runtime.getStarToDerivativeMapOf(runtimeDateContext.monthSky);
        runtimeBoardState.day.cellGround = runtimeBoardState.month.cellGround.shift(lunarDay - 1);
        if (leap) {
            runtimeBoardState.day.cellGround = runtimeBoardState.day.cellGround.shift(calendar.lunarMonthDays(lunarYear, lunarMonth, false));
        }
        runtimeBoardState.day.groundStars = main_1.Runtime.getRuntimeLocationStars(runtimeDateContext.daySky);
        runtimeBoardState.day.starDerivativeMap = main_1.Runtime.getStarToDerivativeMapOf(runtimeDateContext.daySky);
        return {
            ...runtimeDateContext,
            ...runtimeBoardState,
        };
    }
    get shadowLight() {
        return this.config.yearSky.index % 2 == 0 ? miscEnums_1.ShadowLight.LIGHT : miscEnums_1.ShadowLight.SHADOW;
    }
    get configDirection() {
        const direction = this.shadowLight === miscEnums_1.ShadowLight.LIGHT ? miscEnums_1.Direction.CLOCKWISE : miscEnums_1.Direction.ANTI_CLOCKWISE;
        return direction.add(this.config.gender == destinyConfig_1.Gender.M ? miscEnums_1.Direction.CLOCKWISE : miscEnums_1.Direction.ANTI_CLOCKWISE);
    }
    getMajorStarEnergyLevel(majorStar) {
        return majorStar_1.MajorStar.majorStarPlacers.get(majorStar).evalEnergyLevel(majorStar_1.MajorStar.majorStarPlacers.get(majorStar).evalGround(this));
    }
    getMajorStarDerivative(star) {
        if (this.#bornStarDerivativeMap.get(starDerivative_1.StarDerivative.WEALTHINESS)?.equals(star)) {
            return starDerivative_1.StarDerivative.WEALTHINESS;
        }
        else if (this.#bornStarDerivativeMap.get(starDerivative_1.StarDerivative.POWER)?.equals(star)) {
            return starDerivative_1.StarDerivative.POWER;
        }
        else if (this.#bornStarDerivativeMap.get(starDerivative_1.StarDerivative.FAME)?.equals(star)) {
            return starDerivative_1.StarDerivative.FAME;
        }
        else if (this.#bornStarDerivativeMap.get(starDerivative_1.StarDerivative.PROBLEM)?.equals(star)) {
            return starDerivative_1.StarDerivative.PROBLEM;
        }
        else {
            return null;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return util.inspect(this.toJSON(), opts);
    }
    toJSON() {
        return {
            config: this.config,
            element: this.element,
            destinyMaster: this.#destinyMaster,
            bodyMaster: this.#bodyMaster,
            startControl: this.#startControl,
            cells: this.#cells,
            bornStarDerivativeMap: Object.fromEntries(this.#bornStarDerivativeMap),
        };
    }
    // prettier-ignore
    toString() {
        const cellsString = this.#cells.map((cell) => '        ' + cell.toString()).join(',\n');
        return (`DestinyBoard {\n` +
            `    config: ${this.config},\n` +
            `    element: ${this.element},\n` +
            `    destinyMaster: ${this.#destinyMaster},\n` +
            `    bodyMaster: ${this.#bodyMaster},\n` +
            `    startControl: ${this.#startControl},\n` +
            `    cells: [\n` +
            cellsString + '\n' +
            `    ],\n` +
            `    #bornStarDerivativeMap: ${JSON.stringify(Object.fromEntries(this.#bornStarDerivativeMap))}\n` +
            `}`);
    }
}
exports.DestinyBoard = DestinyBoard;
//# sourceMappingURL=destinyBoard.js.map