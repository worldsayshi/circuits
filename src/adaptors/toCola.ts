import entries from "../util/entries";
import setNodeDefaults from "../util/setNodeDefaults";


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

export default function toCola ({ nodes }) {
  const d3Nodes = [
    ...nodes.map(setNodeDefaults),
    // ...components.map(component => ({...component, type: 'Component' })),
  ];

  const components = nodes.filter(({ type }) => type === 'Component');
  const nrOfVars = nodes.length-components.length;

  const d3Links = createD3Links(components, nrOfVars);

  const d3Groups = createD3Groups(components, nrOfVars);

  return { nodes: d3Nodes, links: d3Links, groups: d3Groups };
}