
// It's a test graph with evaluation context

import {getVerbResolvers} from "./components/index";
import {getNounResolvers} from "./nouns/index";
import GraphContext from "./graphContext";

let graphContext : GraphContext = {
  graph: {
    nodes: {
      0: { noun: 'default', constant: true, value: 1, type: 'Var' },
      1: { noun: 'default', constant: true, value: 2, type: 'Var' },
      2: { noun: 'default', constant: false, type: 'Var' },

      3: { noun: 'default', constant: true, value: 100, type: 'Var'  },
      4: { noun: 'default', constant: false, type: 'Var'  },

      5: { left: [0, 1], right: [2], verb: 'sum', type: 'Component'  },
      6: { left: [3], right: [4], verb: 'sum', type: 'Component' },
    },
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};


export default graphContext;