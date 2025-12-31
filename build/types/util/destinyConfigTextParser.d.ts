import { Calendar, CalendarType } from '../calendar/calender';
import { DayTimeGround } from '../model/dayTimeGround';
import { ConfigType, Gender } from '../model/destinyConfig';
declare function text2DestinyConfig(input: string, calendar?: Calendar): {
    calendarType: CalendarType | null;
    year: number | null;
    month: number | null;
    day: number | null;
    isLeapMonth: boolean;
    bornTimeGround: DayTimeGround | null;
    hour: number | null;
    minute: number | null;
    gender: Gender | null;
    configType: ConfigType | null;
};
declare const destinyConfigTextParser: {
    parse: typeof text2DestinyConfig;
};
export { destinyConfigTextParser };
