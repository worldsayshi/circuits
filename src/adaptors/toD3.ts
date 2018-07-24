

/*
  Gives a layout that uses
  hidden nodes instead of groups.
 */


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


function createStructuralLattice(components: any, numberOfVars: any) {
  const structuralNodes = [];
  const structuralLinks = [];
  for(const [index, component] of entries(components)) {
    structuralNodes.push({ type: 'HiddenNode' });
    let leftNodeId = numberOfVars+structuralNodes.length+1;
    for(const nodeId of component.left) {
      structuralLinks.push({ source: leftNodeId, target: nodeId });
    }
    structuralNodes.push({ type: 'HiddenNode' });
    let rightNodeId = numberOfVars+structuralNodes.length+1;
    for(const nodeId of component.right) {
      structuralLinks.push({ source: rightNodeId, target: nodeId });
    }

  }
  return { structuralNodes, structuralLinks };
}

export default function toD3 ({ nodes, components }) {
  const d3Nodes = [
    ...nodes.map((node, index) => ({...node, type: 'Var', nodeId: index })),
    ...components.map(component => ({...component, type: 'Component' })),
  ];

  const d3Links = createD3Links(components, nodes.length);

  const { structuralNodes, structuralLinks } = createStructuralLattice(components, nodes.length);


  return { nodes: d3Nodes.concat(structuralNodes), links: d3Links.concat(structuralLinks) };
}