// Turn nodes into values

export const nounifySingle = (node, nouns) => {
  if(!node.constant && !((typeof node.variableCount) === 'number')) {
    throw new Error('Variable nodes must have variableCount on nounification');
  }
  return nouns[node.noun](node);
};

export default function nounify(nodes, nouns) {
  return nodes.map(n => nounifySingle(n, nouns));
}
