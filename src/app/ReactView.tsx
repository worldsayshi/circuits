import * as React from "react";
import {ID3StyleLayoutAdaptor, InputNode, Layout} from "webcola";
import * as cola from "webcola/dist/index";
import * as d3 from "d3";
import {connect} from "react-redux";
import * as jsdiff from "jsondiffpatch";
import DnD from './DragAndDrop';
import * as nodeComponents from './node';
import * as linkComponents from './link';



class ReactViewInt extends React.Component<{nodes: any[], links: any[]}> {
  state = {
    width: 960,
    height: 900,
    dragged: null,
    nodes: [],
    links: [],
    groups: [],
  };

  private simulation: Layout & ID3StyleLayoutAdaptor;

  constructor(props, ...rest) {
    super(props, ...rest);
    const { nodes, links, groups } = props;
    this.simulation = cola.d3adaptor(d3)
      .linkDistance(l => l.length || 100)
      .handleDisconnected(true)
      // .avoidOverlaps(true)
      .size([this.state.width, this.state.height])
      // .symmetricDiffLinkLengths(40)
      .on('tick', () => this.forceUpdate());

    this.state.nodes = nodes;
    this.state.links = links;
    this.state.groups = groups || [];
    this.simulation
      .nodes(this.state.nodes);
    this.simulation
      .links(this.state.links);
    this.simulation
      .groups(this.state.groups);

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

  drag(toX: number, toY: number) {
    if(this.state.dragged !== null) {
      DnD.drag(this.state.nodes[this.state.dragged], { x: toX, y: toY });
      this.simulation.resume();
      this.forceUpdate();
    }
  }

  dragStop() {
    if(this.state.dragged !== null) {
      // Layout.dragEnd(this.state.nodes[this.state.dragged]);
      DnD.dragEnd(this.state.nodes[this.state.dragged]);
    }
    this.setState({ dragged: null });
  }

  dragStart(ix) {
    DnD.dragStart(this.state.nodes[ix]);
    this.setState({ dragged: ix });
  }

  render() {
    let nodeRadius = 30;
    let color = d3.scaleOrdinal(d3.schemeCategory10);


    return <svg
      onMouseMove={(e) => {
        this.drag(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}
      onMouseUp={() => this.dragStop()}
      height={this.state.height}
      width={this.state.width}>
      {this.state.groups.map((g, i) =>
        <rect
          key={i}
          x={g.bounds.x}
          y={g.bounds.y}
          width={g.bounds.X-g.bounds.x}
          height={g.bounds.Y-g.bounds.y}
          stroke='black'
          fillOpacity={0}
        />
      )}
      {this.state.links.map((l, i) => {
        const Link = linkComponents[l.type || 'Link'];
        return <Link
          key={i}
          {...l} />;
      })}
      {this.state.nodes.map((n, ix) => {
        const Node = nodeComponents[n.type];
        return Node && <Node
          key={ix}
          label={n.value}
          dragStart={() => this.dragStart(ix)}
          nodeRadius={nodeRadius}
          color={color}
          {...n} />
      })}
    </svg>;
  }
}


export default connect((state, { adaptor }) => {
  const { nodes, links, groups } = adaptor(state);
  return { nodes, links, groups };
})(ReactViewInt);