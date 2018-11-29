
import * as d3 from "d3";

/*
  Deprecated, not really used
 */

export default {
  dragStart(node) {
    node.fixed = true;
    if(node.parent) {
      // startGroup();
    }
  },
  drag(node, position: { x : number, y : number }) {
    node.x = position.x;
    node.px = position.x;
    node.y = position.y;
    node.py = position.y;
  },
  dragEnd (node) {
    node.fixed = false;
  },
}