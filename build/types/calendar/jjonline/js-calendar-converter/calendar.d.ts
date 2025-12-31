export namespace calendar {
    let lunarInfo: number[];
    let solarMonth: number[];
    let Gan: string[];
    let Zhi: string[];
    let Animals: string[];
    let festival: {
        '1-1': {
            title: string;
        };
        '2-14': {
            title: string;
        };
        '5-1': {
            title: string;
        };
        '5-4': {
            title: string;
        };
        '6-1': {
            title: string;
        };
        '9-10': {
            title: string;
        };
        '10-1': {
            title: string;
        };
        '12-25': {
            title: string;
        };
        '3-8': {
            title: string;
        };
        '3-12': {
            title: string;
        };
        '4-1': {
            title: string;
        };
        '5-12': {
            title: string;
        };
        '7-1': {
            title: string;
        };
        '8-1': {
            title: string;
        };
        '12-24': {
            title: string;
        };
    };
    let lFestival: {
        '12-30': {
            title: string;
        };
        '1-1': {
            title: string;
        };
        '1-15': {
            title: string;
        };
        '2-2': {
            title: string;
        };
        '5-5': {
            title: string;
        };
        '7-7': {
            title: string;
        };
        '7-15': {
            title: string;
        };
        '8-15': {
            title: string;
        };
        '9-9': {
            title: string;
        };
        '10-1': {
            title: string;
        };
        '10-15': {
            title: string;
        };
        '12-8': {
            title: string;
        };
        '12-23': {
            title: string;
        };
        '12-24': {
            title: string;
        };
    };
    /**
     * 返回默认定义的阳历节日
     */
    function getFestival(): {
        '1-1': {
            title: string;
        };
        '2-14': {
            title: string;
        };
        '5-1': {
            title: string;
        };
        '5-4': {
            title: string;
        };
        '6-1': {
            title: string;
        };
        '9-10': {
            title: string;
        };
        '10-1': {
            title: string;
        };
        '12-25': {
            title: string;
        };
        '3-8': {
            title: string;
        };
        '3-12': {
            title: string;
        };
        '4-1': {
            title: string;
        };
        '5-12': {
            title: string;
        };
        '7-1': {
            title: string;
        };
        '8-1': {
            title: string;
        };
        '12-24': {
            title: string;
        };
    };
    /**
     * 返回默认定义的内容里节日
     */
    function getLunarFestival(): {
        '12-30': {
            title: string;
        };
        '1-1': {
            title: string;
        };
        '1-15': {
            title: string;
        };
        '2-2': {
            title: string;
        };
        '5-5': {
            title: string;
        };
        '7-7': {
            title: string;
        };
        '7-15': {
            title: string;
        };
        '8-15': {
            title: string;
        };
        '9-9': {
            title: string;
        };
        '10-1': {
            title: string;
        };
        '10-15': {
            title: string;
        };
        '12-8': {
            title: string;
        };
        '12-23': {
            title: string;
        };
        '12-24': {
            title: string;
        };
    };
    /**
     *
     * @param param {Object} 按照festival的格式输入数据，设置阳历节日
     */
    function setFestival(param?: any): void;
    /**
     *
     * @param param {Object} 按照lFestival的格式输入数据，设置农历节日
     */
    function setLunarFestival(param?: any): void;
    let solarTerm: string[];
    let sTermInfo: string[];
    let nStr1: string[];
    let nStr2: string[];
    let nStr3: string[];
    function lYearDays(y: any): number;
    function leapMonth(y: any): number;
    function leapDays(y: any): 0 | 30 | 29;
    function monthDays(y: any, m: any): -1 | 30 | 29;
    function solarDays(y: any, m: any): number;
    function toGanZhiYear(lYear: any): string;
    function toAstro(cMonth: any, cDay: any): string;
    function toGanZhi(offset: any): string;
    function getTerm(y: any, n: any): number;
    function toChinaMonth(m: any): string | -1;
    function toChinaDay(d: any): string;
    function getAnimal(y: any): string;
    function solar2lunar(yPara: any, mPara: any, dPara: any): -1 | {
        date: string;
        lunarDate: string;
        festival: any;
        lunarFestival: any;
        lYear: number;
        lMonth: number;
        lDay: number;
        Animal: string;
        IMonthCn: string;
        IDayCn: string;
        cYear: number;
        cMonth: number;
        cDay: number;
        gzYear: string;
        gzMonth: string;
        gzDay: string;
        isToday: boolean;
        isLeap: boolean;
        nWeek: number;
        ncWeek: string;
        isTerm: boolean;
        Term: string | null;
        astro: string;
    };
    function lunar2solar(y: any, m: any, d: any, isLeapMonth: any): -1 | {
        date: string;
        lunarDate: string;
        festival: any;
        lunarFestival: any;
        lYear: number;
        lMonth: number;
        lDay: number;
        Animal: string;
        IMonthCn: string;
        IDayCn: string;
        cYear: number;
        cMonth: number;
        cDay: number;
        gzYear: string;
        gzMonth: string;
        gzDay: string;
        isToday: boolean;
        isLeap: boolean;
        nWeek: number;
        ncWeek: string;
        isTerm: boolean;
        Term: string | null;
        astro: string;
    };
}
