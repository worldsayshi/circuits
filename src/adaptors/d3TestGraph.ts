// This graph used to get the wrong layout

const d3TestGraph = {
  "nodes": [
    {"type": "Var", "noun": "default", "constant": true, "value": 1, "nodeId": "0"},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "1", "variableCount": 0},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "2", "variableCount": 1},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "3", "variableCount": 2},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "4", "variableCount": 3},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "5", "variableCount": 4},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "6", "variableCount": 5},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "7", "variableCount": 6},
    {"type": "Var", "noun": "default", "constant": false, "value": 1, "nodeId": "8", "variableCount": 7},
    {"type": "Component", "left": [], "right": [], "verb": "sum", "img": "img/thing.svg", "nodeId": "9"},
    {"type": "Component", "left": [0, 1], "right": [2, 3], "verb": "sum", "img": "img/thing.svg", "nodeId": "10"},
    {"type": "Component", "left": [4, 5, 6, 8], "right": [7], "verb": "sum", "img": "img/thing.svg", "nodeId": "11"},

    {"type": "HiddenNode"},
    {"type": "HiddenNode"},
    {"type": "HiddenNode"},
    {"type": "HiddenNode"},
    {"type": "HiddenNode"},
    {"type": "HiddenNode"}
    ],

  "links": [
    {"source": 0, "target": 10},
    {"source": 1, "target": 10},
    {"source": 2, "target": 10},
    {"source": 3, "target": 10},
    {"source": 4, "target": 11},
    {"source": 5, "target": 11},
    {"source": 6, "target": 11},
    {"source": 8, "target": 11},
    {"source": 7, "target": 11},

    {"source": 11, "target": 8, "type": "HiddenLink", "length": 75},
    {"source": 12, "target": 8, "type": "HiddenLink", "length": 75},
    {"source": 13, "target": 0, "type": "HiddenLink", "length": 50},
    {"source": 13, "target": 1, "type": "HiddenLink", "length": 50},
    {"source": 14, "target": 2, "type": "HiddenLink", "length": 50},
    {"source": 14, "target": 3, "type": "HiddenLink", "length": 50},
    {"source": 13, "target": 9, "type": "HiddenLink", "length": 75},
    {"source": 14, "target": 9, "type": "HiddenLink", "length": 75},
    {"source": 15, "target": 4, "type": "HiddenLink", "length": 50},
    {"source": 15, "target": 5, "type": "HiddenLink", "length": 50},
    {"source": 15, "target": 6, "type": "HiddenLink", "length": 50},
    {"source": 15, "target": 8, "type": "HiddenLink", "length": 50},
    {"source": 16, "target": 7, "type": "HiddenLink", "length": 50},
    {"source": 15, "target": 10, "type": "HiddenLink", "length": 75},
    {"source": 16, "target": 10, "type": "HiddenLink", "length": 75}
    ]
};

export default d3TestGraph;