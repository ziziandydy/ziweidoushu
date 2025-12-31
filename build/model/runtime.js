"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runtime = void 0;
const minorStar_1 = require("./minorStar");
const starDerivative_1 = require("./starDerivative");
class Runtime {
    static getRuntimeStars() {
        return [
            minorStar_1.MinorStar.MINOR_STAR_EARN,
            minorStar_1.MinorStar.MINOR_STAR_BENEFACTOR_MAN,
            minorStar_1.MinorStar.MINOR_STAR_BENEFACTOR_WOMAN,
            minorStar_1.MinorStar.MINOR_STAR_CLEVER,
            minorStar_1.MinorStar.MINOR_STAR_SKILL,
            minorStar_1.MinorStar.MINOR_STAR_COMPETITION,
            minorStar_1.MinorStar.MINOR_STAR_HINDRANCE,
        ];
    }
    static getRuntimeStarsLocation(sky) {
        const runtimeStarsLocation = new Map();
        for (const minorStar of this.getRuntimeStars()) {
            runtimeStarsLocation.set(minorStar, minorStar_1.MinorStar.minorStarPlacers.get(minorStar).evalRuntimeGround(sky));
        }
        return runtimeStarsLocation;
    }
    static getRuntimeLocationStars(sky) {
        const runtimeLocationStars = new Map();
        for (const minorStar of this.getRuntimeStars()) {
            const ground = minorStar_1.MinorStar.minorStarPlacers.get(minorStar).evalRuntimeGround(sky);
            if (!runtimeLocationStars.has(ground)) {
                runtimeLocationStars.set(ground, [minorStar]);
            }
            else {
                runtimeLocationStars.get(ground)?.push(minorStar);
            }
        }
        return runtimeLocationStars;
    }
    static getDerivativeMapOf(sky) {
        const starDerivativeMap = new Map();
        starDerivativeMap.set(starDerivative_1.StarDerivative.WEALTHINESS, starDerivative_1.StarDerivative.getWealthinessStar(sky));
        starDerivativeMap.set(starDerivative_1.StarDerivative.POWER, starDerivative_1.StarDerivative.getPowerStar(sky));
        starDerivativeMap.set(starDerivative_1.StarDerivative.FAME, starDerivative_1.StarDerivative.getFameStar(sky));
        starDerivativeMap.set(starDerivative_1.StarDerivative.PROBLEM, starDerivative_1.StarDerivative.getProblemStar(sky));
        return starDerivativeMap;
    }
    static getStarToDerivativeMapOf(sky) {
        const starDerivativeMap = new Map();
        starDerivativeMap.set(starDerivative_1.StarDerivative.getWealthinessStar(sky), starDerivative_1.StarDerivative.WEALTHINESS);
        starDerivativeMap.set(starDerivative_1.StarDerivative.getPowerStar(sky), starDerivative_1.StarDerivative.POWER);
        starDerivativeMap.set(starDerivative_1.StarDerivative.getFameStar(sky), starDerivative_1.StarDerivative.FAME);
        starDerivativeMap.set(starDerivative_1.StarDerivative.getProblemStar(sky), starDerivative_1.StarDerivative.PROBLEM);
        return starDerivativeMap;
    }
    static getDerivativeOf(starDerivative, sky) {
        if (starDerivative_1.StarDerivative.WEALTHINESS.euqals(starDerivative)) {
            return starDerivative_1.StarDerivative.getWealthinessStar(sky);
        }
        else if (starDerivative_1.StarDerivative.POWER.euqals(starDerivative)) {
            return starDerivative_1.StarDerivative.getPowerStar(sky);
        }
        else if (starDerivative_1.StarDerivative.FAME.euqals(starDerivative)) {
            return starDerivative_1.StarDerivative.getFameStar(sky);
        }
        else if (starDerivative_1.StarDerivative.PROBLEM.euqals(starDerivative)) {
            return starDerivative_1.StarDerivative.getProblemStar(sky);
        }
        else {
            throw new Error('Cannot find Star Derivative');
        }
    }
}
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map