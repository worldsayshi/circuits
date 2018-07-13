"use strict";
// It's a test graph with evaluation context
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    graph: {
        nodes: [
            { noun: 'default', constant: true, value: 1 },
            { noun: 'default', constant: true, value: 2 },
            { noun: 'default' },
        ],
        components: [
            { left: [0, 1], right: [2], verb: 'sum' }
        ],
    },
    nouns: {
        default: function (_a, index, x) {
            var value = _a.value;
            if (value === undefined) {
                return x[index];
            }
            return value;
        }
    },
    verbs: {
        sum: function (left, right) {
            return left.reduce(function (a, b) { return a + b; }, 0) - right.reduce(function (a, b) { return a + b; }, 0);
        },
    },
};
