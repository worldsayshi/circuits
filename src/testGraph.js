
// It's a test graph with evaluation context

export default {
  graph: {
    nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 2 },
      { noun: 'default' },
    ],
    components: [
      { left: [0, 1], right: [2], verb: 'sum' }
    ],
  },
  nouns: {
    default: ({ value }, index, x) => {
      if (value === undefined) {
        return x[index];
      }
      return value;
    }
  },
  verbs: {
    sum: (left, right) =>
      left.reduce((a, b) => a + b, 0) - right.reduce((a, b) => a + b, 0),
  },
};
