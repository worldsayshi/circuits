import Node from './node';

export default interface Graph {
  // nodes: Node[];
  nodes: {[key: string]: Node};
}