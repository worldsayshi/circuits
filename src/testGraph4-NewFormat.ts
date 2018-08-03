
// It's a test graph with evaluation context

import {getNounResolvers} from "./nouns";
import {getVerbResolvers} from "./components";

export default {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 2 },
      { noun: 'default' },

      { noun: 'default' },

      // These points in part to each other.
      { left: [0, 1, 5], right: [2], verb: 'sum' },
      { left: [4], right: [3], verb: 'sum' },
    ],
  },
  nouns: getNounResolvers(),
  verbs: getVerbResolvers(),
};