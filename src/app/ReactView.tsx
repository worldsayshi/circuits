import * as React from "react";
import {ID3StyleLayoutAdaptor, InputNode, Layout} from "webcola";
import * as cola from "webcola/dist/index";
import * as d3 from "d3";
import { connect } from "react-redux";
import * as jsdiff from "jsondiffpatch";


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

class ReactViewInt extends React.Component<{nodes: any[], links: any[]}> {
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
    const { nodes, links } = props;
    this.simulation = cola.d3adaptor(d3)
      .avoidOverlaps(true)
      .size([this.state.width, this.state.height])
      .symmetricDiffLinkLengths(40)
      .on('tick', () => this.forceUpdate());

    this.state.nodes = nodes;
    this.state.links = links;
    this.simulation
      .nodes(this.state.nodes);
    this.simulation
      .links(this.state.links);

    this.simulation.start();
  }

  componentWillReceiveProps({ nodes = [], links = [] }) {

    const currentNodes = this.simulation.nodes();
    const currentLinks = this.simulation.links();

    function keepPositions(nodes: any[], currentNodes: any[]) {
      return nodes.map((n, ix) => ({
        x: currentNodes[ix] && currentNodes[ix].x,
        y: currentNodes[ix] && currentNodes[ix].y,
        // Override with explicit positions
        ...n
      }));
    }

    const nodeDiff = jsdiff.diff(currentNodes, keepPositions(nodes, currentNodes));
    jsdiff.patch(currentNodes, nodeDiff);

    // empty array
    currentLinks.splice(0,currentLinks.length);
    // Push all new links
    currentLinks.push(...this.normalizeLinks(currentNodes, links));

    this.simulation.start(0,0,0,0,true, false);
  }

  private normalizeLinks(nodes: any[], links: any[]) {
    return links.map(link => {
      let source, target;
      if (Number.isInteger(link.source)) {
        source = nodes[link.source];
      } else {
        source = link.source;
      }
      if (Number.isInteger(link.target)) {
        target = nodes[link.target];
      } else {
        target = link.target;
      }
      return { ...link, source, target };
    });
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


export default connect(({nodes, links}) => ({nodes, links}))(ReactViewInt);