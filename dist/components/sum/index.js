"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    img: 'img/thing.svg',
    operation: function (left, right) {
        return left.reduce(function (a, b) { return a + b; }, 0) - right.reduce(function (a, b) { return a + b; }, 0);
    }
};
