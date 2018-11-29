import * as nodeComponents from "../node";
import * as React from "react";
import * as linkComponents from '../link';
import * as d3 from "d3";
const DefaultLink = linkComponents['Link'];

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
      onMouseMove={(e) => {
        drag(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}
      onMouseUp={() => dragStop(null)}
      height={height}
      width={width}>
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
          onClick={() => onClick(ix)}
          dragStart={() => dragStart(ix)}
          dragStop={() => dragStop(ix)}
          nodeRadius={nodeRadius}
          color={color}
          {...n} />
      })}
    </svg>
  );
};