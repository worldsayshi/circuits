import Node from "./node";


export function isVar(node: Node): node is Var {
  return (<Var>node).type === 'Var';
}

export default interface Var {
  type: 'Var';
  noun: 'default';
  value?: number;
  constant: boolean;


  variableCount?: number
}