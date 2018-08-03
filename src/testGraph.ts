
// It's a test graph with evaluation context

import {getNounResolvers} from "./nouns";
import {getVerbResolvers} from "./components";
import GraphContext from "./graphContext";

const graphContext: GraphContext = {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 2, type: 'Var' },
      { noun: 'default', constant: false, type: 'Var' },

      { left: [0, 1], right: [2], verb: 'sum', type: 'Component' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;