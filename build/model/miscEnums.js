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
exports.Direction = exports.ShadowLight = exports.Luckiness = exports.Element = void 0;
const util = __importStar(require("util"));
var Luckiness;
(function (Luckiness) {
    Luckiness[Luckiness["LUCK"] = 1] = "LUCK";
    Luckiness[Luckiness["NEUTRAL"] = 0] = "NEUTRAL";
    Luckiness[Luckiness["BAD_LUCK"] = -1] = "BAD_LUCK";
})(Luckiness || (exports.Luckiness = Luckiness = {}));
class ShadowLight {
    displayName;
    constructor(displayName) {
        this.displayName = displayName;
    }
    toJSON() {
        return this.displayName;
    }
    toString() {
        return this.displayName;
    }
    static SHADOW = Object.freeze(new ShadowLight('陰'));
    static LIGHT = Object.freeze(new ShadowLight('陽'));
}
exports.ShadowLight = ShadowLight;
class Direction {
    direction;
    constructor(direction) {
        this.direction = direction;
    }
    add(direction) {
        if (this.direction * direction.direction === 1) {
            return Direction.CLOCKWISE;
        }
        return Direction.ANTI_CLOCKWISE;
    }
    static CLOCKWISE = Object.freeze(new Direction(1));
    static ANTI_CLOCKWISE = Object.freeze(new Direction(-1));
}
exports.Direction = Direction;
class Element {
    code;
    displayName;
    patternNumber;
    constructor(code, displayName, patternNumber) {
        this.code = code;
        this.displayName = displayName;
        this.patternNumber = patternNumber;
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
    static get(code) {
        const element = Element.#ELEMENTS[code];
        if (element) {
            return element;
        }
        else {
            throw new Error('Element not found');
        }
    }
    static GOLD = Object.freeze(new Element('GOLD', '金四局', 4));
    static WOOD = Object.freeze(new Element('WOOD', '木三局', 3));
    static EARTH = Object.freeze(new Element('EARTH', '土五局', 5));
    static WATER = Object.freeze(new Element('WATER', '水二局', 2));
    static FIRE = Object.freeze(new Element('FIRE', '火六局', 6));
    static #ELEMENTS = Object.freeze({
        GOLD: Element.GOLD,
        WOOD: Element.WOOD,
        EARTH: Element.EARTH,
        WATER: Element.WATER,
        FIRE: Element.FIRE,
    });
}
exports.Element = Element;
//# sourceMappingURL=miscEnums.js.map