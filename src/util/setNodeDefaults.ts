export default function setNodeDefaults(node, index) {
  if(node.left && node.right) {
    return {...node, type: 'Component' };
  }
  return {...node, type: 'Var', nodeId: index };
}