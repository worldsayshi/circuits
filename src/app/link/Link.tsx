import * as React from "react";

function groupCenter (bounds) {
  return {
    x: (bounds.X - bounds.x) / 2 + bounds.x,
    y: (bounds.Y - bounds.y) / 2 + bounds.y
  };
}

export default function Link ({ source, target, }) {
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

    if ((target.type === 'Var' && source.type === 'Var') || !varGroup) {
      d = 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    } else {
      let gCenter = groupCenter(varGroup.bounds);
      // console.log('M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY)
      d = 'M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY;
    }

    return (
      <path
        className={'link'}
    d={d} />);
  } else {
    console.log('source', source);
    console.log('target', target);
    throw new Error('Invalid source and/or target');
  }
}