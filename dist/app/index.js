"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCore_1 = require("../calc/createCore");
// import toD3 from "../adaptors/toD3";
// import update from './render/update';
var View_1 = require("./View");
function initCore() {
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
    return createCore_1.default({ graph: graph });
}
function app() {
    var core = initCore();
    var view = new View_1.default(core);
    window.optimize = function () { return core.dispatch({ type: 'OPTIMIZE' }); };
}
exports.default = app;
;
