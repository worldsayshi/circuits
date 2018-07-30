import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";

export function evalGraph ({ graph: { nodes, components }, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  const variableCounter = counter(1);

  const expr = components.reduce((acc, {left, right, verb}) => {
    const leftValues = nounify(lookup(left, nodes), nouns, variableCounter);
    const rightValues = nounify(lookup(right, nodes), nouns, variableCounter);
    return `${acc} + ${verbs[verb](leftValues, rightValues)}`;
  }, 0);
  return math.eval(expr, { x });
}