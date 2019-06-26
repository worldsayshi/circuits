
// It's a test graph with evaluation context

import {getNounResolvers} from "./nouns/index";
import {getVerbResolvers} from "./components/index";
import GraphContext from "./graphContext";

const graphContext : GraphContext = {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1, type: 'Var' },

      { noun: 'default', constant: false, type: 'Var' },
      { noun: 'default', constant: false, type: 'Var' },

      { left: [0], right: [1], verb: 'embedded', type: 'Component', embedded: {
        nodes: [
          { type: 'Socket', side: 'left' },
          { type: 'Socket', side: 'right' },
          { left: [0], right: [1], verb: 'sum', type: 'Component' },
        ],
      }},
      { left: [1], right: [2], verb: 'sum', type: 'Component' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};

export default graphContext;