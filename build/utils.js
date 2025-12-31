"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.str2Uni = exports.intDivide = exports.mod = void 0;
const mod = (a, b) => {
    return ((a % b) + b) % b;
};
exports.mod = mod;
const intDivide = (a, b) => {
    return Math.round((a - mod(a, b)) / b);
};
exports.intDivide = intDivide;
const str2Uni = (str) => {
    let outStr = '';
    for (let i = 0; i < str.length; i++) {
        outStr += '\\u' + str.charCodeAt(i).toString(16);
    }
    return outStr;
};
exports.str2Uni = str2Uni;
//# sourceMappingURL=utils.js.map