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
exports.StarDerivative = void 0;
const util = __importStar(require("util"));
const majorStar_1 = require("./majorStar");
const minorStar_1 = require("./minorStar");
class StarDerivative {
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
    euqals(starDerivative) {
        return this.key === starDerivative.key;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return this.toString();
    }
    static WEALTHINESS = Object.freeze(new StarDerivative('WEALTHINESS', '祿'));
    static POWER = Object.freeze(new StarDerivative('POWER', '權'));
    static FAME = Object.freeze(new StarDerivative('FAME', '科'));
    static PROBLEM = Object.freeze(new StarDerivative('PROBLEM', '忌'));
    static getWealthinessStar(sky) {
        return [
            majorStar_1.MajorStar.MAJOR_STAR_FIRE,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
            majorStar_1.MajorStar.MAJOR_STAR_ENJOYMENT,
            majorStar_1.MajorStar.MAJOR_STAR_MOON,
            majorStar_1.MajorStar.MAJOR_STAR_GREED,
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_SUN,
            majorStar_1.MajorStar.MAJOR_STAR_ARGUMENT,
            majorStar_1.MajorStar.MAJOR_STAR_RULE,
            majorStar_1.MajorStar.MAJOR_STAR_PIONEER,
        ][sky.index];
    }
    static getPowerStar(sky) {
        return [
            majorStar_1.MajorStar.MAJOR_STAR_PIONEER,
            majorStar_1.MajorStar.MAJOR_STAR_RULE,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
            majorStar_1.MajorStar.MAJOR_STAR_ENJOYMENT,
            majorStar_1.MajorStar.MAJOR_STAR_MOON,
            majorStar_1.MajorStar.MAJOR_STAR_GREED,
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_SUN,
            majorStar_1.MajorStar.MAJOR_STAR_EMPEROR,
            majorStar_1.MajorStar.MAJOR_STAR_ARGUMENT,
        ][sky.index];
    }
    static getFameStar(sky) {
        return [
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_EMPEROR,
            minorStar_1.MinorStar.MINOR_STAR_CLEVER,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
            majorStar_1.MajorStar.MAJOR_STAR_SUN,
            majorStar_1.MajorStar.MAJOR_STAR_RULE,
            majorStar_1.MajorStar.MAJOR_STAR_TREASURY,
            minorStar_1.MinorStar.MINOR_STAR_SKILL,
            majorStar_1.MajorStar.MAJOR_STAR_TREASURY,
            majorStar_1.MajorStar.MAJOR_STAR_MOON,
        ][sky.index];
    }
    static getProblemStar(sky) {
        return [
            majorStar_1.MajorStar.MAJOR_STAR_SUN,
            majorStar_1.MajorStar.MAJOR_STAR_MOON,
            majorStar_1.MajorStar.MAJOR_STAR_FIRE,
            majorStar_1.MajorStar.MAJOR_STAR_ARGUMENT,
            majorStar_1.MajorStar.MAJOR_STAR_CHANGE,
            minorStar_1.MinorStar.MINOR_STAR_SKILL,
            majorStar_1.MajorStar.MAJOR_STAR_ENJOYMENT,
            minorStar_1.MinorStar.MINOR_STAR_CLEVER,
            majorStar_1.MajorStar.MAJOR_STAR_GOLD,
            majorStar_1.MajorStar.MAJOR_STAR_GREED,
        ][sky.index];
    }
}
exports.StarDerivative = StarDerivative;
//# sourceMappingURL=starDerivative.js.map