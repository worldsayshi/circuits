import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";
import desugarNodes from "../util/desugarNodes";
import Component from "../types/component";

export function objectiveFunction ({ graph, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  const variableCounter = counter(0);

  // const { nodes, components } = desugarNodes(graph);
  const nodes = desugarNodes(graph.nodes);

  const components : Component[] = nodes.filter(({ type }) => type === 'Component') as Component[];

  const expr = components.reduce((acc, {left, right, verb}) => {
    const leftValues = nounify(lookup(left, nodes), nouns);
    const rightValues = nounify(lookup(right, nodes), nouns);
    return `${acc} + abs(${verbs[verb](leftValues, rightValues)})`;
  }, '0');
  return math.eval(expr, { x });
}