import GraphContext from "../graphContext";
import {lookup} from "./optimizeGraph";
import nounify, { nounifySingle } from "../nouns/nounify";
import entries from "../util/entries";
import counter from "../util/counter";
import Graph from "../types/graph";
import desugarNodes from "../util/desugarNodes";

const findNextUnvisitedComponent = (components, visitedComponents) => components.find(({nodeId}) => {
  return !visitedComponents[nodeId];
});


function nounifyWithTraversal(nodes, nouns, visitedComponents) {
  return nodes.map(node => {
    if(node.type === 'Component') {
      return
    }
    return nounifySingle(node, nouns);
  });
}

function traverseInt({ nodes, nouns, verbs }, visitedComponents) {
  const components = nodes.filter(({ type }) => type === 'Component');
  // const varNodes = nodes.filter(({ type }) => type === 'Var');
  let componentToVisit = findNextUnvisitedComponent(components, visitedComponents);
  if(!componentToVisit) {
    return [];
  }
  visitedComponents[componentToVisit.nodeId] = true;
  const { left, right, verb } = componentToVisit;

  const leftValues = nounifyWithTraversal(lookup(left, nodes), nouns, visitedComponents);
  const rightValues = nounifyWithTraversal(lookup(right, nodes), nouns, visitedComponents);
  const expr = verbs[verb](leftValues, rightValues);

  return [expr, ...traverseInt({ nodes, nouns, verbs }, visitedComponents)];
}

export default function traverseGraph (graphContext: GraphContext) {
  const nodes = desugarNodes(graphContext.graph.nodes);
  return traverseInt({
    nouns: graphContext.nouns,
    verbs: graphContext.verbs,
    nodes,
  }, {});
}