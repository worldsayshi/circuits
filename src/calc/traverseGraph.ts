import GraphContext from "../graphContext";
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import entries from "../util/entries";
import counter from "../util/counter";
import Graph from "../graph";
import addVariableCounts from "../util/addVariableCounts";

const findNextUnvisitedComponent = (components, visitedComponents) => entries(components).find(([ix]) => {
  return !visitedComponents[ix];
});

function traverseInt({ graph: { nodes, components }, nouns, verbs }, visitedComponents) {
  let entryToVisit = findNextUnvisitedComponent(components, visitedComponents);
  if(!entryToVisit) {
    return [];
  }
  const [index, componentToVisit] = entryToVisit;
  visitedComponents[index] = true;
  const { left, right, verb } = componentToVisit;



  const leftValues = nounify(lookup(left, nodes), nouns);
  const rightValues = nounify(lookup(right, nodes), nouns);
  const expr = verbs[verb](leftValues, rightValues);

  return [expr, ...traverseInt({ graph: { nodes, components }, nouns, verbs }, visitedComponents)];
  // nounifyWhileTraversing();
}

export default function traverseGraph (graphContext: GraphContext) {

  const graph = addVariableCounts(graphContext.graph);

  return traverseInt({
    ...graphContext,
    graph,
  }, {});
}