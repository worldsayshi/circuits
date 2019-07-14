
const d3TestGraph2 = {
  nodes: [
    { noun: 'default', constant: true, value: 1, type: 'Var', nodeId: "0" },
    { noun: 'default', constant: true, value: 2, type: 'Var', nodeId: "1" },
    { noun: 'default', constant: false, type: 'Var', nodeId: "2", variableCount: 0 },

    { noun: 'default', constant: true, value: 100, type: 'Var', nodeId: "3" },
    { noun: 'default', constant: false, type: 'Var', nodeId: "4", variableCount: 1 },

    { left: [0, 1], right: [2], verb: 'sum', type: 'Component', nodeId: "5" },
    { left: [3], right: [4], verb: 'sum', type: 'Component', nodeId: "6" },

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
    //
    // // For first component - to Component
    { source: 7, target: 5, type: 'HiddenLink', length: 75 },
    { source: 8, target: 5, type: 'HiddenLink', length: 75 },
    //
    // // For second component - to Vars
    { source: 9, target: 3, type: 'HiddenLink', length: 50 },
    { source: 10, target: 4, type: 'HiddenLink', length: 50 },
    //
    // // For second component - to Component
    { source: 9, target: 6, type: 'HiddenLink', length: 75 },
    { source: 10, target: 6, type: 'HiddenLink', length: 75 },
  ],
};

export default d3TestGraph2;