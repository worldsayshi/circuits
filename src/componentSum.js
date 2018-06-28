
// Turn nodes into values
function nounify(nodes, nouns, x) {
  return nodes.map((node, index) => nouns[node.noun](node, index, x))
}

export default ({ graph: { nodes, components }, nouns, verbs }, x) => components.reduce((acc, {left, right, verb}) => {
  const leftValues = nounify(left.map(i => nodes[i]), nouns, x);
  const rightValues = nounify(right.map(i => nodes[i]), nouns, x);
  // console.log('leftValues', leftValues);
  // console.log('rightValues', rightValues);
  return acc + verbs[verb](leftValues, rightValues);
}, 0);
