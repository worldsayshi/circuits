

/*
  Gives a layout that uses
  hidden nodes instead of groups.
 */


import setNodeDefaults from "../model/util/setNodeDefaults";
import countVariables from "../model/util/countVariables";
import objectValues from "../model/util/objectValues";
import Node from "../model/types/node";
import {Node as D3Node, Link as D3Link} from 'webcola';

function entries (l) {
  return l.map((e, ix) => [ix, e]);
}

function createD3Links(components, numberOfVars) {
  let links = [] as any[];
  for(const [index, component] of entries(components)) {
    for(const nodeId of [...component.left, ...component.right]) {
      links.push({source: nodeId, target: numberOfVars+index});
    }
  }
  return links;
}

// TODO This implementation is confused. The componentId are not ids of the d3 graph! Redo this
function createStructuralLattice2(components: any, numberOfNodes: any) {
  let numberOfVars = numberOfNodes - components.length;
  const structuralNodes = [] as any[];
  const structuralLinks = [] as any[];
  for(const [index, component] of entries(components)) {

    let componentId = numberOfVars + index;
    structuralNodes.push({ type: 'HiddenNode' });
    let leftNodeId = numberOfNodes+structuralNodes.length;
    for(const nodeId of component.left) {
      structuralLinks.push({ source: leftNodeId, target: nodeId, type: 'HiddenLink', length: 50 });
    }

    structuralNodes.push({ type: 'HiddenNode' });
    let rightNodeId = numberOfNodes+structuralNodes.length;
    for(const nodeId of component.right) {
      structuralLinks.push({ source: rightNodeId, target: nodeId, type: 'HiddenLink', length: 50 });
    }

    structuralLinks.push({ source: leftNodeId, target: componentId, type: 'HiddenLink', length: 75 });
    structuralLinks.push({ source: rightNodeId, target: componentId, type: 'HiddenLink', length: 75 });

  }
  return { structuralNodes, structuralLinks };
}

const defaultHiddenLength = 90;

function addStructuralLattice({ nodes, links }: { nodes: any[]; links: any[] }) {
  // Add a hidden node for the whole graph
  let superHiddenNodeIndex = nodes.length;
  if(nodes.length > 0) {nodes.push({"type": "HiddenNode"});}
  for(let [nodeIndex, node] of entries(nodes)) {
    if (node.type === 'Component') {

      // Add two hidden nodes for each left and right group

      let leftHiddenNodeIndex = nodes.length;
      if(node.left.length > 0) {nodes.push({"type": "HiddenNode"});}
      for(let leftConnection of node.left) {
        links.push({ source: leftConnection, target: leftHiddenNodeIndex, "type": "HiddenLink", "length": defaultHiddenLength });
        links.push({ source: nodeIndex, target: leftHiddenNodeIndex, "type": "HiddenLink", "length": defaultHiddenLength });
      }

      let rightHiddenNodeIndex = nodes.length;
      if(node.right.length > 0) {nodes.push({"type": "HiddenNode"});}
      for(let rightConnection of node.right) {
        links.push({ source: rightConnection, target: rightHiddenNodeIndex, "type": "HiddenLink", "length": defaultHiddenLength });
        links.push({ source: nodeIndex, target: rightHiddenNodeIndex, "type": "HiddenLink", "length": defaultHiddenLength });
      }

      // Add link to the graph center point
      links.push({ source: nodeIndex, target: superHiddenNodeIndex, "type": "HiddenLink", "length": defaultHiddenLength * 1.5 });

    }
  }

  return { links, nodes };
}

export default function toD3 ({ nodes } : { nodes: { [key: string]: Node } }) : { nodes: D3Node[], links: D3Link<any>[] } {
  const d3Nodes = objectValues(countVariables(nodes));

  const components = objectValues(nodes).filter(({ type }) => type === 'Component');
  const nrOfVars = objectValues(nodes).length-components.length;

  const d3Links = createD3Links(components, nrOfVars);

  //const { structuralNodes, structuralLinks } = createStructuralLattice(components, nrOfVars);

  return addStructuralLattice({
    nodes: [
      ...d3Nodes,
      //...structuralNodes,
    ],
    links: [
      ...d3Links,
      //...structuralLinks,
    ],
  });
}