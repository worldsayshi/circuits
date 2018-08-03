import counter from "./counter";
import Node from "../types/node";


export default function addVariableCounts(nodes: Node[]): Node[] {
  const variableCounter = counter(0);
  return nodes.map(n => ({
    ...n,
    ...(n.type === 'Var' && !n.constant && {
      variableCount: variableCounter.next().value,
    })
  }));
}