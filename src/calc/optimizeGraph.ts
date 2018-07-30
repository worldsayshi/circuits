
import { nelderMead } from 'fmin';
import GraphContext from "../graphContext";
import {evalGraph} from "./evalGraph";

function getInitialVariableValues(nodes) {
  return nodes
    .filter(({ value, constant = false }) => !constant)
    .map(({ value = 100 }) => value);
}

export function lookup(indices, nodes) {
  return indices.map(ix => nodes[ix]);
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

export default function optimizeGraph (graphContext: GraphContext) {

  const initialValues = getInitialVariableValues(graphContext.graph.nodes);

  console.log('initialValues:', initialValues);

  const optimization = nelderMead((x) => {
    const sum = evalGraph(graphContext, x);
    return Math.abs(sum);
  }, initialValues);

  console.log('values 1:', optimization.x);

  const values = optimization.x.map(v => Math.round(v * 100) / 100);

  console.log('values 2:', values);

  const optimizedGraph = insertValues(graphContext.graph, values);

  return {
    ...graphContext,
    graph: optimizedGraph,
  };
};
