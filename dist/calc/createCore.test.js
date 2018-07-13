"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCore_1 = require("./createCore");
describe('createCore', function () {
    it('should return stored graph', function () {
        var graph = { nodes: [], components: [] };
        var core = createCore_1.default({ graph: graph });
        var graph2 = core.getState();
        expect(graph).toEqual(graph2);
    });
    it('should call subscription sometimes', function (done) {
        var graph = { nodes: [], components: [] };
        var core = createCore_1.default({ graph: graph });
        core.subscribe(function () {
            var graph2 = core.getState();
            expect(graph).toEqual(graph2);
            done();
        });
        core.dispatch({ type: 'NOOP' });
    });
    it('should optimize the graph', function (done) {
        var graph = { nodes: [
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default' }
            ],
            components: [
                { left: [0], right: [1], verb: 'sum' },
            ] };
        var core = createCore_1.default({ graph: graph });
        core.subscribe(function () {
            var graph2 = core.getState();
            expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
            done();
        });
        core.dispatch({ type: 'OPTIMIZE' });
    });
    it('should optimize graph 2', function (done) {
        var graph = { nodes: [
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
                { noun: 'default', constant: true, value: 1 },
            ],
            components: [
                { left: [0, 1], right: [2, 3], verb: 'sum' },
                { left: [4, 5, 6, 8], right: [7], verb: 'sum' },
            ] };
        var core = createCore_1.default({ graph: graph });
        core.subscribe(function () {
            var graph2 = core.getState();
            expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
            done();
        });
        core.dispatch({ type: 'OPTIMIZE' });
    });
});
