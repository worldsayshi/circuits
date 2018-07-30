
// It's a test graph with evaluation context

import {getVerbResolvers} from "./components";
import {getNounResolvers} from "./nouns";

export default {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 2 },
      { noun: 'default' },

      { noun: 'default', constant: true, value: 100 },
      { noun: 'default' },
    ],
    components: [
      { left: [0, 1], right: [2], verb: 'sum' },

      { left: [3], right: [4], verb: 'sum' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};
