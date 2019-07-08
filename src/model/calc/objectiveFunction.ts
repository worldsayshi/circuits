import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";
import countVariables from "../util/countVariables";
import Component, {isComponent} from "../types/component";
import Node from '../types/node';
import {isVar} from "../types/var";
import entries from "../util/entries";
import objectEntries from "../util/objectEntries";
import {isSocket} from "../types/socket";
import objectValues from "../util/objectValues";


export function objectiveFunction ({ graph, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  
  const expandedNodes = expandEmbeddedGraphs(graph.nodes);
  const nodes = countVariables(expandedNodes);


  const components : Component[] = objectValues(nodes).filter(({ type }) => type === 'Component') as Component[];

  const expr = components.reduce((acc, component) => {
    const { left, right, verb } = component;
    const leftValues = nounify(lookup(left, nodes), nouns);
    const rightValues = nounify(lookup(right, nodes), nouns);
    const verbImpl = verbs[verb];
    if (!verbImpl) {
      throw new Error("Implementation missing for " + verb);
    }
    const value = verbImpl(leftValues, rightValues, component);
    return `${acc} + abs(${value})`;
  }, '0');
  return math.eval(expr, { x });
}





function expandSingleEmbedded(
  nodes: {[key: string]: Node},
  componentToExpand: Component,
  componentId: string
): {[key: string]: Node} {

  if (!componentToExpand.embedded) {
    throw new Error("Can't expand empty component");
  }

  let edgeNodeIds: string[] = [];

  // Move the embedded nodes into the outer scope
  for(let [id, embeddedNode] of objectEntries(componentToExpand.embedded.nodes)) {
    let outerId = `${componentId}-${id}`;
    if (isSocket(embeddedNode)) {
      edgeNodeIds.push(outerId);
      nodes[outerId] = ({ type: 'Var', noun: 'default', constant: false });
    } else if (isComponent(embeddedNode)) {
      // Fix the adjacencies as well
      nodes[outerId] = ({
        ...embeddedNode,
        left: embeddedNode.left.map(adj => `${componentId}-${adj}`),
        right: embeddedNode.right.map(adj => `${componentId}-${adj}`),
      });
    } else {
      nodes[outerId] = embeddedNode;
    }
  }

  if (edgeNodeIds.length !== 2) {
    throw new Error("Sockets missing in embedded component");
  }

  // Add components that connect edge nodes to outer nodes
  let leftEdgeComponent: Component = { type: 'Component', left: componentToExpand.left, right: [edgeNodeIds[0]], verb: 'sum' };
  nodes[`${componentId}-left`] = leftEdgeComponent;
  let rightEdgeComponent: Component = { type: 'Component', left: [edgeNodeIds[1]], right: componentToExpand.right, verb: 'sum' };
  nodes[`${componentId}-right`] = rightEdgeComponent;

  return nodes;

  /*nodeToExpand.embedded
  // 1. add one node for each side
  let leftIndex = `${componentId}-`;
  nodes[leftIndex] = ({ type: 'Var', noun: 'default', constant: false });
  let rightIndex = `${componentId}-`;
  nodes[rightIndex] = ({ type: 'Var', noun: 'default', constant: false });

  // 2a. find the internal indices of the sockets
  let socketIds: string[] = [];
  for (let [id, node] of objectEntries(nodes)) {
    if(isSocket(node)) {
      socketIds.push(id);
    }
  }

  let increment =
  nodes.map(n => {
    if (n)
  });
  // 2b. increment the pointers in the components of the embedded graph,
  //    but pointers to the sockets should be set to indices of the "side nodes"


  // 3. Append the expanded graph to the end of the list
  //
  nodesToAdd.push({ type: 'Var', noun: 'default', constant: false });
  return [nextIndex, nodes];*/
}

function expandEmbeddedGraphs(nodes: { [key: string]: Node } ): { [key: string]: Node } {
  let newNodes: {[key: string]: Node} = {};
  for(let [index, node] of objectEntries(nodes)) {
    if (isComponent(node) && node.embedded) {
      newNodes = expandSingleEmbedded(newNodes, node, index)
    } else {
      newNodes[index] = node;
    }
  }
  return newNodes;
}


