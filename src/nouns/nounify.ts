// Turn nodes into values
export default function nounify(nodes, nouns) {
  return nodes.map((node, index) => nouns[node.noun](node, index))
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