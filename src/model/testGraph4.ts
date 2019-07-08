
// It's a test graph with evaluation context
// This is the sugared version of testGraph3, no intermediate variable between components
// TODO support this

import {getNounResolvers} from "./nouns/index";
import {getVerbResolvers} from "./components/index";
import GraphContext from "./graphContext";

const graphContext : GraphContext = {
  graph: {
    nodes: {
      0: { noun: 'default', constant: true, value: 1, type: 'Var' },
      1: { noun: 'default', constant: true, value: 2, type: 'Var' },
      2: { noun: 'default', constant: false, type: 'Var' },

      3: { noun: 'default', constant: false, type: 'Var' },

      // These points in part to each other.
      4: { left: [0, 1, 5], right: [2], verb: 'sum', type: 'Component' },
      5: { left: [4], right: [3], verb: 'sum', type: 'Component' },
    },
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;

