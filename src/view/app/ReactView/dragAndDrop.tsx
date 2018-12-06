import * as React from "react";
import InteractionMode from "../InteractionMode.enum";
import View from "./View";
import PropTypes from 'prop-types';
import D3Simulation from './D3Simulation';
import {Simulation} from "./Simulation";

function isNumber(num) {
  return typeof num === "number" && num !== NaN;
}

export class DragAndDropComponent extends React.Component<{
  nodes: any[],
  ViewComponent: PropTypes.node,
  simulation: Simulation,
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
    // simulation: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // mouse event listener
    // window.addEventListener('mousemove', (...args) => console.log('hello', args));
    this.props.simulation.init({
      ...this.props,
      onSimulationUpdate: () => this.forceUpdate(),
    });
  }

  onClick(ix) {
    if (this.props.interactionMode === 'LockValue') {
      this.props.lockNode(ix);
      this.forceUpdate();
    } else if (this.props.interactionMode === 'IncValue') {
      this.props.incNode(ix);
      this.forceUpdate();
    }
  }

  dragStart(ix) {
    const { simulation } = this.props;

    if (this.props.interactionMode === 'DragNode') {
      simulation.fixNode(ix);
      this.setState({dragged: ix});
    }

    if (this.props.interactionMode === 'DragLink') {
      this.setState({
        dragLinkSource: {
          nodeId: simulation.getNode(ix).nodeId,
          x: this.state.nodes[ix].x,
          y: this.state.nodes[ix].y,
        }
      });
    }
  }

  drag(toX: number, toY: number) {
    const { simulation } = this.props;

    if (this.state.dragged !== null && this.props.interactionMode === 'DragNode') {
      simulation.moveNode(this.state.dragged, {x: toX, y: toY});
      // const node = this.state.nodes[this.state.dragged];
      // const position = {x: toX, y: toY};
      // node.x = position.x;
      // node.px = position.x;
      // node.y = position.y;
      // node.py = position.y;
      // this.simulation.resume();
      // this.forceUpdate();
    }
    if (this.props.interactionMode === 'DragLink' && this.state.dragLinkSource) {
      // this.props.moveLinkTarget({x: toX, y: toY})
      this.setState({dragLinkTarget: {x: toX, y: toY}});
    }
  }

  dragStop(ix) {
    const { simulation } = this.props;
    if (this.props.interactionMode === 'DragNode') {
      // end drag
      if (this.state.dragged !== null) {
        simulation.unfixNode(this.state.dragged);
      }
      this.setState({dragged: null});
    }

    if (this.props.interactionMode === 'DragLink') {
      this.setState({dragLinkSource: null, dragLinkTarget: null});
    }
    if (this.props.interactionMode === 'DragLink' && isNumber(ix)) {
      this.props.addLink({
        fromId: this.state.dragLinkSource.nodeId,
        toId: simulation.getNode(ix).nodeId,
      });
      this.setState({dragLinkSource: null, dragLinkTarget: null});
    }
  }

  render() {
    const {
      simulation,
      nodes,
      ViewComponent,
    } = this.props;

    const {
      height, width,
      groups, links,
      // nodes,
      dragLinkSource,
      dragLinkTarget,
    } = this.state;

    if (!(simulation && simulation.isReady())) {
      return <pre>{JSON.stringify({
        sim: simulation,
        isReady: simulation && simulation.isReady(),
      })}</pre>;
    }

    return (<ViewComponent
      height={height}
      width={width}
      links={simulation.getLinks()}
      nodes={simulation.getNodes()}
      groups={simulation.getGroups()}
      dragLinkSource={dragLinkSource}
      dragLinkTarget={dragLinkTarget}
      drag={this.drag.bind(this)}
      dragStart={this.dragStart.bind(this)}
      dragStop={this.dragStop.bind(this)}
      onClick={this.onClick.bind(this)}
    />);
  }
}

export default function withDragAndDrop(simulation, Component) {
  return function connectedComponent(props) {
    return <DragAndDropComponent
      simulation={simulation}
      ViewComponent={Component}
     {...props}
    />
  }
}