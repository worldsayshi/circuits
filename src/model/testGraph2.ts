
// It's a test graph with evaluation context

import {getVerbResolvers} from "./components/index";
import {getNounResolvers} from "./nouns/index";
import GraphContext from "./graphContext";

let graphContext : GraphContext = {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 2, type: 'Var' },
      { noun: 'default', constant: false, type: 'Var' },

      { noun: 'default', constant: true, value: 100, type: 'Var'  },
      { noun: 'default', constant: false, type: 'Var'  },

      { left: [0, 1], right: [2], verb: 'sum', type: 'Component'  },
      { left: [3], right: [4], verb: 'sum', type: 'Component' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};


export default graphContext;