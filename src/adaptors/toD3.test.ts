import toD3 from "./toD3";
import testGraph2 from "../testGraph2";

const d3TestGraph = {
  nodes: [
    { noun: 'default', constant: true, value: 1, type: 'Var', nodeId: 0 },
    { noun: 'default', constant: true, value: 2, type: 'Var', nodeId: 1 },
    { noun: 'default', constant: false, type: 'Var', nodeId: 2 },

    { noun: 'default', constant: true, value: 100, type: 'Var', nodeId: 3 },
    { noun: 'default', constant: false, type: 'Var', nodeId: 4 },

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

    /* Structural links */
    // For first component - to Vars
    { source: 7, target: 0, type: 'HiddenLink', length: 50 },
    { source: 7, target: 1, type: 'HiddenLink', length: 50 },
    { source: 8, target: 2, type: 'HiddenLink', length: 50 },

    // For first component - to Component
    { source: 7, target: 5, type: 'HiddenLink', length: 75 },
    { source: 8, target: 5, type: 'HiddenLink', length: 75 },

    // For second component - to Vars
    { source: 9, target: 3, type: 'HiddenLink', length: 50 },
    { source: 10, target: 4, type: 'HiddenLink', length: 50 },

    // For second component - to Component
    { source: 9, target: 6, type: 'HiddenLink', length: 75 },
    { source: 10, target: 6, type: 'HiddenLink', length: 75 },
  ],
};

describe('toD3', () => {
  it('should convert to d3 representation', () => {
    const d3Graph = toD3(testGraph2.graph);
    expect(d3Graph.nodes).toEqual(d3TestGraph.nodes);
    expect(d3Graph.links).toEqual(d3TestGraph.links);
    expect(d3Graph).toEqual(d3TestGraph);
  });
});