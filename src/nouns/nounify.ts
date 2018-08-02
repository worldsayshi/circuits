// Turn nodes into values
export default function nounify(nodes, nouns) {
  return nodes.map((node) => {
    if(!node.constant && !((typeof node.variableCount) === 'number')) {
      throw new Error('Variable nodes must have variableCount on nounification');
    }
    return nouns[node.noun](node);
  });
}
