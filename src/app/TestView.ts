import * as d3 from "d3";
import * as cola from "webcola/dist/index";
import { Layout } from "webcola/dist/src/layout";
import { LayoutAdaptor } from "webcola/dist/src/adaptor";
import {ID3StyleLayoutAdaptor, InputNode} from "webcola/dist/index";
import {Link} from "d3";

interface MyNode extends InputNode {
  id: string;
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

  constructor() {
    this.width = 960;
    this.height = 900;

    this.svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.simulation = cola.d3adaptor(d3)
      .avoidOverlaps(true)
      .size([this.width, this.height])
      .symmetricDiffLinkLengths(40)
      .on('tick', () => this.tick());

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.nodes = [{}, {}, {}].map((n, i) => ({
      ...n,
      id: `${i}`,
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

    // Need to render twice for some reason
    this.render();
    this.render();
    this.simulation.start();
    // this.simulation.start();
  }


  render() {
    console.log('start');
    let nodeRadius = 30;

    this.domNodes = this.svg.selectAll(".node")
      .data(this.simulation.nodes(), n => n.id);
    let nodeContainerCreation = this.domNodes
      .enter().append("g")
      .attr('class', 'node')
      .call(this.simulation.drag);

    nodeContainerCreation
      .append('circle')
      .attr("r", nodeRadius)
      .style("fill", (d : any) => {
        console.log('node creation');
        return this.color(d.group);
      });
    // .attr("class", "var");
    //
    nodeContainerCreation
      .append('text')
      .attr('class', 'node-label');

    this.svg.selectAll(".node-label")
      .text(d => d.value || 'no value');

    this.domNodes.exit().remove();
  }

  tick() {
    console.log('tick');
    this.domNodes
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  }

  changeValue() {
    // this.svg.selectAll("*").remove();
    // let valueBefore = this.nodes[0].value;
    this.nodes.forEach((n: any) => {
      n.value = n.value + 1;
    });

    this.render();
    // this.simulation.start();
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
      x: this.width / 2,
      y: this.height / 2,
    };
    const nodes = this.simulation.nodes();
    nodes.push(newNode);
    this.simulation.links().push({ source: nodes[0], target: newNode });
    // this.links.push();
    // this.links.push();

    this.simulation.start();
    this.render();
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
    }];
  }


}