"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var optimizeGraph_1 = require("./optimizeGraph");
var testGraph_1 = require("../testGraph");
var nouns_1 = require("../nouns");
// import evalGraph from "./evalGraph";
describe('nounify', function () {
    it('should return constants', function () {
        var values = optimizeGraph_1.nounify([0], [{ noun: 'default', value: 4, constant: true }], nouns_1.getNounResolvers(), []);
        expect(values).toEqual([4]);
    });
    it('should return variable injections', function () {
        var values = optimizeGraph_1.nounify([0], [{ noun: 'default', constant: false }], nouns_1.getNounResolvers(), [4]);
        expect(values).toEqual([4]);
        var values2 = optimizeGraph_1.nounify([0], [{ noun: 'default' }], nouns_1.getNounResolvers(), [4]);
        expect(values2).toEqual([4]);
    });
    it('more stuff', function () {
        var values = optimizeGraph_1.nounify([2], [
            { noun: 'default', constant: true, value: 1 },
            { noun: 'default', constant: true, value: 2 },
            { noun: 'default' },
        ], nouns_1.getNounResolvers(), [4]);
        expect(values).toEqual([4]);
    });
});
describe('sum ops', function () {
    test('evalGraph', function () {
        expect(testGraph_1.default.verbs.sum([5, 6], [11])).toBe(0);
        expect(testGraph_1.default.verbs.sum([11], [6, 5])).toBe(0);
        expect(testGraph_1.default.verbs.sum([11, 69], [80])).toBe(0);
        expect(testGraph_1.default.verbs.sum([-20], [-30, 10])).toBe(0);
        expect(optimizeGraph_1.evalGraph(testGraph_1.default, [4])).toBe(-1);
        expect(optimizeGraph_1.evalGraph(testGraph_1.default, [3])).toBe(0);
        expect(optimizeGraph_1.evalGraph(testGraph_1.default, [2])).toBe(1);
        expect(optimizeGraph_1.evalGraph(testGraph_1.default, [1])).toBe(2);
    });
});
describe('graph optimization and evaluation', function () {
    test('optimizeGraph', function () {
        expect(optimizeGraph_1.default(testGraph_1.default).graph.nodes[2].value).toBeCloseTo(3, 2);
    });
});
