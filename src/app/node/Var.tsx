import * as React from "react";

export default class Var extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, x, y, onClick, dragStart, dragStop, ...rest} = this.props;
    // console.log('rest', rest);
    return <g
      transform={`translate(${x},${y})`}
      className='node'
      onClick={(e) => onClick && onClick()}
      onMouseDown={(e) => e.button === 0 && dragStart()}
      onMouseUp={(e) => dragStop && dragStop()}
    >
      <circle
        r={nodeRadius}

        style={{fill: color(group)}}
      />
      <text className='node-label'>{label}</text>
    </g>;
  }
}