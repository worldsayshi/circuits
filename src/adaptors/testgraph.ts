import Graph from "../model/types/graph";

const testgraph: Graph = {
  "nodes": {
    "0": {"noun": "default", "constant": true, "value": 1, "type": "Var"},
    "1": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "2": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "3": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "4": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "5": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "6": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "7": {"noun": "default", "constant": false, "value": 1, "type": "Var"},
    "8": {"noun": "default", "constant": false, "value": 1, "type": "Var"},

    "9": {"left": [], "right": [], "verb": "sum", "type": "Component", "img": "img/thing.svg"},

    "10": {"left": [0, 1], "right": [2, 3], "verb": "sum", "type": "Component", "img": "img/thing.svg"},

    "11": {"left": [4, 5, 6, 8], "right": [7], "verb": "sum", "type": "Component", "img": "img/thing.svg"}
  }
};

export default testgraph;