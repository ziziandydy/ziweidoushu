"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinyConfigBuilder = void 0;
const dayTimeGround_1 = require("../model/dayTimeGround");
const destinyConfig_1 = require("../model/destinyConfig");
const defaultCalendar_1 = require("../calendar/defaultCalendar");
const calender_1 = require("../calendar/calender");
const destinyConfigTextParser_1 = require("./destinyConfigTextParser");
class DestinyConfigBuilder {
    static withSolar(params) {
        const { year, month, day, bornTimeHour, configType = destinyConfig_1.ConfigType.SKY, gender } = params;
        let { bornTimeGround, calendar } = params;
        calendar ??= defaultCalendar_1.defaultCalendar;
        const lunarDate = calendar.solar2lunar(year, month, day);
        const { yearSky, yearGround, monthSky, monthGround, daySky, dayGround } = lunarDate;
        if (bornTimeHour !== undefined) {
            bornTimeGround = dayTimeGround_1.DayTimeGround.getByHour(bornTimeHour);
        }
        else if (bornTimeGround === undefined) {
            throw new Error('Cannot find born time ground');
        }
        return new destinyConfig_1.DestinyConfig({
            year: lunarDate.lunarYear,
            month: lunarDate.lunarMonth,
            day: lunarDate.lunarDay,
            isLeapMonth: lunarDate.isLeapMonth,
            yearSky,
            yearGround,
            monthSky,
            monthGround,
            daySky,
            dayGround,
            bornTimeGround,
            configType,
            gender,
        });
    }
    static withlunar(params) {
        const { year, month, day, isLeapMonth = false, bornTimeHour, configType = destinyConfig_1.ConfigType.SKY, gender } = params;
        let { bornTimeGround, calendar } = params;
        calendar ??= defaultCalendar_1.defaultCalendar;
        const calendarResult = calendar.lunarSkyGround(year, month, day, isLeapMonth);
        const { yearSky, yearGround, monthSky, monthGround, daySky, dayGround } = calendarResult;
        if (bornTimeHour !== undefined && !bornTimeGround) {
            bornTimeGround = dayTimeGround_1.DayTimeGround.getByHour(bornTimeHour);
        }
        if (bornTimeGround === undefined) {
            throw new Error('Cannot find born time ground');
        }
        return new destinyConfig_1.DestinyConfig({
            year,
            month,
            day,
            isLeapMonth,
            yearSky,
            yearGround,
            monthSky,
            monthGround,
            daySky,
            dayGround,
            bornTimeGround,
            configType,
            gender,
        });
    }
    static withText(input, calendar = defaultCalendar_1.defaultCalendar) {
        input = input.trim().replaceAll('/s+', ' ');
        const parseResult = destinyConfigTextParser_1.destinyConfigTextParser.parse(input, calendar);
        const { year, month, day, isLeapMonth, bornTimeGround, hour } = parseResult;
        let { calendarType, gender, configType } = parseResult;
        if (calendarType === null) {
            calendarType = calender_1.CalendarType.LUNAR;
        }
        if (gender === null) {
            gender = destinyConfig_1.Gender.M;
        }
        if (configType === null) {
            configType = destinyConfig_1.ConfigType.SKY;
        }
        if (!year || !month || !day || !bornTimeGround) {
            throw new Error('Invalid input');
        }
        if (calendarType === calender_1.CalendarType.LUNAR) {
            return DestinyConfigBuilder.withlunar({
                year,
                month,
                day,
                isLeapMonth,
                bornTimeHour: hour ?? undefined,
                bornTimeGround: bornTimeGround ?? undefined,
                configType,
                gender,
                calendar,
            });
        }
        else {
            return DestinyConfigBuilder.withSolar({
                year,
                month,
                day,
                bornTimeHour: hour ?? undefined,
                bornTimeGround: bornTimeGround ?? undefined,
                configType,
                gender,
                calendar,
            });
        }
    }
}
exports.DestinyConfigBuilder = DestinyConfigBuilder;
//# sourceMappingURL=destinyConfigBuilder.js.map