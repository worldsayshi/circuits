
// It's a test graph with evaluation context

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
      4: { noun: 'default', constant: false, type: 'Var' },

      // These points in part to each other.
      5: { left: [0, 1, 3], right: [2], verb: 'sum', type: 'Component' },
      6: { left: [3], right: [4], verb: 'sum', type: 'Component' },
    },
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;