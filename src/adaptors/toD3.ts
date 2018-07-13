
function entries (l) {
  return l.map((e, ix) => [ix, e]);
}

function createD3Links(components, numberOfVars) {
  let links = [];
  for(const [index, component] of entries(components)) {
    for(const nodeId of [...component.left, ...component.right]) {
      links.push({source: nodeId, target: numberOfVars+index});
    }
  }
  return links;
}

function createD3Groups(components, numberOfVars) {
  let groups = [];
  let groupCount = 0;
  for(const [index, component] of entries(components)) {
    groups.push({ leaves: component.left });
    groups.push({ leaves: component.right });
    groups.push({ groups: [groupCount, groupCount+1], leaves: [numberOfVars+index] });
    groupCount += 3;
  }
  return groups;
}

export default function toD3 ({ nodes, components }) {
  const d3Nodes = [
    ...nodes.map((node, index) => ({...node, type: 'Var', nodeId: index })),
    ...components.map(component => ({...component, type: 'Component' })),
  ];

  const d3Links = createD3Links(components, nodes.length);

  const d3Groups = createD3Groups(components, nodes.length);

  return { nodes: d3Nodes, links: d3Links, groups: d3Groups };
}