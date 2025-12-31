import { Ground } from './ground';
import { MajorStar } from './majorStar';
import { MinorStar } from './minorStar';
import { Sky } from './sky';
import { StarDerivative } from './starDerivative';
declare class Runtime {
    static getRuntimeStars(): Readonly<MinorStar>[];
    static getRuntimeStarsLocation(sky: Sky): Map<MinorStar, Ground>;
    static getRuntimeLocationStars(sky: Sky): Map<Ground, MinorStar[]>;
    static getDerivativeMapOf(sky: Sky): Map<StarDerivative, MajorStar | MinorStar>;
    static getStarToDerivativeMapOf(sky: Sky): Map<MajorStar | MinorStar, StarDerivative>;
    static getDerivativeOf(starDerivative: StarDerivative, sky: Sky): MajorStar | MinorStar;
}
export { Runtime };
