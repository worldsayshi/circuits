


export default function mapComponentIndices(nodes, f) {
  return nodes.map(n => n.type === 'Component' ? ({
    ...n,
    left: n.left.map(f),
    right: n.right.map(f),
  }) : n)
}
