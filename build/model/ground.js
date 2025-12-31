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
exports.Ground = void 0;
const utils_1 = require("./../utils");
const util = __importStar(require("util"));
const GROUND_WORDS = Object.freeze(['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']);
class Ground {
    index;
    displayName;
    constructor(index, displayName) {
        this.index = index;
        this.displayName = displayName;
    }
    shift(i) {
        return Ground.get(this.index + i);
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
    static get(i) {
        return Ground.GROUNDS[(0, utils_1.mod)(i, 12)];
    }
    static getByName(name) {
        const index = GROUND_WORDS.indexOf(name);
        if (index !== -1) {
            return Ground.get(index);
        }
        else {
            throw new Error('Not found');
        }
    }
    static GROUNDS = Object.freeze(GROUND_WORDS.map((word, i) => {
        return Object.freeze(new Ground(i, word));
    }));
    static values() {
        return Ground.GROUNDS;
    }
    equals(ground) {
        return this === ground || this.index === ground.index;
    }
}
exports.Ground = Ground;
//# sourceMappingURL=ground.js.map