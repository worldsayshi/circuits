"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fmin_1 = require("fmin");
// import evalGraph from './evalGraph';
// Turn nodes into values
function nounify(nodeIds, nodes, nouns, x) {
    return nodeIds.map(function (nodeId, index) {
        if (typeof nodeId === 'object') {
            throw new Error('nodeId should not be an object');
        }
        if (!nodes[nodeId]) {
            throw new Error("Missing node: " + nodeId);
        }
        var node = nodes[nodeId];
        return nouns[node.noun](node, index, x);
    });
}
exports.nounify = nounify;
function getInitialVariableValues(nodes) {
    return nodes
        .filter(function (_a) {
        var value = _a.value, _b = _a.constant, constant = _b === void 0 ? false : _b;
        return !constant;
    })
        .map(function (_a) {
        var _b = _a.value, value = _b === void 0 ? 100 : _b;
        return value;
    });
}
function evalGraph(_a, x) {
    var _b = _a.graph, nodes = _b.nodes, components = _b.components, nouns = _a.nouns, verbs = _a.verbs;
    return components.reduce(function (acc, _a) {
        var left = _a.left, right = _a.right, verb = _a.verb;
        var leftValues = nounify(left, nodes, nouns, x);
        var rightValues = nounify(right, nodes, nouns, x);
        return acc + verbs[verb](leftValues, rightValues);
    }, 0);
}
exports.evalGraph = evalGraph;
function insertValues(graph, values) {
    var input = values.slice();
    return __assign({}, graph, { nodes: graph.nodes.map(function (node) {
            if (!node.constant) {
                var newValue = input[0], rest = input.slice(1);
                input = rest;
                return __assign({}, node, { value: newValue });
            }
            return node;
        }) });
}
function optimizeGraph(graphContext) {
    var initialValues = getInitialVariableValues(graphContext.graph.nodes);
    var optimization = fmin_1.nelderMead(function (x) {
        var sum = evalGraph(graphContext, x);
        return Math.abs(sum);
    }, initialValues);
    var values = optimization.x.map(function (v) { return Math.round(v * 100) / 100; });
    var optimizedGraph = insertValues(graphContext.graph, values);
    return __assign({}, graphContext, { graph: optimizedGraph });
}
exports.default = optimizeGraph;
;
