import * as React from "react";
import {ID3StyleLayoutAdaptor, InputNode, Layout} from "webcola";
import * as cola from "webcola/dist/index";
import * as d3 from "d3";

const clone = obj => JSON.parse(JSON.stringify(obj));

const testGraph = () => clone({
  nodes: [{}, {}, {}].map(Var),
  links: [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 0, target: 2},
  ].map(Link),
});


const Var = (n, i) => ({
  id: `${i}`,
  type: 'Var',
  value: 1,
  ...n,
});

const Link = (l) => ({
  type: 'Simple',
  ...l,
});

interface MyNode extends InputNode {
  id: string;
  type: string,
  value?: number;

  [key: string]: any;
}

interface Graph {
  nodes: any[];
  links: any[]; //  {source:number,target:number}
}

class Node extends React.Component<{[key: string]: any}> {
  render(){
    const { label, nodeRadius, color, group, x, y, dragStart, dragStop } = this.props;
    return <g
      transform={`translate(${x},${y})`}
      className='node'
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

export default class ReactView extends React.Component {
  state = {
    width: 960,
    height: 900,
    dragged: null,
    nodes: [],
    links: [],
  };

  private simulation: Layout & ID3StyleLayoutAdaptor;

  constructor(props, ...rest) {
    super(props, ...rest);
    const startGraph = testGraph();
    this.simulation = cola.d3adaptor(d3)
      .avoidOverlaps(true)
      .size([this.state.width, this.state.height])
      .symmetricDiffLinkLengths(40)
      .on('tick', () => this.forceUpdate());

    this.state.nodes = startGraph.nodes;
    this.state.links = startGraph.links;
    this.simulation
      .nodes(this.state.nodes);
    this.simulation
      .links(this.state.links);

    this.simulation.start();
  }

  moveDragged(toX, toY) {
    if(this.state.dragged !== null) {
      this.state.nodes[this.state.dragged].x = toX;
      this.state.nodes[this.state.dragged].y = toY;
      this.simulation.start(0,0,0,0,true, false);
      this.forceUpdate();
    }
  }

  render() {
    console.log('render');
    let nodeRadius = 30;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    return <svg
      onMouseMove={(e) => {
        this.moveDragged(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}
      onMouseUp={() => this.setState({ dragged: null })}
      height={this.state.height}
      width={this.state.width}>
      {this.state.links.map(l =>
        <path
          className={'link'}
          d={'M' + l.source.x + ',' + l.source.y + 'L' + l.target.x + ',' + l.target.y} />
      )}
      {this.state.nodes.map((n, ix) =>
        <Node
          label={n.value}
          dragStart={() => this.setState({ dragged: ix })}
          nodeRadius={nodeRadius} color={color} {...n} />
      )}
    </svg>;
  }
}