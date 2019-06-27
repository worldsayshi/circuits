import counter from "./counter";
import Node from "../types/node";
import Component from "../types/component";

// TODO Continue turning Node[] -> {[key:string]: Node}
function entries(things: {[key:string]: Node}): [string, Node][] {

  return Object.keys(things).map(key => <[string, Node]>[key, things[key]]);
}

export default function countVariables(nodes: {[key:string]: Node}): Node[] {
  const variableCounter = counter(0);

  return entries(nodes).map(([ix, n]) => {
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