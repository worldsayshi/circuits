import * as d3 from "d3";
import * as jsdiff from 'jsondiffpatch';
import * as cola from "webcola/dist/index";
import { Layout } from "webcola/dist/src/layout";
import { LayoutAdaptor } from "webcola/dist/src/adaptor";
import {ID3StyleLayoutAdaptor, InputNode} from "webcola";
import {Link} from "d3";

interface MyNode extends InputNode {
  id: string;
  type: string,
  value?: number;
}

function random() {
  return Math.round(Math.random()*100);
}

export default class TestView {
  private svg: any;
  private color: any;
  private nodes: MyNode[];
  private links: { source: number; target: number }[];
  private simulation: Layout & ID3StyleLayoutAdaptor;
  private tickRegistered: boolean = false;
  private domNodes: any;
  private width: number;
  private height: number;
  private nodeTypes: { [key: string]: any};

  constructor(nodeTypes: { [key: string]: any}) {
    this.width = 960;
    this.height = 900;
    this.nodeTypes = nodeTypes;

    this.svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.simulation = cola.d3adaptor(d3)
      .avoidOverlaps(true)
      .size([this.width, this.height])
      .symmetricDiffLinkLengths(40)
      .on('tick', () => this.tick());

    this.nodes = [{}, {}, {}].map((n, i) => ({
      ...n,
      id: `${i}`,
      type: 'Var',
      value: 1,
    }));
    this.links = [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 0, target: 2 },
    ];

    this.simulation
      .nodes(this.nodes);
    this.simulation
      .links(this.links);

    this.domNodes = this.svg.selectAll(".node");
    this.render();
    this.simulation.start();
  }

  render() {


    this.domNodes = this.svg.selectAll(".node")
      .data(this.simulation.nodes(), n => n.id);
    let nodeContainerCreation = this.domNodes
      .enter().append("g")
      .attr('class', 'node')
      .call(this.simulation.drag);

    for(const nodeTypeName of Object.keys(this.nodeTypes)) {
      const nodeTypeComponent = this.nodeTypes[nodeTypeName];
      nodeContainerCreation
        .filter(({type}) => type === nodeTypeName)
        .call(nodeTypeComponent);
      // (nodeContainerCreation);
    }

    this.svg.selectAll(".node-label")
      .text(d => d.value || 'no value');

    this.domNodes.exit().remove();

    // This is needed to convert nodes from being enternodes. For some reason.
    this.domNodes = this.svg.selectAll(".node")
      .data(this.simulation.nodes(), n => n.id);
  }

  tick() {
    this.domNodes
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  }

  changeValue() {
    this.nodes.forEach((n: any) => {
      n.value = n.value + 1;
    });

    this.render();
  }
  removeNode() {
    this.nodes.pop();
    this.links.pop();
    this.links.pop();

    this.render();
  }

  addNode() {
    const newNode = {
      id: `${this.nodes.length + 1}`,
      value: 1,
      type: 'Var',
      x: this.width / 2,
      y: this.height / 2,
    };
    const nodes = this.simulation.nodes();
    nodes.push(newNode);
    this.simulation.links().push({ source: nodes[0], target: newNode });

    this.simulation.start(0,0,0,0,true, false);
    this.render();
  }

  private deltaChange() {
    const newNode = {
      id: `${this.nodes.length + 1}`,
      value: 1,
      type: 'Var',
      x: this.width / 2,
      y: this.height / 2,
    };
    const nodes = this.simulation.nodes();

    const nodeDiff = jsdiff.diff(nodes, [...nodes, newNode]);

    const links = this.simulation.links();

    const newLink = { source: nodes[0], target: newNode };

    const linkDiff = jsdiff.diff(links, [...links, newLink]);

    jsdiff.patch(this.simulation.nodes(), nodeDiff);
    jsdiff.patch(this.simulation.links(), linkDiff);

    this.simulation.start(0,0,0,0,true, false);
    this.render();
  }

  getOperations() {
    return [{
      name: 'change value',
      f: () => this.changeValue(),
    }, {
      name: 'add node',
      f: () => this.addNode(),
    }, {
      name: 'remove node',
      f: () => this.removeNode(),
    }, {
      name: 'delta change',
      f: () => this.deltaChange(),
    }];
  }

}