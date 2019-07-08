import entries from "../model/util/entries";
import setNodeDefaults from "../model/util/setNodeDefaults";
import countVariables from "../model/util/countVariables";
import objectValues from "../model/util/objectValues";
import {isComponent} from "../model/types/component";
import Component from "../model/types/component";
import Node from "../model/types/node";


function createD3Links(components: Component[], numberOfVars) {
  let links = [] as any[];
  for(const [index, component] of entries(components)) {
    for(const nodeId of [...component.left, ...component.right]) {
      links.push({source: nodeId, target: numberOfVars+index});
    }
  }
  return links;
}

function createD3Groups(components: Component[], numberOfVars) {
  let groups = [] as any[];
  let groupCount = 0;
  for(const [index, component] of entries(components)) {
    groups.push({ leaves: component.left });
    groups.push({ leaves: component.right });
    groups.push({ groups: [groupCount, groupCount+1], leaves: [numberOfVars+index] });
    groupCount += 3;
  }
  return groups;
}

export default function toCola ({ nodes }: { nodes: { [key: string]: Node } }) {
  const nodesList = objectValues(nodes);
  const d3Nodes = [
    ...objectValues(countVariables(nodes)),
    // ...components.map(component => ({...component, type: 'Component' })),
  ];

  const components: Component[] = <Component[]>objectValues(nodes).filter((node) => isComponent(node));
  const nrOfVars = nodesList.length-components.length;

  const d3Links = createD3Links(components, nrOfVars);

  const d3Groups = createD3Groups(components, nrOfVars);

  return { nodes: d3Nodes, links: d3Links, groups: d3Groups };
}