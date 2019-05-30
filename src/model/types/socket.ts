import Node from "./node";


export function isSocket(node: Node): node is Socket {
  return (<Socket>node).type === 'Socket';
}

export default interface Socket {
  type: 'Socket';
}