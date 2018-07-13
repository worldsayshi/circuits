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
var redux_1 = require("redux");
var components_1 = require("../components");
var nouns_1 = require("../nouns");
var optimizeGraph_1 = require("./optimizeGraph");
function createReducer(_a) {
    var nouns = _a.nouns, verbs = _a.verbs;
    return function (graph, action) {
        if (graph === void 0) { graph = { nodes: [], components: [] }; }
        switch (action.type) {
            case 'OPTIMIZE':
                var newGraph = optimizeGraph_1.default({ graph: graph, nouns: nouns, verbs: verbs }).graph;
                return newGraph;
            default:
                return graph;
        }
    };
}
function attachDefaultData(_a, defaultVerbData) {
    var nodes = _a.nodes, components = _a.components;
    return {
        nodes: nodes,
        components: components.map(function (component) { return (__assign({}, component, defaultVerbData[component.verb])); }),
    };
}
// Stateful core
function createCore(_a) {
    var graph = _a.graph, _b = _a.nouns, nouns = _b === void 0 ? {} : _b, _c = _a.verbs, verbs = _c === void 0 ? {} : _c;
    return redux_1.createStore(createReducer({
        nouns: __assign({}, nouns_1.getNounResolvers(), nouns),
        verbs: __assign({}, components_1.getVerbResolvers(), verbs),
    }), attachDefaultData(graph, components_1.getVerbData()));
}
exports.default = createCore;
