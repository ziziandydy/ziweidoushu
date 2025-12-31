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
exports.LifeStage = void 0;
const util = __importStar(require("util"));
class LifeStage {
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
    static getByName(name) {
        return LifeStage.values.find((lifeStage) => lifeStage.displayName === name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return this.toString();
    }
    static values = Object.freeze([
        Object.freeze(new LifeStage('長生')),
        Object.freeze(new LifeStage('沐浴')),
        Object.freeze(new LifeStage('冠帶')),
        Object.freeze(new LifeStage('臨官')),
        Object.freeze(new LifeStage('帝旺')),
        Object.freeze(new LifeStage('衰')),
        Object.freeze(new LifeStage('病')),
        Object.freeze(new LifeStage('死')),
        Object.freeze(new LifeStage('墓')),
        Object.freeze(new LifeStage('絕')),
        Object.freeze(new LifeStage('胎')),
        Object.freeze(new LifeStage('養')),
    ]);
}
exports.LifeStage = LifeStage;
//# sourceMappingURL=lifeStage.js.map