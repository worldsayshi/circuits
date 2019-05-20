import * as React from "react";

export default class Socket extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, x, y, onClick, dragStart, dragStop, constant, ...rest} = this.props;

    const strokeOptions = { stroke: 'black', strokeWidth: 10 };

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
        r={nodeRadius-10}

        style={{
          ...strokeOptions,
          fill: color(group)
        }}
      />
      <text className='node-label'>{label}</text>
    </g>;
  }
}