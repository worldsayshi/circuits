
// It's a test graph with evaluation context

import {getNounResolvers} from "./nouns/index";
import {getVerbResolvers} from "./components/index";
import GraphContext from "./graphContext";

const graphContext : GraphContext = {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 2, type: 'Var' },
      { noun: 'default', constant: false, type: 'Var' },

      { noun: 'default', constant: false, type: 'Var' },
      { noun: 'default', constant: false, type: 'Var' },

      // These points in part to each other.
      { left: [0, 1, 3], right: [2], verb: 'sum', type: 'Component' },
      { left: [3], right: [4], verb: 'sum', type: 'Component' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;