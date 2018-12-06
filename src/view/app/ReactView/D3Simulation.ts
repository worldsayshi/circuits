import * as jsdiff from "jsondiffpatch";
import * as cola from "webcola";
import { ID3StyleLayoutAdaptor, Layout } from "webcola";
import * as d3 from "d3";
import { Simulation } from './Simulation';


export default class D3Simulation implements Simulation {

    private simulation: Layout & ID3StyleLayoutAdaptor;

    props: {
      width, height,
      nodes, links, groups, onSimulationUpdate,
    };

    state: {
      nodes, links, groups, ready;
    };

    init(props) {
      this.props = props;
      const { nodes, links, groups } = props;
      this.simulation = cola.d3adaptor(d3)
        .linkDistance(l => l.length || 100)
        // .handleDisconnected(true)
        .avoidOverlaps(true)
        .size([this.props.width, this.props.height])
        .symmetricDiffLinkLengths(40)
        .on('tick', () => console.log() || this.props.onSimulationUpdate());

      this.state = {
        nodes,
        links,
        groups: groups || [],
        ready: false
      };
      // this.state.nodes = nodes;
      // this.state.links = links;
      // this.state.groups = groups || [];
      this.simulation
        .nodes(this.state.nodes);
      this.simulation
        .links(this.state.links);
      this.simulation
        .groups(this.state.groups);

      this.simulation.start();


      this.state.ready = true;
      this.props.onSimulationUpdate();
    }

  setSize(size: { width: number, y: number }) {
    // TODO Implement
    throw new Error("setSize: Not implemented");
  }

  init2({ nodes = [], links = [] }) {
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

  moveNode = (ix: number, position: { x: number, y: number }) => {
    const node = this.state.nodes[ix];
    node.x = position.x;
    node.px = position.x;
    node.y = position.y;
    node.py = position.y;
    this.simulation.resume();
    this.props.onSimulationUpdate();
    // this.forceUpdate();
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


};