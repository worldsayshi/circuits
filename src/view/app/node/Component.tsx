import * as React from "react";

export default class Component extends React.Component<{ [key: string]: any }> {
  render() {
    const {label, nodeRadius, color, group, img, x, y, dragStart, dragStop, ...rest} = this.props;
    // console.log('rest', rest);
    return <g
      transform={`translate(${x-nodeRadius},${y-nodeRadius})`}
      className='node'
    >
      <image
        href={img}
        className='component'
        // x={-nodeRadius}
        // y={-nodeRadius}
        height={2*nodeRadius}
        width={2*nodeRadius}
      />
      <g transform={`translate(${nodeRadius}, 0)`}>
        <path
          d={`
            M0,0
            a1,1 0 0,1 0,${2*nodeRadius}
          `}
          fill="transparent"
          stroke="blue"
          onMouseDown={(e) => e.button === 0 && dragStart('right')}
          onMouseUp={(e) => dragStop && dragStop('right')}
          onTouchEnd={() => dragStop && dragStop('right')}
          onTouchStart={() => dragStart && dragStart('right')}
          // onMouseDown={(event) => console.log('right', event)}
        />
        <path
          d={`
            M0,0
            a1,1 0 0,0 0,${2*nodeRadius}
          `}
          fill="transparent"
          stroke="red"
          onMouseDown={(e) => e.button === 0 && dragStart('left')}
          onMouseUp={(e) => dragStop && dragStop('left')}
          onTouchEnd={() => dragStop && dragStop('left')}
          onTouchStart={() => dragStart && dragStart('left')}
          // onMouseDown={(event) => console.log('left', event)}
        />
      </g>
    </g>;
  }
}