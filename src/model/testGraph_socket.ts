
// It's a test graph with evaluation context

import {getNounResolvers} from "./nouns/index";
import {getVerbResolvers} from "./components/index";
import GraphContext from "./graphContext";

const graphContext : GraphContext = {
  graph: {
    nodes: {
      0: { noun: 'default', constant: true, value: 1, type: 'Var' },

      1: { noun: 'default', constant: false, type: 'Var' },
      2: { noun: 'default', constant: false, type: 'Var' },

      3: { left: [0], right: [1], verb: 'embedded', type: 'Component', embedded: {
        nodes: {
          0: { type: 'Socket', side: 'left' },
          1: { type: 'Socket', side: 'right' },
          2: { left: [0], right: [1], verb: 'sum', type: 'Component' },
        },
      }},
      4: { left: [1], right: [2], verb: 'sum', type: 'Component' },
    },
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;