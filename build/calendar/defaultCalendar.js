"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCalendar = void 0;
const calendar_js_1 = require("./jjonline/js-calendar-converter/calendar.js");
const ground_1 = require("../model/ground");
const sky_1 = require("../model/sky");
const defaultCalendar = {
    solar2lunar: function (solarYear, solarMonth, solarDay) {
        const result = calendar_js_1.calendar.solar2lunar(solarYear, solarMonth, solarDay);
        if (this.solarMonthDays(solarYear, solarMonth) < solarDay) {
            throw new Error('Invalid date');
        }
        if (result !== -1) {
            return {
                lunarYear: result.lYear,
                lunarMonth: result.lMonth,
                lunarDay: result.lDay,
                isLeapMonth: result.isLeap,
                yearSky: sky_1.Sky.getByName(result.gzYear[0]),
                yearGround: ground_1.Ground.getByName(result.gzYear[1]),
                monthSky: sky_1.Sky.getByName(result.gzMonth[0]),
                monthGround: ground_1.Ground.getByName(result.gzMonth[1]),
                daySky: sky_1.Sky.getByName(result.gzDay[0]),
                dayGround: ground_1.Ground.getByName(result.gzDay[1]),
            };
        }
        throw new Error('Invalid date');
    },
    lunar2solar: function (lunarYear, lunarMonth, lunarDay, isLeapMonth) {
        if (this.lunarMonthDays(lunarYear, lunarMonth, isLeapMonth) < lunarDay) {
            throw new Error('Invalid date');
        }
        const result = calendar_js_1.calendar.lunar2solar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
        if (result !== -1) {
            return {
                solarYear: result.cYear,
                solarMonth: result.cMonth,
                solarDay: result.cDay,
            };
        }
        throw new Error('Invalid date');
    },
    lunarSkyGround: function (lunarYear, lunarMonth, lunarDay, isLeapMonth) {
        const result = calendar_js_1.calendar.lunar2solar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
        if (result !== -1) {
            return {
                yearSky: sky_1.Sky.getByName(result.gzYear[0]),
                yearGround: ground_1.Ground.getByName(result.gzYear[1]),
                monthSky: sky_1.Sky.getByName(result.gzMonth[0]),
                monthGround: ground_1.Ground.getByName(result.gzMonth[1]),
                daySky: sky_1.Sky.getByName(result.gzDay[0]),
                dayGround: ground_1.Ground.getByName(result.gzDay[1]),
            };
        }
        throw new Error('Invalid date');
    },
    lunarMonthDays: function (year, month, leap) {
        if (!leap) {
            return calendar_js_1.calendar.monthDays(year, month);
        }
        else {
            if (calendar_js_1.calendar.leapMonth(year) != month) {
                throw new Error('Invalid date');
            }
            return calendar_js_1.calendar.leapDays(year);
        }
    },
    solarMonthDays: function (year, month) {
        return calendar_js_1.calendar.solarDays(year, month);
    },
};
exports.defaultCalendar = defaultCalendar;
//# sourceMappingURL=defaultCalendar.js.map