import GraphContext from "../graphContext";
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import entries from "../util/entries";
import counter from "../util/counter";
import Graph from "../types/graph";
import addVariableCounts from "../util/addVariableCounts";

const findNextUnvisitedComponent = (components, visitedComponents) => entries(components).find(([ix]) => {
  return !visitedComponents[ix];
});

function traverseInt({ graph: { nodes }, nouns, verbs }, visitedComponents) {
  const components = nodes.filter(({ type }) => type === 'Component');
  const varNodes = nodes.filter(({ type }) => type === 'Var');
  let entryToVisit = findNextUnvisitedComponent(components, visitedComponents);
  if(!entryToVisit) {
    return [];
  }
  const [index, componentToVisit] = entryToVisit;
  visitedComponents[index] = true;
  const { left, right, verb } = componentToVisit;

  const leftValues = nounify(lookup(left, varNodes), nouns);
  const rightValues = nounify(lookup(right, varNodes), nouns);
  const expr = verbs[verb](leftValues, rightValues);

  return [expr, ...traverseInt({ graph: { nodes: varNodes.concat(components) }, nouns, verbs }, visitedComponents)];
}

export default function traverseGraph (graphContext: GraphContext) {
  const nodes = addVariableCounts(graphContext.graph.nodes);
  return traverseInt({
    ...graphContext,
    graph: {
      ...graphContext.graph,
      nodes,
    },
  }, {});
}