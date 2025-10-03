# fortel-ziweidoushu

紫微斗數排盤 (中州派) Javascript library

**Copyright (c) 2022 Airic Yu | Maintained by iTubai**

-------

## What is it?

This is a Javascript library for Zi Wei Dou Shu creating destiny broad (紫微斗數排盤).

## Which branch(門派) of 紫微斗數 it is?

This library is based on 中州派 .

## What feature is supported?

- Create destiny board with friendly input options. (排盤)
- Check board criteria. (檢查宮位是否存在/會見各星)
- Present board as JSON object.
- Print board as string.

--------

## 🌐 Live Demo

**線上試用**: [Vercel 部署連結](https://ziweidoushu.vercel.app/)

**主要功能**:
- 🔮 完整紫微斗數命盤計算
- 📊 十二宮位星曜配置顯示
- 🎨 現代化響應式介面
- 📱 支援手機、平板、桌面裝置
- 🔍 詳細宮位星曜分析
- 📈 用戶行為追蹤分析

## 📦 Install

```bash
npm i fortel-ziweidoushu
```

## 🎯 專案特色

- ✅ **完整前端介面**: 互動式 HTML/CSS/JavaScript 介面
- ✅ **真實核心計算**: TypeScript 紫微斗數核心庫整合
- ✅ **雲端部署**: Vercel 平台支援
- ✅ **現代化設計**: Tailwind CSS 響應式設計

## 🚀 快速開始

### 本地開發

```bash
# 克隆專案
git clone https://github.com/ziziandydy/ziweidoushu.git
cd ziweidoushu

# 安裝依賴
npm install

# 啟動後端 API 服務器
npm run server

# 啟動前端開發服務器
cd public && python3 -m http.server 8080
```

### 部署到 Vercel

1. Fork 這個 repository
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 新增專案
3. 連接你的 GitHub repository
4. Vercel 會自動部署！

### 🔄 GitHub 自動持續部署

✅ **推送自動觸發部署**
- 每次 `git push origin main` 都會自動重新部署
- **分支策略**: 只有 `main` 分支的推送觸發生產部署
- **預覽部署**: 其他分支推送會創建預覽 URL

✅ **即時更新**
- GitHub 推送 → Webhook 通知 Vercel → 自動構建部署
- 無需手動操作，代碼更新後即可在生產環境看到
- 部署狀態會在 GitHub 上顯示為 check mark

```bash
# 本地開發 → GitHub → Vercel 自動部署流程
git add .
git commit -m "✨ 新功能更新"
git push origin main
# 🚀 Vercel 自動重新部署開始！
```

## 🔧 API 端點

- `POST /api/calculate` - 計算紫微斗數命盤
- `GET /api/health` - API 健康檢查
- `GET /api/status` - API 狀態資訊

## 🏗️ 專案架構

**前端 (Static)**:
- 📁 `public/` - HTML/CSS/JavaScript 靜態檔案
- 📄 `index.html` - 主應用頁面
- 🎨 `favicon.svg` - 專屬品牌圖標
- 🔧 API 整合 - JavaScript 調用後端
- 📊 用戶追蹤 - Groundhog 分析系統

**後端 (Serverless)**:
- 📁 `src/` - TypeScript 紫微斗數核心庫
- 📁 `build/` - 編譯後的 JavaScript 檔案
- 📁 `api/` - Vercel Serverless Functions
  - `calculate.js` - 命盤計算 API
  - `health.js` - 健康檢查 API
  - `status.js` - 狀態查詢 API
- 🖥️ `api-server.js` - 本地開發 API 服務器

---------

## Hello world

### Create board with Lunar date (以農曆參數排盤)

You can use `DestinyConfigBuilder.withlunar` to specify the parameters.
And then use `new DestinyBoard(config)` to build the board.

```javascript
import { DestinyBoard, DestinyConfigBuilder, DayTimeGround, ConfigType, Gender } from 'fortel-ziweidoushu'

// 農曆1952年三月十五日寅時女士
const destinyBoard = new DestinyBoard(
    DestinyConfigBuilder.withlunar({
        year: 1952, // 年
        month: 3, //月
        day: 15, //日
        isLeapMonth: false, // 非潤月
        bornTimeGround: DayTimeGround.getByName('寅時'), // 出生時辰
        configType: ConfigType.SKY, // 天盤, if missing this option, default is 天盤
        gender: Gender.F, // 女士
    }),
)

console.log(destinyBoard.toString())
```

output
```
DestinyBoard {
    config: {"year":1952,"month":3,"day":15,"isLeapMonth":false,"yearSky":"壬","yearGround":"辰","monthSky":"甲","monthGround":"辰","daySky":"乙","dayGround":"酉","bornTimeGround":"寅時","configType":"天盤","gender":"女
"},
    element: 金四局,
    destinyMaster: 廉貞,
    bodyMaster: 文昌,
    startControl: 子,
    cells: [
        Cell {壬子, temples=[夫妻], majorStars=[武曲 1,天府 2], minorStars=[鈴星,擎羊], miniStars=[], miscStars=[官府,白虎,將星], ageRange=[24-33], lifeStage=[衰]},
        Cell {癸丑, temples=[兄弟], majorStars=[太陽 -1,太陰 2], minorStars=[地劫], miniStars=[寡宿,破碎], miscStars=[伏兵,天德,攀鞍], ageRange=[14-23], lifeStage=[帝旺]},
        Cell {壬寅, temples=[命宮], majorStars=[貪狼 0], minorStars=[天馬], miniStars=[天哭,截空,天巫], miscStars=[大耗,弔客,歲驛], ageRange=[4-13], lifeStage=[臨官]},
        Cell {癸卯, temples=[父母], majorStars=[天機 1,巨門 2], minorStars=[天魁], miniStars=[截空,天姚], miscStars=[病符,病符,息神], ageRange=[114-123], lifeStage=[冠帶]},
        Cell {甲辰, temples=[福德], majorStars=[紫微 -1,天相 1], minorStars=[火星], miniStars=[封誥,天月], miscStars=[喜神,太歲,華蓋], ageRange=[104-113], lifeStage=[沐浴]},
        Cell {乙巳, temples=[田宅], majorStars=[天梁 -1], minorStars=[天鉞], miniStars=[天喜,孤辰,劫煞,天空], miscStars=[蜚廉,晦氣,劫煞], ageRange=[94-103], lifeStage=[長生]},
        Cell {丙午, temples=[身宮,事業], majorStars=[七殺 1], minorStars=[文曲,左輔], miniStars=[天福,鳳閣,解神,天才,旬空,蜚廉,八座], miscStars=[奏書,喪門,災煞], ageRange=[84-93], lifeStage=[養]},
        Cell {丁未, temples=[交友], majorStars=[], minorStars=[], miniStars=[旬空,天貴,天使], miscStars=[將軍,貫索,天煞], ageRange=[74-83], lifeStage=[胎]},
        Cell {戊申, temples=[遷移], majorStars=[廉貞 2], minorStars=[文昌,右弼], miniStars=[龍池,台輔,三台], miscStars=[小耗,官符,指背], ageRange=[64-73], lifeStage=[絕]},
        Cell {己酉, temples=[疾厄], majorStars=[], minorStars=[地空], miniStars=[天廚,咸池,月德,恩光,天傷], miscStars=[青龍,小耗,咸池], ageRange=[54-63], lifeStage=[墓]},
        Cell {庚戌, temples=[財帛], majorStars=[破軍 1], minorStars=[陀羅], miniStars=[天官,天虛,天壽,陰煞,解神], miscStars=[力士,歲破,月煞], ageRange=[44-53], lifeStage=[死]},
        Cell {辛亥, temples=[子女], majorStars=[天同 2], minorStars=[祿存], miniStars=[紅鸞,大耗,天刑], miscStars=[博士,龍德,亡神], ageRange=[34-43], lifeStage=[病]}
    ],
    #bornStarDerivativeMap: {"祿":"天梁","權":"紫微","科":"天府","忌":"武曲"}
}
```

### Create board with Solar date (以西曆參數排盤)

use `DestinyConfigBuilder.withSolar` instead of `DestinyConfigBuilder.withlunar` for Solar Calendar date input parameters.

```javascript
// 公曆1952年4月9日寅時女士
const destinyBoard = new DestinyBoard(
    DestinyConfigBuilder.withSolar({
        year: 1952,
        month: 4,
        day: 9,
        bornTimeGround: DayTimeGround.getByName('寅時'),
        configType: ConfigType.SKY,
        gender: Gender.F,
    }),
)
```

### Create board with human text (以文字描述排盤)

The library can parse your reasonable human description text and turn it into the board.

Basically we need such information from text:
- Calendar type (農曆/公曆)
- year
- month (and whether it is leap month)
- day
- Born time hour
- Gender

```javascript
import { DestinyBoard, DestinyConfigBuilder, DayTimeGround, ConfigType, Gender } from 'fortel-ziweidoushu'

// 農曆1952年三月十五日寅時女士
const destinyBoard = new DestinyBoard(DestinyConfigBuilder.withText('農曆1952年三月十五日寅時女士'))


```
-------------


## Criteria

You can use `BoardCriteria` to check broad criteria condition.

### Example - Check Temple having stars

- 判斷兄弟宮是否有太陽, 地劫, 寡宿全部星。
- 判斷夫妻宮是否有武曲, 貪狼, 任意一顆星。

```javascript
import { DestinyBoard, Temple, BoardCriteria, starByName, DestinyConfigBuilder, DayTimeGround, ConfigType, Gender } from 'fortel-ziweidoushu'

// 公曆1952年4月9日寅時出生女士
const destinyBoard = new DestinyBoard(DestinyConfigBuilder.withText('公曆1952年4月9日寅時出生女士'))

console.log(destinyBoard.toString())

console.log(
    new BoardCriteria(destinyBoard).ofTemple(Temple.TEMPLE_BROTHER).hasAllStars([starByName('太陽'), starByName('地劫'), starByName('寡宿')])
)

console.log(
    new BoardCriteria(destinyBoard).ofTemple(Temple.TEMPLE_MARRIAGE).hasAnyStars([starByName('武曲'), starByName('貪狼')])
)
```

#### output
```
DestinyBoard {
    config: {"year":1952,"month":3,"day":15,"isLeapMonth":false,"yearSky":"壬","yearGround":"辰","monthSky":"甲","monthGround":"辰","daySky":"乙","dayGround":"酉","bornTimeGround":"寅時","configType":"天盤","gender":"女
"},
    element: 金四局,
    destinyMaster: 廉貞,
    bodyMaster: 文昌,
    startControl: 子,
    cells: [
        Cell {壬子, temples=[夫妻], majorStars=[武曲 1,天府 2], minorStars=[鈴星,擎羊], miniStars=[], miscStars=[官府,白虎,將星], ageRange=[24-33], lifeStage=[衰]},
        Cell {癸丑, temples=[兄弟], majorStars=[太陽 -1,太陰 2], minorStars=[地劫], miniStars=[寡宿,破碎], miscStars=[伏兵,天德,攀鞍], ageRange=[14-23], lifeStage=[帝旺]},
        ......
    ],
    #bornStarDerivativeMap: {"祿":"天梁","權":"紫微","科":"天府","忌":"武曲"}
}
true
true
```


#### Explain

```javascript
new BoardCriteria(destinyBoard).ofTemple(Temple.TEMPLE_BROTHER)
```
This means building a checking criteria of the broad for target temple TEMPLE_BROTHER (兄弟宮).

```javascript
.hasAllStars([starByName('太陽'), starByName('地劫'), starByName('寡宿')])
```

This means we check for the temple having **ALL stars** 太陽, 地劫, 寡宿.

```javascript
.hasAnyStars([starByName('武曲'), starByName('貪狼')])
```

This means we check for the temple having **ANY ONE OF stars** 武曲, 貪狼.

--------

#### Runtime Context (大運/流年/流月/流日資訊)

(Sorry if it is bad translation.)

After you build the destiny board object, you can then call the "getRuntimContext" method to get the context info.

```javascript
const runtimeContext = destinyBoard.getRuntimContext({
    lunarYear: 2023,
    lunarMonth: 5,
    lunarDay: 1,
    leap: false,
})
```

The type of RuntimeContext is like this:
```
export type RuntimeContext = {
    tenYear: {
        cellGround: Ground | null
        groundStars: Map<Ground, MinorStar[]> | null
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null
    }
    year: {
        cellGround: Ground | null
        groundStars: Map<Ground, MinorStar[]> | null
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null
    }
    month: {
        cellGround: Ground | null
        groundStars: Map<Ground, MinorStar[]> | null
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null
    }
    day: {
        cellGround: Ground | null
        groundStars: Map<Ground, MinorStar[]> | null
        starDerivativeMap: Map<MajorStar | MinorStar, StarDerivative> | null
    }
    yearSky: Sky
    yearGround: Ground
    monthSky: Sky
    monthGround: Ground
    daySky: Sky
    dayGround: Ground
    age: number
    effectiveMonth: number
    tenYearGround: Ground
    tenYearSky: Sky
}
```

At the root level, tenYear is 十年/大運, year is 流年, month is 流月, day is 流日. Other attribites are extra info of the date.

At the second level,

- cellGround : Destiny Temple ground.
- groundStars : Map of Temple ground to star 
- starDerivativeMap : Map of star derivative.
  
中文翻譯這段:
- cellGround : 流X命宮地支
- groundStars : 流X飛星表, key是地支, value是該宮所擁有的飛星
- starDerivativeMap : 流X四化表, key是星, value是化祿/科/權/忌

----

## Maintainer

iTubai - Current maintainer

## Original Author

Airic Yu (Original Author)
- Owner of Myfortel 紫微斗數起盤網站(舊版) ( https://www.myfortel.com/ )
- Owner of Myfortel 紫微斗數起盤網站(新版) ( https://airicyu.github.io/myfortel/ )
- Author of 紫微斗數排盤 library for Java ( https://github.com/airicyu/Fortel )
- Author of 紫微斗數排盤 library for JS ( https://www.npmjs.com/package/fortel-ziweidousju )

## Special Credit

Jea杨 - Thanks for his lunar/solar calendar conversion library ( https://github.com/jjonline/calendar.js )

