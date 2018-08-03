import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";
import addVariableCounts from "../util/addVariableCounts";
import Component from "../types/component";

export function evalGraph ({ graph, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  const variableCounter = counter(0);

  // const { nodes, components } = addVariableCounts(graph);
  const nodes = addVariableCounts(graph.nodes);

  const components : Component[] = nodes.filter(({ type }) => type === 'Component') as Component[];

  const expr = components.reduce((acc, {left, right, verb}) => {
    const leftValues = nounify(lookup(left, nodes), nouns);
    const rightValues = nounify(lookup(right, nodes), nouns);
    return `${acc} + ${verbs[verb](leftValues, rightValues)}`;
  }, '0');
  return math.eval(expr, { x });
}