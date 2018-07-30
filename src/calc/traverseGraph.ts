import GraphContext from "../graphContext";

const findNextUnvisitedComponent = (components, visitedComponents) => components.entries().find(([ix]) => {
  return !visitedComponents[ix];
});

function traverseInt({ graph: { nodes, components }, nouns, verbs }, visitedComponents) {
  let [index, componentToVisit] = findNextUnvisitedComponent(components, visitedComponents);
  visitedComponents[index] = true;
  const { left, right, verb } = componentToVisit;
  // nounifyWhileTraversing();
}

export default function traverseGraph (graphContext: GraphContext) {
  return traverseInt(graphContext, {});
}