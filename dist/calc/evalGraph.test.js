"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var evalGraph_1 = require("./evalGraph");
var testGraph_1 = require("../testGraph");
describe('sum ops', function () {
    test('evalGraph', function () {
        expect(testGraph_1.default.verbs.sum([5, 6], [11])).toBe(0);
        expect(testGraph_1.default.verbs.sum([11], [6, 5])).toBe(0);
        expect(testGraph_1.default.verbs.sum([11, 69], [80])).toBe(0);
        expect(testGraph_1.default.verbs.sum([-20], [-30, 10])).toBe(0);
        expect(evalGraph_1.default(testGraph_1.default, [4])).toBe(-1);
        expect(evalGraph_1.default(testGraph_1.default, [3])).toBe(0);
        expect(evalGraph_1.default(testGraph_1.default, [2])).toBe(1);
        expect(evalGraph_1.default(testGraph_1.default, [1])).toBe(2);
    });
});
