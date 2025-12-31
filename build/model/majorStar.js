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
exports.MajorStar = void 0;
const miscEnums_1 = require("./miscEnums");
const ground_1 = require("./ground");
const util = __importStar(require("util"));
/**
 * 主星
 */
class MajorStar {
    key;
    displayName;
    constructor(key, displayName) {
        this.key = key;
        this.displayName = displayName;
    }
    toJSON() {
        return this.displayName;
    }
    toString() {
        return this.displayName;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return this.toString();
    }
    static MAJOR_STAR_EMPEROR = Object.freeze(new MajorStar('MAJOR_STAR_EMPEROR', '紫微'));
    static MAJOR_STAR_CHANGE = Object.freeze(new MajorStar('MAJOR_STAR_CHANGE', '天機'));
    static MAJOR_STAR_SUN = Object.freeze(new MajorStar('MAJOR_STAR_SUN', '太陽'));
    static MAJOR_STAR_GOLD = Object.freeze(new MajorStar('MAJOR_STAR_GOLD', '武曲'));
    static MAJOR_STAR_ENJOYMENT = Object.freeze(new MajorStar('MAJOR_STAR_ENJOYMENT', '天同'));
    static MAJOR_STAR_FIRE = Object.freeze(new MajorStar('MAJOR_STAR_FIRE', '廉貞'));
    static MAJOR_STAR_TREASURY = Object.freeze(new MajorStar('MAJOR_STAR_TREASURY', '天府'));
    static MAJOR_STAR_MOON = Object.freeze(new MajorStar('MAJOR_STAR_MOON', '太陰'));
    static MAJOR_STAR_GREED = Object.freeze(new MajorStar('MAJOR_STAR_GREED', '貪狼'));
    static MAJOR_STAR_ARGUMENT = Object.freeze(new MajorStar('MAJOR_STAR_ARGUMENT', '巨門'));
    static MAJOR_STAR_SUPPORT = Object.freeze(new MajorStar('MAJOR_STAR_SUPPORT', '天相'));
    static MAJOR_STAR_RULE = Object.freeze(new MajorStar('MAJOR_STAR_RULE', '天梁'));
    static MAJOR_STAR_GENERAL = Object.freeze(new MajorStar('MAJOR_STAR_GENERAL', '七殺'));
    static MAJOR_STAR_PIONEER = Object.freeze(new MajorStar('MAJOR_STAR_PIONEER', '破軍'));
    static stars = Object.freeze([
        MajorStar.MAJOR_STAR_EMPEROR,
        MajorStar.MAJOR_STAR_CHANGE,
        MajorStar.MAJOR_STAR_SUN,
        MajorStar.MAJOR_STAR_GOLD,
        MajorStar.MAJOR_STAR_ENJOYMENT,
        MajorStar.MAJOR_STAR_FIRE,
        MajorStar.MAJOR_STAR_TREASURY,
        MajorStar.MAJOR_STAR_MOON,
        MajorStar.MAJOR_STAR_GREED,
        MajorStar.MAJOR_STAR_ARGUMENT,
        MajorStar.MAJOR_STAR_SUPPORT,
        MajorStar.MAJOR_STAR_RULE,
        MajorStar.MAJOR_STAR_GENERAL,
        MajorStar.MAJOR_STAR_PIONEER,
    ]);
    static majorStarPlacers;
    static {
        const majorStarPlacers = new Map();
        // 紫微
        majorStarPlacers.set(MajorStar.MAJOR_STAR_EMPEROR, {
            evalGround: (destinyBoard) => {
                const mapping = new Map();
                mapping.set(miscEnums_1.Element.WATER, [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2, 3, 3, 4]);
                mapping.set(miscEnums_1.Element.WOOD, [4, 1, 2, 5, 2, 3, 6, 3, 4, 7, 4, 5, 8, 5, 6, 9, 6, 7, 10, 7, 8, 11, 8, 9, 0, 9, 10, 1, 10, 11]);
                mapping.set(miscEnums_1.Element.GOLD, [11, 4, 1, 2, 0, 5, 2, 3, 1, 6, 3, 4, 2, 7, 4, 5, 3, 8, 5, 6, 4, 9, 6, 7, 5, 10, 7, 8, 6, 11]);
                mapping.set(miscEnums_1.Element.EARTH, [6, 11, 4, 1, 2, 7, 0, 5, 2, 3, 8, 1, 6, 3, 4, 9, 2, 7, 4, 5, 10, 3, 8, 5, 6, 11, 4, 9, 6, 7]);
                mapping.set(miscEnums_1.Element.FIRE, [9, 6, 11, 4, 1, 2, 10, 7, 0, 5, 2, 3, 11, 8, 1, 6, 3, 4, 0, 9, 2, 7, 4, 5, 1, 10, 3, 8, 5, 6]);
                return ground_1.Ground.get(mapping.get(destinyBoard.element)[destinyBoard.config.day - 1]);
            },
            evalEnergyLevel: (ground) => {
                return [0, 2, 2, 1, -1, 1, 2, 2, 1, 0, 0, 1][ground.index];
            },
        });
        // 天機
        majorStarPlacers.set(MajorStar.MAJOR_STAR_CHANGE, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard).shift(-1);
            },
            evalEnergyLevel: (ground) => {
                return [2, -1, 1, 1, 2, 0, 2, -1, 0, 1, 2, 0][ground.index];
            },
        });
        // 太陽
        majorStarPlacers.set(MajorStar.MAJOR_STAR_SUN, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard).shift(-3);
            },
            evalEnergyLevel: (ground) => {
                return [-1, -1, 1, 2, 1, 1, 2, 0, 0, 0, -1, -1][ground.index];
            },
        });
        // 武曲
        majorStarPlacers.set(MajorStar.MAJOR_STAR_GOLD, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard).shift(-4);
            },
            evalEnergyLevel: (ground) => {
                return [1, 2, 0, -1, 2, 0, 1, 2, 0, 1, 2, 0][ground.index];
            },
        });
        // 天同
        majorStarPlacers.set(MajorStar.MAJOR_STAR_ENJOYMENT, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard).shift(-5);
            },
            evalEnergyLevel: (ground) => {
                return [1, -1, 0, 2, 0, 2, -1, -1, 1, 0, 0, 2][ground.index];
            },
        });
        // 廉貞
        majorStarPlacers.set(MajorStar.MAJOR_STAR_FIRE, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard).shift(-8);
            },
            evalEnergyLevel: (ground) => {
                return [0, 1, 2, 0, 1, -1, 0, 2, 2, 0, 1, -1][ground.index];
            },
        });
        // 天府
        majorStarPlacers.set(MajorStar.MAJOR_STAR_TREASURY, {
            evalGround: (destinyBoard) => {
                const ground = majorStarPlacers.get(MajorStar.MAJOR_STAR_EMPEROR).evalGround(destinyBoard);
                const emperorCell = destinyBoard.getCellByGround(ground);
                const emperorCellOffset = emperorCell.getCellNextDist(destinyBoard.getCellByGround(ground_1.Ground.get(2)));
                return emperorCell.getNextICell(emperorCellOffset * 2).ground;
            },
            evalEnergyLevel: (ground) => {
                return [2, 2, 2, 0, 2, 0, 1, 2, 0, -1, 2, 1][ground.index];
            },
        });
        // 太陰
        majorStarPlacers.set(MajorStar.MAJOR_STAR_MOON, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(1);
            },
            evalEnergyLevel: (ground) => {
                return [2, 2, 0, -1, 0, -1, -1, 0, 0, 1, 1, 2][ground.index];
            },
        });
        // 貪狼
        majorStarPlacers.set(MajorStar.MAJOR_STAR_GREED, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(2);
            },
            evalEnergyLevel: (ground) => {
                return [1, 2, 0, 0, 2, -1, 1, 2, 0, 0, 2, -1][ground.index];
            },
        });
        // 巨門
        majorStarPlacers.set(MajorStar.MAJOR_STAR_ARGUMENT, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(3);
            },
            evalEnergyLevel: (ground) => {
                return [1, 1, 2, 2, 0, 0, 1, -1, 2, 2, 1, 1][ground.index];
            },
        });
        // 天相
        majorStarPlacers.set(MajorStar.MAJOR_STAR_SUPPORT, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(4);
            },
            evalEnergyLevel: (ground) => {
                return [2, 2, 2, -1, 1, 0, 1, 0, 2, -1, 0, 0][ground.index];
            },
        });
        // 天梁
        majorStarPlacers.set(MajorStar.MAJOR_STAR_RULE, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(5);
            },
            evalEnergyLevel: (ground) => {
                return [2, 1, 2, 2, 1, -1, 2, 1, -1, 0, 1, -1][ground.index];
            },
        });
        // 七殺
        majorStarPlacers.set(MajorStar.MAJOR_STAR_GENERAL, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(6);
            },
            evalEnergyLevel: (ground) => {
                return [1, 2, 2, -1, 1, 0, 1, 1, 2, 0, 2, 0][ground.index];
            },
        });
        // 七殺
        majorStarPlacers.set(MajorStar.MAJOR_STAR_PIONEER, {
            evalGround: (destinyBoard) => {
                return majorStarPlacers.get(MajorStar.MAJOR_STAR_TREASURY).evalGround(destinyBoard).shift(-2);
            },
            evalEnergyLevel: (ground) => {
                return [2, 1, -1, 1, 1, 0, 2, 2, -1, -1, 1, 0][ground.index];
            },
        });
        MajorStar.majorStarPlacers = Object.freeze(majorStarPlacers);
    }
    getType() {
        return 'MajorStar';
    }
    getKey() {
        return this.key;
    }
    getDisplayName() {
        return this.displayName;
    }
    static getByKey(key) {
        return MajorStar.stars.find((star) => star.getKey() === key) ?? null;
    }
    static getByName(name) {
        return MajorStar.stars.find((star) => star.getDisplayName() === name) ?? null;
    }
    equals(star) {
        return star === this || (star.getType() === this.getType() && star.getKey() === this.getKey());
    }
}
exports.MajorStar = MajorStar;
//# sourceMappingURL=majorStar.js.map