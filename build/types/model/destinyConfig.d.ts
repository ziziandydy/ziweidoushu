import { DayTimeGround } from './dayTimeGround';
import { Ground } from './ground';
import { Sky } from './sky';
declare class DestinyConfig {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
    yearSky: Sky;
    yearGround: Ground;
    monthSky: Sky;
    monthGround: Ground;
    daySky: Sky;
    dayGround: Ground;
    bornTimeGround: DayTimeGround;
    configType: ConfigType;
    gender: Gender;
    constructor(params: {
        year: number;
        month: number;
        day: number;
        isLeapMonth: boolean;
        yearSky: Sky;
        yearGround: Ground;
        monthSky: Sky;
        monthGround: Ground;
        daySky: Sky;
        dayGround: Ground;
        bornTimeGround: DayTimeGround;
        configType: ConfigType;
        gender: Gender;
    });
    getLogicalMonth(): number;
    toJSON(): {
        year: number;
        month: number;
        day: number;
        isLeapMonth: boolean;
        yearSky: Sky;
        yearGround: Ground;
        monthSky: Sky;
        monthGround: Ground;
        daySky: Sky;
        dayGround: Ground;
        bornTimeGround: DayTimeGround;
        configType: string;
        gender: string;
    };
    toString(): string;
}
declare enum ConfigType {
    GROUND = "GROUND",
    SKY = "SKY",
    HUMAN = "HUMAN"
}
declare enum Gender {
    M = "M",
    F = "F"
}
export { DestinyConfig, ConfigType, Gender };
