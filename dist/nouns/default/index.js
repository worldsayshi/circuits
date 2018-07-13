"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getNoun: function (_a, index, x) {
        var value = _a.value, _b = _a.constant, constant = _b === void 0 ? false : _b;
        if (value === undefined && constant) {
            throw new Error("A constant must not be undefined, see node " + index);
        }
        if (x[index] === 'undefined' || constant) {
            return value;
        }
        return x[index];
    }
};
