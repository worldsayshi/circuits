import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";
import countVariables from "../util/countVariables";
import Component, {isComponent} from "../types/component";
import Node from '../types/node';
import {isVar} from "../types/var";


export function objectiveFunction ({ graph, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  

  const nodes = countVariables(/*expandEmbeddedGraphs*/(graph.nodes));

  const components : Component[] = nodes.filter(({ type }) => type === 'Component') as Component[];

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


/*


// TODO The way I need to handle indices in expandSingleEmbedded is RIDICULUS!
// So I should rewrite the index system! Use indices as id:s instead!
function expandSingleEmbedded(node: Node, lastUsedIndex: number, socketIndex: number) {
  let nodesToAdd : Node[] = [];

  // 1. add one node for each side
  let leftIndex = lastUsedIndex + 1;
  nodesToAdd.push({ type: 'Var', noun: 'default', constant: false });
  let rightIndex = lastUsedIndex + 2;

  // 2. increment the pointers in the components of the embedded graph,
  //    but pointers of the sockets should be set to indices of the "side nodes"


  // 3. Append the expanded graph to the end of the list
  //
  nodesToAdd.push({ type: 'Var', noun: 'default', constant: false });
  return nodesToAdd;
}

function expandEmbeddedGraphs(nodes: Node[]): Node[] {
  console.log('NODES', nodes);
  let newNodes: Node[] = [];
  let nodesToAppend: Node[] = [];
  for(let [index, node] of nodes.entries()) {
    if (isComponent(node) && node.embedded) {
      nodesToAppend = nodesToAppend.concat(
        expandSingleEmbedded(node, (nodes.length + nodesToAppend.length) - 1, index)
      );

      // todo decrease all component indices that > ... AHFUCKIT (too complicated this way)
    } else {
      newNodes.push(node);
    }
  }
  newNodes = newNodes.concat(nodesToAppend);
  return [];
}


 */