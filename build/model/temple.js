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
exports.Temple = void 0;
const util = __importStar(require("util"));
class Temple {
    key;
    displayName;
    formalName;
    index;
    constructor(key, displayName, formalName, index) {
        this.key = key;
        this.displayName = displayName;
        this.formalName = formalName;
        this.index = index;
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
    getDisplayName() {
        return this.displayName;
    }
    getFormalName() {
        return this.formalName;
    }
    static getByKey(key) {
        const targetTemple = Temple.TEMPLES.find((temple) => temple.key === key);
        return targetTemple ?? null;
    }
    static getByName(name) {
        const targetTemple = Temple.TEMPLES.find((temple) => temple.displayName === name || temple.formalName === name);
        if (targetTemple) {
            return targetTemple;
        }
    }
    static TEMPLE_DESTINY = Object.freeze(new Temple('TEMPLE_DESTINY', '命宮', '命宮', 0));
    static TEMPLE_BROTHER = Object.freeze(new Temple('TEMPLE_BROTHER', '兄弟', '兄弟宮', 1));
    static TEMPLE_MARRIAGE = Object.freeze(new Temple('TEMPLE_MARRIAGE', '夫妻', '夫妻宮', 2));
    static TEMPLE_CHILDREN = Object.freeze(new Temple('TEMPLE_CHILDREN', '子女', '子女宮', 3));
    static TEMPLE_MONEY = Object.freeze(new Temple('TEMPLE_MONEY', '財帛', '財帛宮', 4));
    static TEMPLE_ILLNESS = Object.freeze(new Temple('TEMPLE_ILLNESS', '疾厄', '疾厄宮', 5));
    static TEMPLE_MOVE = Object.freeze(new Temple('TEMPLE_MOVE', '遷移', '遷移宮', 6));
    static TEMPLE_FRIEND = Object.freeze(new Temple('TEMPLE_FRIEND', '交友', '交友宮', 7));
    static TEMPLE_CAREER = Object.freeze(new Temple('TEMPLE_CAREER', '事業', '事業宮', 8));
    static TEMPLE_HOUSE = Object.freeze(new Temple('TEMPLE_HOUSE', '田宅', '田宅宮', 9));
    static TEMPLE_HAPPINESS = Object.freeze(new Temple('TEMPLE_HAPPINESS', '福德', '福德宮', 10));
    static TEMPLE_PARENT = Object.freeze(new Temple('TEMPLE_PARENT', '父母', '父母宮', 11));
    static TEMPLE_BODY = Object.freeze(new Temple('TEMPLE_BODY', '身宮', '身宮', 0));
    static TEMPLES = Object.freeze([
        Temple.TEMPLE_DESTINY,
        Temple.TEMPLE_BROTHER,
        Temple.TEMPLE_MARRIAGE,
        Temple.TEMPLE_CHILDREN,
        Temple.TEMPLE_MONEY,
        Temple.TEMPLE_ILLNESS,
        Temple.TEMPLE_MOVE,
        Temple.TEMPLE_FRIEND,
        Temple.TEMPLE_CAREER,
        Temple.TEMPLE_HOUSE,
        Temple.TEMPLE_HAPPINESS,
        Temple.TEMPLE_PARENT,
        Temple.TEMPLE_BODY,
    ]);
    static LOOP_TEMPLES = Object.freeze([
        Temple.TEMPLE_DESTINY,
        Temple.TEMPLE_BROTHER,
        Temple.TEMPLE_MARRIAGE,
        Temple.TEMPLE_CHILDREN,
        Temple.TEMPLE_MONEY,
        Temple.TEMPLE_ILLNESS,
        Temple.TEMPLE_MOVE,
        Temple.TEMPLE_FRIEND,
        Temple.TEMPLE_CAREER,
        Temple.TEMPLE_HOUSE,
        Temple.TEMPLE_HAPPINESS,
        Temple.TEMPLE_PARENT,
    ]);
    equals(temple) {
        return this === temple || this.key === temple.key;
    }
}
exports.Temple = Temple;
//# sourceMappingURL=temple.js.map