"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Turn nodes into values
function nounify(nodes, nouns, x) {
    return nodes.map(function (node, index) { return nouns[node.noun](node, index, x); });
}
function evalGraph(_a, x) {
    var _b = _a.graph, nodes = _b.nodes, components = _b.components, nouns = _a.nouns, verbs = _a.verbs;
    return components.reduce(function (acc, _a) {
        var left = _a.left, right = _a.right, verb = _a.verb;
        var leftValues = nounify(left.map(function (i) { return nodes[i]; }), nouns, x);
        var rightValues = nounify(right.map(function (i) { return nodes[i]; }), nouns, x);
        return acc + verbs[verb](leftValues, rightValues);
    }, 0);
}
exports.default = evalGraph;
