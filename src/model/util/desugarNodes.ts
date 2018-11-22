import counter from "./counter";
import Node from "../types/node";
import Component from "../types/component";


// Add node information that can be inferred

export default function desugarNodes(nodes: Node[]): Node[] {
  const variableCounter = counter(0);

  return nodes.map((n, ix) => {
    const type = (<Component>n).left && (<Component>n).right ? 'Component' : 'Var';
    return {
      type,
      ...n,
      nodeId: ix,
      ...(n.type === 'Var' && !n.constant && {
        variableCount: variableCounter.next().value,
      })
    };
  });
}