"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toD3_1 = require("./toD3");
var testGraph_1 = require("../testGraph");
var d3TestGraph = {
    nodes: [
        { noun: 'default', constant: true, value: 1, type: 'Var', nodeId: 0 },
        { noun: 'default', constant: true, value: 2, type: 'Var', nodeId: 1 },
        { noun: 'default', type: 'Var', nodeId: 2 },
        { left: [0, 1], right: [2], verb: 'sum', type: 'Component' }
    ],
    links: [
        { source: 0, target: 3 },
        { source: 1, target: 3 },
        { source: 2, target: 3 },
    ],
    groups: [
        { leaves: [0, 1] },
        { leaves: [2] },
        { groups: [0, 1], leaves: [3] },
    ]
};
describe('toD3', function () {
    it('should convert to d3 representation', function () {
        var d3Graph = toD3_1.default(testGraph_1.default.graph);
        expect(d3Graph.nodes).toEqual(d3TestGraph.nodes);
        expect(d3Graph.links).toEqual(d3TestGraph.links);
        expect(d3Graph.groups).toEqual(d3TestGraph.groups);
        expect(d3Graph).toEqual(d3TestGraph);
    });
});
