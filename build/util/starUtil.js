"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starByKey = exports.starByName = void 0;
const majorStar_1 = require("../model/majorStar");
const minorStar_1 = require("../model/minorStar");
const miniStar_1 = require("../model/miniStar");
const starByName = (name) => {
    const star = majorStar_1.MajorStar.getByName(name) ?? minorStar_1.MinorStar.getByName(name) ?? miniStar_1.MiniStar.getByName(name);
    if (!star) {
        throw new Error('star not found');
    }
    return star;
};
exports.starByName = starByName;
const starByKey = (key) => {
    const star = majorStar_1.MajorStar.getByKey(key) ?? minorStar_1.MinorStar.getByKey(key) ?? miniStar_1.MiniStar.getByKey(key) ?? null;
    if (!star) {
        throw new Error('star not found');
    }
    return star;
};
exports.starByKey = starByKey;
//# sourceMappingURL=starUtil.js.map