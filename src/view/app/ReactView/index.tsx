import * as React from "react";
import {ID3StyleLayoutAdaptor, Layout} from "webcola";
import * as cola from "webcola/dist/index";
import * as d3 from "d3";
import {connect} from "react-redux";
import * as jsdiff from "jsondiffpatch";
import InteractionMode from '../InteractionMode.enum';
import View from './View';
import {Node} from "./node";

function isNumber(num) {
  return typeof num === "number" && num !== NaN;
}

type Coordinate = { x: number, y: number };

type SubSelection = 'left' | 'right';

interface DragNode extends Node {
  subSelection?: SubSelection;
}

interface Link extends cola.Link<Node> {
  fromSubSelection?: SubSelection;
  toSubSelection?: SubSelection;
}

interface ViewerState {
  nodes: Node[];
  links: Link[];
  dragLinkTarget: DragNode | { x: number, y: number } | null;
  dragLinkSource: DragNode | null;
  width: number;
  groups: any[];
  dragged: number;
  height: number,
}

// { fromId: number, toId: number, fromSubselection: SubSelection, toSubselection: SubSelection, }

const startState = {
  width: 960,
  height: 600,
  dragLinkSource: null,
  dragLinkTarget: null,
  dragged: -1,
  nodes: [],
  links: [],
  groups: [],
};

class ReactViewInt extends React.Component<{
  nodes: Node[],
  links: Link[],
  groups: any[],
  interactionMode: InteractionMode,
  lockNode: (number) => void,
  incNode: (number) => void,
  addNode: (Coordinate) => void,
  addComponent:  (Coordinate) => void,
  addLink: (Link) => void,
}, ViewerState> {

  state: ViewerState = {
    ...startState,
  };

  private simulation: Layout & ID3StyleLayoutAdaptor;

  constructor(props, ...rest) {
    super(props, ...rest);
    const { nodes, links, groups } = props;
    // console.log('props', props)
    this.simulation = cola.d3adaptor(d3)
      .linkDistance(l => l.length || 100)
      // .handleDisconnected(true)
      .avoidOverlaps(true)
      .size([this.state.width, this.state.height])
      .symmetricDiffLinkLengths(40)
      .on('tick', () => this.forceUpdate());

    this.state.nodes = nodes || [];
    this.state.links = links || [];
    this.state.groups = groups || [];
    this.simulation
      .nodes(this.state.nodes);
    this.simulation
      .links(this.state.links);
    this.simulation
      .groups(this.state.groups);

    this.simulation.start();

    this.setDragState(props);

  }

  setDragState(props) {

  }

  componentDidMount() {
    // mouse event listener
    // window.addEventListener('mousemove', (...args) => console.log('hello', args));
  }

  componentWillReceiveProps({ nodes = [], links = [] }: { nodes: Node[], links: Link[] }) {
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
    nodeDiff && jsdiff.patch(currentNodes, nodeDiff);

    // empty array
    currentLinks.splice(0,currentLinks.length);
    // Push all new links
    currentLinks.push(...normalizeLinks(currentNodes, links));

    this.simulation.start(0,0,0,0,true, false);
  }

  onClick(ix, coord) {
    if(this.props.interactionMode === 'LockValue') {
      this.props.lockNode(ix);
      this.forceUpdate();
    } else if (this.props.interactionMode === 'IncValue') {
      this.props.incNode(ix);
      this.forceUpdate();
    } else if (this.props.interactionMode === 'AddNode') {
      // console.log('AddNode', coord);
      this.props.addNode(coord);
    } else if (this.props.interactionMode === 'AddComponent') {
      // console.log('AddNode', coord);
      this.props.addComponent(coord);
    }

  }

  dragStart(ix, subSelection) {
    if(this.props.interactionMode === 'DragNode') {
      const node = this.state.nodes[ix];
      node.fixed = 1;
      this.setState({
        dragged: ix,
      });
    }

    if(this.props.interactionMode === 'DragLink') {
      this.setState({ dragLinkSource: {
        nodeId: this.state.nodes[ix].nodeId,
        x: this.state.nodes[ix].x,
        y: this.state.nodes[ix].y,
        subSelection
      } });
    }
  }

  drag(toX: number, toY: number) {
    if(this.state.dragged !== -1 && this.props.interactionMode === 'DragNode') {
      const node = this.state.nodes[this.state.dragged];
      const position = { x: toX, y: toY };
      node.x = position.x;
      node.px = position.x;
      node.y = position.y;
      node.py = position.y;
      this.simulation.resume();
      this.forceUpdate();
    }
    if(this.props.interactionMode === 'DragLink' && this.state.dragLinkSource) {
      this.setState({ dragLinkTarget: { x: toX, y: toY } });
    }
  }

  // end drag
  dragStop(ix, subSelection) {
    if(this.props.interactionMode === 'DragNode') {
      if(this.state.dragged !== -1) {
        console.log('this.state.dragged', this.state.dragged);
        const node = this.state.nodes[this.state.dragged];
        node.fixed = 0;
      }
    }

    if (this.props.interactionMode === 'DragLink' && isNumber(ix)) {
      if (!this.state.dragLinkSource) throw new Error('Not a proper drag');
      this.props.addLink({
        fromId: this.state.dragLinkSource.nodeId,
        fromSubselection: this.state.dragLinkSource.subSelection,
        toId:  this.state.nodes[ix].nodeId,
        toSubselection: subSelection,
      });
    }
    this.setState({ dragged: -1, dragLinkSource:  null, dragLinkTarget: null });
  }

  render() {

    const {
      height, width,
      groups, links,
      nodes,
      dragLinkSource,
      dragLinkTarget,
    } = this.state;
    
    return (<View
      height={height}
      width={width}
      groups={groups}
      links={links}
      nodes={nodes}
      dragLinkSource={dragLinkSource}
      dragLinkTarget={dragLinkTarget}
      drag={this.drag.bind(this)}
      dragStart={this.dragStart.bind(this)}
      dragStop={this.dragStop.bind(this)}
      onClick={this.onClick.bind(this)}
    />);
  }
}

export default ReactViewInt;