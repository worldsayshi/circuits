
import { nelderMead } from 'fmin';
import Node from "../types/node";
import GraphContext from "../graphContext";
import {objectiveFunction} from "./objectiveFunction";
import objectValues from "../util/objectValues";
import {isVar} from "../types/var";
import Graph from "../types/graph";
import objectEntries from "../util/objectEntries";
import customOptimization from "./customOptimization";

function getInitialVariableValues(nodes) {
  return objectValues(nodes)
    .filter(({ value, constant = false }) => !constant)
    .map(({ value = 100 }) => value);
}

export function lookup<T>(indices, nodes: {[key: string]: T}) {
  return indices.map(ix => {
    if (!nodes[ix]) {
      throw new Error(`lookup failed: ${ix} not in ${Object.keys(nodes)}`);
    }
    return nodes[ix];
  });
}

function insertValues(graph: Graph, values) {
  let input = [...values];
  let nodes: {[key: string]: Node} = objectEntries(graph.nodes).reduce((acc, [id, node]) => {
    if(isVar(node) && !node.constant) {
      let [newValue, ...rest] = input;
      input = rest;
      return {
        ...acc,
        [id]: {...node, value: newValue},
      };
    }
    return {
      ...acc,
      [id]: node,
    };
    // node;
  }, {});
  return {
    ...graph,
    nodes,
  };
}

export default function optimizeGraph (graphContext: GraphContext) {

  const initialValues = getInitialVariableValues(graphContext.graph.nodes);

  const optimization = customOptimization((x) => objectiveFunction(graphContext, x), initialValues);

  const values = optimization.x.map(v => Math.round(v * 100) / 100);

  const optimizedGraph = insertValues(graphContext.graph, values);

  return {
    ...graphContext,
    graph: optimizedGraph,
  };
};
