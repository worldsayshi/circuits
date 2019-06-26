

export default function increaseAllComponentIndexes(nodes) {
  return nodes.map(n => n.type === 'Component' ? ({
    ...n,
    left: n.left.map(i => i +1),
    right: n.right.map(i => i +1),
  }) : n)
}
