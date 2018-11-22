import Var from "./var";
import Component from "./component";

export default interface Graph {
  nodes: (Var | Component)[];
}