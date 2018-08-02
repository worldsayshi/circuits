// Turn nodes into values
export default function nounify(nodes, nouns) {
  return nodes.map((node) => {
    if(!node.constant && !((typeof node.variableCount) === 'number')) {
      throw new Error('Variable nodes must have variableCount on nounification');
    }
    return nouns[node.noun](node);
  });
}

// Turn nodes into values
// export default function nounify(nodeIds, nodes, nouns, x) {
//   return nodeIds.map((nodeId, index) => {
//     if (typeof nodeId === 'object') {
//       throw new Error('nodeId should not be an object');
//     }
//     if (!nodes[nodeId]) {
//       throw new Error(`Missing node: ${nodeId}`);
//     }
//     const node = nodes[nodeId];
//     return nouns[node.noun](node, index, x);
//   });
//
// }