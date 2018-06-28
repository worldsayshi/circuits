

export default ({ nodes, links, groups }, nodeToPull /*: index */) => {
  if(!nodes[nodeToPull].type === 'Var') {
    // Error
  }
  // Find links from node
  const adjacentNodes = links.map(({ target, source }) => {
    if (nodeToPull === target) {
      return source;
    }
    if (nodeToPull === source) {
      return target;
    }
    return null;
  }).filter(n => n !== null);
  // for each component, pull it while excluding this node
  // for each Var, pull that and ignore this.


  // To turn it recursive, keep track of visited nodes
  // Never visit a node twice.
};
