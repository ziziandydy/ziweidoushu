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
exports.DAY_TIME_GROUNDS = exports.DayTimeGround = void 0;
const ground_1 = require("./ground");
const utils_1 = require("./../utils");
const util = __importStar(require("util"));
class DayTimeGround {
    index;
    displayName;
    ground;
    hourStart;
    hourEnd;
    constructor(index, displayName, ground, hourStart, hourEnd) {
        this.index = index;
        this.displayName = displayName;
        this.ground = ground;
        this.hourStart = hourStart;
        this.hourEnd = hourEnd;
    }
    toJSON() {
        return this.displayName;
    }
    toString() {
        return this.displayName;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-vars
    [util.inspect.custom](depth, opts) {
        return this.toString();
    }
    static get(i) {
        return DAY_TIME_GROUNDS[(0, utils_1.mod)(i, DAY_TIME_GROUNDS.length)];
    }
    static getByName(name) {
        const target = DAY_TIME_GROUNDS.filter((dayTimeGround) => dayTimeGround.displayName === name)[0];
        if (target) {
            return target;
        }
        else {
            throw new Error('Not found');
        }
    }
    static getByStartHour(hour) {
        const target = DAY_TIME_GROUNDS.filter((dayTimeGround) => dayTimeGround.hourStart === hour)[0];
        if (target) {
            return target;
        }
        else {
            throw new Error('Not found');
        }
    }
    static getByHour(hour) {
        const target = DAY_TIME_GROUNDS.filter((dayTimeGround) => dayTimeGround.hourStart <= hour && hour < dayTimeGround.hourEnd)[0];
        if (target) {
            return target;
        }
        else {
            throw new Error('Not found');
        }
    }
    static values() {
        return DAY_TIME_GROUNDS;
    }
}
exports.DayTimeGround = DayTimeGround;
const DAY_TIME_GROUNDS = Object.freeze([
    Object.freeze(new DayTimeGround(0, '早子時', ground_1.Ground.get(0), 0, 1)),
    ...ground_1.Ground.GROUNDS.slice(1).map((ground) => {
        const i = ground.index;
        return Object.freeze(new DayTimeGround(i, ground.displayName + '時', ground, -1 + i * 2, 1 + i * 2));
    }),
    Object.freeze(new DayTimeGround(12, '夜子時', ground_1.Ground.get(0), 23, 24)),
]);
exports.DAY_TIME_GROUNDS = DAY_TIME_GROUNDS;
//# sourceMappingURL=dayTimeGround.js.map