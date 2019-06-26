import * as math from 'mathjs';
import {lookup} from "./optimizeGraph";
import nounify from "../nouns/nounify";
import counter from "../util/counter";
import countVariables from "../util/countVariables";
import Component from "../types/component";

// TODO Expand embedded components before counting variables


function expandEmbeddedGraphs(nodes: any) {
  // Append the expanded graph to the end of the list
  //
  return [];
}

export function objectiveFunction ({ graph, nouns, verbs }, x) {


  // B1. Add product component and a test example including a product component
  // B2. Also, add an example with non-disparate graph with more than one component

  

  const nodes = countVariables(expandEmbeddedGraphs(graph.nodes));

  const components : Component[] = nodes.filter(({ type }) => type === 'Component') as Component[];

  const expr = components.reduce((acc, component) => {
    const { left, right, verb } = component;
    const leftValues = nounify(lookup(left, nodes), nouns);
    const rightValues = nounify(lookup(right, nodes), nouns);
    const verbImpl = verbs[verb];
    if (!verbImpl) {
      throw new Error("Implementation missing for " + verb);
    }
    const value = verbImpl(leftValues, rightValues, component);
    return `${acc} + abs(${value})`;
  }, '0');
  return math.eval(expr, { x });
}