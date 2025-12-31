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
exports.MinorStar = void 0;
const ground_1 = require("./ground");
const miscEnums_1 = require("./miscEnums");
const util = __importStar(require("util"));
class MinorStar {
    key;
    displayName;
    luck;
    constructor(key, displayName, luck) {
        this.key = key;
        this.displayName = displayName;
        this.luck = luck;
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
    static MINOR_STAR_EARN = Object.freeze(new MinorStar('MINOR_STAR_EARN', '祿存', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_BENEFACTOR_MAN = Object.freeze(new MinorStar('MINOR_STAR_BENEFACTOR_MAN', '天魁', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_BENEFACTOR_WOMAN = Object.freeze(new MinorStar('MINOR_STAR_BENEFACTOR_WOMAN', '天鉞', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_CLEVER = Object.freeze(new MinorStar('MINOR_STAR_CLEVER', '文昌', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_SKILL = Object.freeze(new MinorStar('MINOR_STAR_SKILL', '文曲', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_SUPPORT_LEFT = Object.freeze(new MinorStar('MINOR_STAR_SUPPORT_LEFT', '左輔', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_SUPPORT_RIGHT = Object.freeze(new MinorStar('MINOR_STAR_SUPPORT_RIGHT', '右弼', miscEnums_1.Luckiness.LUCK));
    static MINOR_STAR_VOID_GROUND = Object.freeze(new MinorStar('MINOR_STAR_VOID_GROUND', '地空', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_LOST = Object.freeze(new MinorStar('MINOR_STAR_LOST', '地劫', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_BURNING = Object.freeze(new MinorStar('MINOR_STAR_BURNING', '火星', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_HIDDEN_FIRE = Object.freeze(new MinorStar('MINOR_STAR_HIDDEN_FIRE', '鈴星', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_COMPETITION = Object.freeze(new MinorStar('MINOR_STAR_COMPETITION', '擎羊', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_HINDRANCE = Object.freeze(new MinorStar('MINOR_STAR_HINDRANCE', '陀羅', miscEnums_1.Luckiness.BAD_LUCK));
    static MINOR_STAR_PEGASUS = Object.freeze(new MinorStar('MINOR_STAR_PEGASUS', '天馬', miscEnums_1.Luckiness.NEUTRAL));
    static stars = Object.freeze([
        MinorStar.MINOR_STAR_EARN,
        MinorStar.MINOR_STAR_BENEFACTOR_MAN,
        MinorStar.MINOR_STAR_BENEFACTOR_WOMAN,
        MinorStar.MINOR_STAR_CLEVER,
        MinorStar.MINOR_STAR_SKILL,
        MinorStar.MINOR_STAR_SUPPORT_LEFT,
        MinorStar.MINOR_STAR_SUPPORT_RIGHT,
        MinorStar.MINOR_STAR_VOID_GROUND,
        MinorStar.MINOR_STAR_LOST,
        MinorStar.MINOR_STAR_BURNING,
        MinorStar.MINOR_STAR_HIDDEN_FIRE,
        MinorStar.MINOR_STAR_COMPETITION,
        MinorStar.MINOR_STAR_HINDRANCE,
        MinorStar.MINOR_STAR_PEGASUS,
    ]);
    static minorStarPlacers;
    static {
        const minorStarPlacers = new Map();
        // 祿存
        minorStarPlacers.set(MinorStar.MINOR_STAR_EARN, {
            evalGround: (destinyBoard) => {
                return minorStarPlacers.get(MinorStar.MINOR_STAR_EARN).evalRuntimeGround(destinyBoard.config.yearSky);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([2, 3, 5, 6, 5, 6, 8, 9, 11, 0][sky.index]);
            },
        });
        // 天魁
        minorStarPlacers.set(MinorStar.MINOR_STAR_BENEFACTOR_MAN, {
            evalGround: (destinyBoard) => {
                return minorStarPlacers.get(MinorStar.MINOR_STAR_BENEFACTOR_MAN).evalRuntimeGround(destinyBoard.config.yearSky);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([1, 0, 11, 11, 1, 0, 1, 6, 3, 3][sky.index]);
            },
        });
        // 天鉞
        minorStarPlacers.set(MinorStar.MINOR_STAR_BENEFACTOR_WOMAN, {
            evalGround: (destinyBoard) => {
                return minorStarPlacers.get(MinorStar.MINOR_STAR_BENEFACTOR_WOMAN).evalRuntimeGround(destinyBoard.config.yearSky);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([7, 8, 9, 9, 7, 8, 7, 2, 5, 5][sky.index]);
            },
        });
        // 文昌
        minorStarPlacers.set(MinorStar.MINOR_STAR_CLEVER, {
            evalGround: (destinyBoard) => {
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                return ground_1.Ground.get(10).shift(-bornGround.index);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([5, 6, 8, 9, 8, 9, 11, 0, 2, 3][sky.index]);
            },
        });
        // 文曲
        minorStarPlacers.set(MinorStar.MINOR_STAR_SKILL, {
            evalGround: (destinyBoard) => {
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                return ground_1.Ground.get(4).shift(bornGround.index);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([9, 8, 6, 5, 6, 5, 3, 2, 0, 11][sky.index]);
            },
        });
        // 左輔
        minorStarPlacers.set(MinorStar.MINOR_STAR_SUPPORT_LEFT, {
            evalGround: (destinyBoard) => {
                const month = destinyBoard.config.getLogicalMonth();
                return ground_1.Ground.get(4).shift(month - 1);
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 右弼
        minorStarPlacers.set(MinorStar.MINOR_STAR_SUPPORT_RIGHT, {
            evalGround: (destinyBoard) => {
                const month = destinyBoard.config.getLogicalMonth();
                return ground_1.Ground.get(10).shift(-(month - 1));
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 地空
        minorStarPlacers.set(MinorStar.MINOR_STAR_VOID_GROUND, {
            evalGround: (destinyBoard) => {
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                return ground_1.Ground.get(11).shift(-bornGround.index);
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 地劫
        minorStarPlacers.set(MinorStar.MINOR_STAR_LOST, {
            evalGround: (destinyBoard) => {
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                return ground_1.Ground.get(11).shift(bornGround.index);
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 火星
        minorStarPlacers.set(MinorStar.MINOR_STAR_BURNING, {
            evalGround: (destinyBoard) => {
                const yearGround = destinyBoard.config.yearGround;
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                const mapping = [2, 3, 1, 9, 2, 3, 1, 9, 2, 3, 1, 9];
                return ground_1.Ground.get(mapping[yearGround.index]).shift(bornGround.index);
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 鈴星
        minorStarPlacers.set(MinorStar.MINOR_STAR_HIDDEN_FIRE, {
            evalGround: (destinyBoard) => {
                const yearGround = destinyBoard.config.yearGround;
                const bornGround = destinyBoard.config.bornTimeGround.ground;
                if ([2, 6, 10].includes(yearGround.index)) {
                    return ground_1.Ground.get(3).shift(bornGround.index);
                }
                else {
                    return ground_1.Ground.get(10).shift(bornGround.index);
                }
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        // 擎羊
        minorStarPlacers.set(MinorStar.MINOR_STAR_COMPETITION, {
            evalGround: (destinyBoard) => {
                return minorStarPlacers.get(MinorStar.MINOR_STAR_COMPETITION).evalRuntimeGround(destinyBoard.config.yearSky);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([3, 4, 6, 7, 6, 7, 9, 10, 0, 1][sky.index]);
            },
        });
        // 陀羅
        minorStarPlacers.set(MinorStar.MINOR_STAR_HINDRANCE, {
            evalGround: (destinyBoard) => {
                return minorStarPlacers.get(MinorStar.MINOR_STAR_HINDRANCE).evalRuntimeGround(destinyBoard.config.yearSky);
            },
            hasRuntime: () => true,
            evalRuntimeGround: (sky) => {
                return ground_1.Ground.get([1, 2, 4, 5, 4, 5, 7, 8, 10, 11][sky.index]);
            },
        });
        // 天馬
        minorStarPlacers.set(MinorStar.MINOR_STAR_PEGASUS, {
            evalGround: (destinyBoard) => {
                return ground_1.Ground.get([2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5][destinyBoard.config.yearGround.index]);
            },
            hasRuntime: () => false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            evalRuntimeGround: (sky) => {
                throw new Error('Runtime not supported');
            },
        });
        MinorStar.minorStarPlacers = Object.freeze(minorStarPlacers);
    }
    getType() {
        return 'MinorStar';
    }
    getKey() {
        return this.key;
    }
    getDisplayName() {
        return this.displayName;
    }
    static getByKey(key) {
        return MinorStar.stars.find((star) => star.getKey() === key) ?? null;
    }
    static getByName(name) {
        return MinorStar.stars.find((star) => star.getDisplayName() === name) ?? null;
    }
    equals(star) {
        return star === this || (star.getType() === this.getType() && star.getKey() === this.getKey());
    }
}
exports.MinorStar = MinorStar;
//# sourceMappingURL=minorStar.js.map