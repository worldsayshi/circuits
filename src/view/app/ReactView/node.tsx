import * as cola from "webcola";

export interface Node extends cola.Node {
  // fixed: boolean;
  nodeId: number; // not needed?
  px?: number; // not needed?
  py?: number; // not needed?
}