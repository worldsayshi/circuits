import * as React from "react";

export default class Var extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, x, y, onClick, dragStart, dragStop, constant, ...rest} = this.props;

    const strokeOptions = constant ? { stroke: 'black', strokeWidth: 4 } : {};
    // console.log('rest', rest);
    return <g
      transform={`translate(${x},${y})`}
      className='node'
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick({x, y});
        }
      }}
      onTouchEnd={() => dragStop && dragStop()}
      onTouchStart={() => dragStart && dragStart()}
      // onTouchMove={() => console.log('onTouchMove!!!!!')}
      onMouseDown={(e) => e.button === 0 && dragStart && dragStart()}
      onMouseUp={(e) => dragStop && dragStop()}
    >
      <circle
        r={nodeRadius}

        style={{
          ...strokeOptions,
          fill: color(group)
        }}
      />
      <text className='node-label'>{label}</text>
    </g>;
  }
}