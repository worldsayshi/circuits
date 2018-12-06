import {Simulation} from "./Simulation";


export default class TrivialSimulation implements Simulation {

  props = {
    onSimulationUpdate: () => console.log('onSimulationUpdate called before assignment')
  };

  state = {
    nodes: [],
    links: [],
    groups: [],
    ready: false,
  };


  init = (props) => {
    console.log('init!');
    this.props = props;
    const { nodes, links, groups } = props;
    this.state = {
      nodes,
      links,
      groups: groups || [],
      ready: true,
    };
    this.props.onSimulationUpdate();
  };
  moveNode = (ix: number, position: { x: number, y: number }) => {
    const node = this.state.nodes[ix];
    node.x = position.x;
    node.px = position.x;
    node.y = position.y;
    node.py = position.y;
    // this.simulation.resume();
    this.props.onSimulationUpdate();
    // this.forceUpdate();
  };

  setSize = (size: { width: number; y: number }) => void {
  };

  fixNode = (ix: number) => {
    const node = this.state.nodes[ix];
    node.fixed = true;
  };

  unfixNode = (ix: number) => {
    const node = this.state.nodes[ix];
    node.fixed = false;
  };

  getNode = (ix: number) => {
    return this.state.nodes[ix];
  };

  getNodes = () => {
    return this.state.nodes;
  };

  getGroups = () => {
    return this.state.groups;
  };

  getLinks = () => {
    return this.state.links;
  };


  isReady = () => {
    return this.state.ready;
  };


}