import counter from "./counter";
import Node from "../types/node";
import Component from "../types/component";


// Add node information that can be inferred

export default function desugarNodes(nodes: Node[]): Node[] {
  const variableCounter = counter(0);

  return nodes.map((n, ix) => {
    const type = (<Component>n).left && (<Component>n).right ? 'Component' : 'Var';
    const shouldHaveVariableCount =
      (n.type === 'Var' && !n.constant)
      || n.type === 'Socket';
    return {
      type,
      ...n,
      nodeId: ix,
      ...(shouldHaveVariableCount && {
        variableCount: variableCounter.next().value,
      })
    };
  });
}