import Node from './node';

export function isComponent(node: Node): node is Component {
  return (<Component>node).type === 'Component';
}

export default interface Component {
  type: 'Component';
  left: any[];
  right: any[];
  verb: string;
}