import * as React from "react";
import {ID3StyleLayoutAdaptor, InputNode, Layout} from "webcola";
import * as cola from "webcola/dist/index";
import * as d3 from "d3";
import {connect} from "react-redux";
import * as jsdiff from "jsondiffpatch";
import DnD from '../DragAndDrop';
import * as nodeComponents from '../node/index';
import * as linkComponents from '../link/index';
import InteractionMode from '../InteractionMode.enum';
import {dispatch} from "d3";

function isNumber(num) {
  return typeof num === "number" && num !== NaN;
}

const DefaultLink = linkComponents['Link'];

class ReactViewInt extends React.Component<{
  nodes: any[],
  links: any[],
  interactionMode: InteractionMode,
  lockNode: (number) => void,
  incNode: (number) => void,
  addLink: (l: { fromId: number, toId: number }) => void,
}> {

  state = {
    width: 960,
    height: 900,
    dragLinkSource: null,
    dragLinkTarget: null,
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
      // .handleDisconnected(true)
      .avoidOverlaps(true)
      .size([this.state.width, this.state.height])
      .symmetricDiffLinkLengths(40)
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

  componentDidMount() {
    // mouse event listener
    // window.addEventListener('mousemove', (...args) => console.log('hello', args));
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

    function normalizeLinks(nodes: any[], links: any[]) {
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

    const nodeDiff = jsdiff.diff(currentNodes, keepPositions(nodes, currentNodes));
    jsdiff.patch(currentNodes, nodeDiff);

    // empty array
    currentLinks.splice(0,currentLinks.length);
    // Push all new links
    currentLinks.push(...normalizeLinks(currentNodes, links));

    this.simulation.start(0,0,0,0,true, false);
  }

  onClick(ix) {
    if(this.props.interactionMode === 'LockValue') {
      this.props.lockNode(ix);
      this.forceUpdate();
    } else if (this.props.interactionMode === 'IncValue') {
      this.props.incNode(ix);
      this.forceUpdate();
    }
  }

  dragStart(ix) {
    if(this.props.interactionMode === 'DragNode') {
      DnD.dragStart(this.state.nodes[ix]);
      this.setState({ dragged: ix });
    }

    if(this.props.interactionMode === 'DragLink') {
      this.setState({ dragLinkSource: {
        nodeId: this.state.nodes[ix].nodeId,
        x: this.state.nodes[ix].x,
        y: this.state.nodes[ix].y,
      } });
    }
  }

  drag(toX: number, toY: number) {
    if(this.state.dragged !== null && this.props.interactionMode === 'DragNode') {
      DnD.drag(this.state.nodes[this.state.dragged], { x: toX, y: toY });
      this.simulation.resume();
      this.forceUpdate();
    }
    if(this.props.interactionMode === 'DragLink' && this.state.dragLinkSource) {
      this.setState({ dragLinkTarget: { x: toX, y: toY } });
    }
  }

  dragStop(ix) {
    if(this.props.interactionMode === 'DragNode') {
      if(this.state.dragged !== null) {
        // Layout.dragEnd(this.state.nodes[this.state.dragged]);
        DnD.dragEnd(this.state.nodes[this.state.dragged]);
      }
      this.setState({ dragged: null });
    }
    if(this.props.interactionMode === 'DragLink') {
      this.setState({ dragLinkSource:  null, dragLinkTarget: null });
    }
    if(this.props.interactionMode === 'DragLink' && isNumber(ix)) {
      this.props.addLink({
        fromId: this.state.dragLinkSource.nodeId,
        toId:  this.state.nodes[ix].nodeId,
      });
      this.setState({ dragLinkSource:  null, dragLinkTarget: null });
    }
  }

  render() {
    let nodeRadius = 30;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    
    return <svg
      onMouseMove={(e) => {
        this.drag(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}
      onMouseUp={() => this.dragStop(null)}
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
      {this.state.dragLinkSource && this.state.dragLinkTarget &&
        <DefaultLink source={this.state.dragLinkSource} target={this.state.dragLinkTarget} />
      }
      {this.state.nodes.map((n, ix) => {
        const Node = nodeComponents[n.type];
        return Node && <Node
          key={ix}
          label={n.value}
          onClick={() => this.onClick(ix)}
          dragStart={() => this.dragStart(ix)}
          dragStop={() => this.dragStop(ix)}
          nodeRadius={nodeRadius}
          color={color}
          {...n} />
      })}
    </svg>;
  }
}


export default connect(({ graphContext, interaction: { mode } }, { adaptor }) => {
  const { nodes, links, groups } = adaptor(graphContext);
  return { nodes, links, groups, interactionMode: mode };
}, dispatch => ({
  lockNode: (ix) => {
    dispatch({ type: 'TOGGLE_CONSTANT', index: ix});
    dispatch({ type: 'OPTIMIZE' });
  },
  incNode: (ix) => {
    dispatch({ type: 'INC_VALUE', index: ix});
    dispatch({ type: 'OPTIMIZE' });
  },
  addLink: ({ fromId, toId }) => {
    dispatch({ type: 'ADD_LINK', fromId, toId });
  },
}))(ReactViewInt);