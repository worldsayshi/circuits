"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sum_1 = require("./sum");
function getVerbData() {
    return {
        sum: {
            img: sum_1.default.img,
        },
    };
}
exports.getVerbData = getVerbData;
function getVerbResolvers() {
    return {
        sum: sum_1.default.operation,
    };
}
exports.getVerbResolvers = getVerbResolvers;
