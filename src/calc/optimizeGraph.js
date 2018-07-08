
import { nelderMead } from 'fmin';
// import evalGraph from './evalGraph';

// Turn nodes into values
export function nounify(nodeIds, nodes, nouns, x) {
  return nodeIds.map((nodeId, index) => {
    if (!nodes[nodeId]) {
      throw new Error(`Missing node: ${nodeId}`);
    }
    return nouns[nodes[nodeId].noun](nodes[nodeId], index, x);
  });

}

function getInitialVariableValues(nodes) {
  return nodes
    .filter(({ value, constant = false }) => !constant)
    .map(({ value = 100 }) => value);
}


export function evalGraph ({ graph: { nodes, components }, nouns, verbs }, x) {
  return components.reduce((acc, {left, right, verb}) => {
    const leftValues = nounify(left, nodes, nouns, x);
    const rightValues = nounify(right, nodes, nouns, x);
    return acc + verbs[verb](leftValues, rightValues);
  }, 0);
}

function insertValues(graph, values) {
  let input = [...values];
  return {
    ...graph,
    nodes: graph.nodes.map(node => {
      if(!node.constant) {
        let [newValue, ...rest] = input;
        input = rest;
        return {
          ...node,
          value: newValue,
        };
      }
      return node;
    }),
  };
}

export default function optimizeGraph (graphContext) {

  const initialValues = getInitialVariableValues(graphContext.graph.nodes);

  const optimization = nelderMead((x) => {
    const sum = evalGraph(graphContext, x);
    return Math.abs(sum);
  }, initialValues);

  const values = optimization.x.map(v => Math.round(v * 100) / 100);

  console.log('values', values);

  const optimizedGraph = insertValues(graphContext.graph, values);

  return {
    ...graphContext,
    graph: optimizedGraph,
  };
};
