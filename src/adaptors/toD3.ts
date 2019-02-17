

/*
  Gives a layout that uses
  hidden nodes instead of groups.
 */


import setNodeDefaults from "../model/util/setNodeDefaults";
import desugarNodes from "../model/util/desugarNodes";

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


function createStructuralLattice(components: any, numberOfNodes: any) {
  let numberOfVars = numberOfNodes - components.length + 2;
  const structuralNodes = [];
  const structuralLinks = [];
  for(const [index, component] of entries(components)) {
    let componentId = numberOfVars + index;
    structuralNodes.push({ type: 'HiddenNode' });
    let leftNodeId = numberOfNodes+structuralNodes.length+1;
    for(const nodeId of component.left) {
      structuralLinks.push({ source: leftNodeId, target: nodeId, type: 'HiddenLink', length: 50 });
    }

    structuralNodes.push({ type: 'HiddenNode' });
    let rightNodeId = numberOfNodes+structuralNodes.length+1;
    for(const nodeId of component.right) {
      structuralLinks.push({ source: rightNodeId, target: nodeId, type: 'HiddenLink', length: 50 });
    }

    structuralLinks.push({ source: leftNodeId, target: componentId, type: 'HiddenLink', length: 75 });
    structuralLinks.push({ source: rightNodeId, target: componentId, type: 'HiddenLink', length: 75 });

  }
  return { structuralNodes, structuralLinks };
}



export default function toD3 ({ nodes }) {
  const d3Nodes = desugarNodes(nodes);

  const components = nodes.filter(({ type }) => type === 'Component');
  const nrOfVars = nodes.length-components.length;

  const d3Links = createD3Links(components, nrOfVars);

  // const { structuralNodes, structuralLinks } = createStructuralLattice(components, nrOfVars);

  return {
    nodes: [
      ...d3Nodes,
      // ...structuralNodes,
    ],
    links: [
      ...d3Links,
      // ...structuralLinks,
    ],
  };
}