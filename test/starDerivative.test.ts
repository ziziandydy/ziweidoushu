import { StarDerivative } from '../src/model/starDerivative'
import { Sky } from '../src/model/sky'

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const names = (fn: (sky: Sky) => { displayName: string }) =>
    STEMS.map((_, i) => fn(Sky.get(i)).displayName)

// 中州派（王亭之）四化表，網站排盤、AI 解盤、部落格、知識庫共用同一份
describe('four transformations table (Zhongzhou school)', () => {
    it('化祿', () => {
        expect(names(StarDerivative.getWealthinessStar)).toEqual(
            ['廉貞', '天機', '天同', '太陰', '貪狼', '武曲', '太陽', '巨門', '天梁', '破軍'])
    })
    it('化權', () => {
        expect(names(StarDerivative.getPowerStar)).toEqual(
            ['破軍', '天梁', '天機', '天同', '太陰', '貪狼', '武曲', '太陽', '紫微', '巨門'])
    })
    it('化科：戊右弼、庚太陰、壬左輔', () => {
        expect(names(StarDerivative.getFameStar)).toEqual(
            ['武曲', '紫微', '文昌', '天機', '右弼', '天梁', '太陰', '文曲', '左輔', '太陰'])
    })
    it('化忌', () => {
        expect(names(StarDerivative.getProblemStar)).toEqual(
            ['太陽', '太陰', '廉貞', '巨門', '天機', '文曲', '天同', '文昌', '武曲', '貪狼'])
    })
})
