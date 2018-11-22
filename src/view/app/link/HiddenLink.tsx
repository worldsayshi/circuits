import * as React from "react";


export default function HiddenLink ({ source, target, }) {
  let d = '';
  if (source.x && target.x) {
    let varNode = source.type === 'Var' ? source : target;
    let varGroup = varNode.parent;

    let deltaX = target.x - source.x,
      deltaY = target.y - source.y,
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      // normX = deltaX / dist,
      // normY = deltaY / dist,
      // sourcePadding = 0, // nodeRadius,
      // targetPadding = 0, //nodeRadius + 2,
      sourceX = source.x, // + (sourcePadding * normX),
      sourceY = source.y, // + (sourcePadding * normY),
      targetX = target.x, // - (targetPadding * normX),
      targetY = target.y; // - (targetPadding * normY);

    // if ((target.type === 'Var' && source.type === 'Var') || !varGroup) {
    d = 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    // }

    return (
      <path
        className={'hidden-link'}
        d={d} />);
  }
}