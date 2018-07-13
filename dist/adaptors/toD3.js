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
function createD3Links(components, numberOfVars) {
    var links = [];
    for (var _i = 0, _a = components.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], index = _b[0], component = _b[1];
        for (var _c = 0, _d = component.left.concat(component.right); _c < _d.length; _c++) {
            var nodeId = _d[_c];
            links.push({ source: nodeId, target: numberOfVars + index });
        }
    }
    return links;
}
function createD3Groups(components, numberOfVars) {
    var groups = [];
    var groupCount = 0;
    for (var _i = 0, _a = components.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], index = _b[0], component = _b[1];
        groups.push({ leaves: component.left });
        groups.push({ leaves: component.right });
        groups.push({ groups: [groupCount, groupCount + 1], leaves: [numberOfVars + index] });
        groupCount += 3;
    }
    return groups;
}
function toD3(_a) {
    var nodes = _a.nodes, components = _a.components;
    var d3Nodes = nodes.map(function (node, index) { return (__assign({}, node, { type: 'Var', nodeId: index })); }).concat(components.map(function (component) { return (__assign({}, component, { type: 'Component' })); }));
    var d3Links = createD3Links(components, nodes.length);
    var d3Groups = createD3Groups(components, nodes.length);
    return { nodes: d3Nodes, links: d3Links, groups: d3Groups };
}
exports.default = toD3;
