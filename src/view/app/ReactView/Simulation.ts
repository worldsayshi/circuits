export interface Simulation {
  init: (any) => void;
  moveNode: (ix: number, position: { x: number; y: number }) => void;
  fixNode: (ix: number) => void;
  unfixNode: (ix: number) => void;
  getNode: (ix: number) => any;
  getNodes: () => any;
  getGroups: () => any;
  getLinks: () => any;
  isReady: () => any;

  setSize(size: { width: number, y: number }): void;
}