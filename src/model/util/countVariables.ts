import counter from "./counter";
import Node from "../types/node";
import Component from "../types/component";

function entries(things: {[key:string]: Node}): [string, Node][] {

  return Object.keys(things).map(key => <[string, Node]>[key, things[key]]);
}

export default function countVariables(
  nodes: {[key:string]: Node}
): {[key: string]: Node} {
  const variableCounter = counter(0);

  return entries(nodes).reduce((acc, [ix, n]) => {
    const type = (<Component>n).left && (<Component>n).right ? 'Component' : 'Var';
    const shouldHaveVariableCount =
      (n.type === 'Var' && !n.constant)
      || n.type === 'Socket';
    return ({
      ...acc,
      [ix]: {
        type,
        ...n,
        nodeId: ix,
        ...(shouldHaveVariableCount && {
          variableCount: variableCounter.next().value,
        })
      }
    });
  }, {});
}