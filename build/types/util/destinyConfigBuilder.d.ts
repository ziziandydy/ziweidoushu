import { DayTimeGround } from '../model/dayTimeGround';
import { ConfigType, DestinyConfig, Gender } from '../model/destinyConfig';
import { Calendar } from '../calendar/calender';
export declare class DestinyConfigBuilder {
    static withSolar(params: {
        year: number;
        month: number;
        day: number;
        bornTimeHour?: number;
        bornTimeGround?: DayTimeGround;
        configType: ConfigType;
        gender: Gender;
        calendar?: Calendar;
    }): DestinyConfig;
    static withlunar(params: {
        year: number;
        month: number;
        day: number;
        isLeapMonth?: boolean;
        bornTimeHour?: number;
        bornTimeGround?: DayTimeGround;
        configType: ConfigType;
        gender: Gender;
        calendar?: Calendar;
    }): DestinyConfig;
    static withText(input: string, calendar?: Calendar): DestinyConfig;
}
