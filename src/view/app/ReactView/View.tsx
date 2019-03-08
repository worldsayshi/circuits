import * as nodeComponents from "../node";
import * as React from "react";
import * as linkComponents from '../link';
import * as d3 from "d3";
const DefaultLink = linkComponents['Link'];

function calcCoordinates(event) {
  // This solution has limitations and might not work at some point.
  // Here's an alternative: https://stackoverflow.com/a/42711775/439034
  const bounds = event.target.getBoundingClientRect();
  let x = event.clientX - bounds.left;
  let y = event.clientY - bounds.top;
  return { x, y, };
}

export default ({
  height, width,
  groups, links,
  nodes,
  dragLinkSource,
  dragLinkTarget,
  drag,
  dragStart,
  dragStop,
  onClick,
}) => {
  let nodeRadius = 30;
  let color = d3.scaleOrdinal(d3.schemeCategory10);

  return (
    <svg
      style={{touchAction: 'none'}}
      onClick={(ev) => console.log('svg fallback', calcCoordinates(ev)) || onClick(null, calcCoordinates(ev))}
      onMouseMove={(e) => {
        drag(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}

      onTouchMove={(e) => {
        e.stopPropagation();
        e.preventDefault();
        let rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        let x = e.targetTouches[0].pageX - rect.left;
        let y = e.targetTouches[0].pageY - rect.top;
        drag(x, y);
      }}
      onMouseUp={() => dragStop(null)}
      height={height}
      width={width}
    >
      {groups.map((g, i) =>
        <rect
          key={i}
          x={g.bounds.x}
          y={g.bounds.y}
          width={g.bounds.X - g.bounds.x}
          height={g.bounds.Y - g.bounds.y}
          stroke='black'
          fillOpacity={0}
        />
      )}
      {links.map((l, i) => {
        const Link = linkComponents[l.type || 'Link'];
        return <Link
          key={i}
          {...l} />;
      })}
      {dragLinkSource && dragLinkTarget &&
      <DefaultLink source={dragLinkSource} target={dragLinkTarget}/>
      }
      {nodes.map((n, ix) => {
        const Node = nodeComponents[n.type];
        return Node && <Node
          key={ix}
          label={n.value}
          onClick={(pos) => onClick(ix, pos)}
          dragStart={(subSelection) => dragStart(ix, subSelection)}
          dragStop={(subSelection) => dragStop(ix, subSelection)}
          nodeRadius={nodeRadius}
          color={color}
          {...n} />
      })}
    </svg>
  );
};