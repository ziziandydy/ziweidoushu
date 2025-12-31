"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.ConfigType = exports.DestinyConfig = void 0;
class DestinyConfig {
    year;
    month;
    day;
    isLeapMonth;
    yearSky;
    yearGround;
    monthSky;
    monthGround;
    daySky;
    dayGround;
    bornTimeGround;
    configType;
    gender;
    constructor(params) {
        const { year, month, day, isLeapMonth, yearSky, yearGround, monthSky, monthGround, daySky, dayGround, bornTimeGround, configType, gender } = params;
        this.year = year;
        this.month = month;
        this.day = day;
        this.isLeapMonth = isLeapMonth;
        this.yearSky = yearSky;
        this.yearGround = yearGround;
        this.monthSky = monthSky;
        this.monthGround = monthGround;
        this.daySky = daySky;
        this.dayGround = dayGround;
        this.bornTimeGround = bornTimeGround;
        this.configType = configType;
        this.gender = gender;
    }
    getLogicalMonth() {
        if (this.isLeapMonth && this.day > 15) {
            return this.month + 1;
        }
        else {
            return this.month;
        }
    }
    toJSON() {
        return {
            year: this.year,
            month: this.month,
            day: this.day,
            isLeapMonth: this.isLeapMonth,
            yearSky: this.yearSky,
            yearGround: this.yearGround,
            monthSky: this.monthSky,
            monthGround: this.monthGround,
            daySky: this.daySky,
            dayGround: this.dayGround,
            bornTimeGround: this.bornTimeGround,
            configType: configTypeDisplayName[this.configType],
            gender: genderDisplayName[this.gender],
        };
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.DestinyConfig = DestinyConfig;
var ConfigType;
(function (ConfigType) {
    ConfigType["GROUND"] = "GROUND";
    ConfigType["SKY"] = "SKY";
    ConfigType["HUMAN"] = "HUMAN";
})(ConfigType || (exports.ConfigType = ConfigType = {}));
const configTypeDisplayName = {
    GROUND: '地盤',
    SKY: '天盤',
    HUMAN: '人盤',
};
var Gender;
(function (Gender) {
    Gender["M"] = "M";
    Gender["F"] = "F";
})(Gender || (exports.Gender = Gender = {}));
const genderDisplayName = {
    M: '男',
    F: '女',
};
//# sourceMappingURL=destinyConfig.js.map