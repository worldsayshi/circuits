import * as React from "react";

export default class Component extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, img, x, y, dragStart, dragStop, ...rest} = this.props;
    // console.log('rest', rest);
    return <g
      transform={`translate(${x},${y})`}
      className='node'
      onMouseDown={(e) => e.button === 0 && dragStart()}
      onMouseUp={(e) => dragStop && dragStop()}
    >
      <image
        href={img}
        className='component'
        x={-nodeRadius}
        y={-nodeRadius}
        height={2*nodeRadius}
        width={2*nodeRadius}
      />
    </g>;
  }
}