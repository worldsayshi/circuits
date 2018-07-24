import toD3 from "./toD3";
import testGraph from "../testGraph2";

const d3TestGraph = {
  nodes: [
    { noun: 'default', constant: true, value: 1, type: 'Var', nodeId: 0 },
    { noun: 'default', constant: true, value: 2, type: 'Var', nodeId: 1 },
    { noun: 'default', type: 'Var', nodeId: 2 },

    { noun: 'default', constant: true, value: 1, type: 'Var', nodeId: 3 },
    { noun: 'default', type: 'Var', nodeId: 4 },

    { left: [0, 1], right: [2], verb: 'sum', type: 'Component' },
    { left: [3], right: [4], verb: 'sum', type: 'Component' },

    { type: 'HiddenNode' },
    { type: 'HiddenNode' },

    { type: 'HiddenNode' },
    { type: 'HiddenNode' },
  ],
  links: [

    // Semantic links
    { source: 0, target: 5 },
    { source: 1, target: 5 },
    { source: 2, target: 5 },

    { source: 3, target: 6 },
    { source: 4, target: 6 },

    // Structural links
    { source: 7, target: 0 },
    { source: 7, target: 1 },
    { source: 8, target: 2 },

    { source: 9, target: 3 },
    { source: 10, target: 4 },
  ],
};

describe('toD3', () => {
  it('should convert to d3 representation', () => {
    const d3Graph = toD3(testGraph.graph);
    expect(d3Graph.nodes).toEqual(d3TestGraph.nodes);
    expect(d3Graph.links).toEqual(d3TestGraph.links);
    expect(d3Graph).toEqual(d3TestGraph);
  });
});