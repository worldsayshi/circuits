import * as React from "react";

export default class HiddenNode extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, x, y, dragStart, dragStop, ...rest} = this.props;
    // console.log('rest', rest);
    return <g
      transform={`translate(${x},${y})`}
      className='hidden-node'
      onMouseDown={(e) => e.button === 0 && dragStart()}
      onMouseUp={(e) => dragStop && dragStop()}
    >
      <circle
        r={5}

        style={{fill: color(group)}}
      />
      <text className='node-label'>{label}</text>
    </g>;
  }
}