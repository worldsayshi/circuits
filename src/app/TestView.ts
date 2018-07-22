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
  [key: string]: any;
}

interface Graph {
  nodes: any[];
  links: any[]; //  {source:number,target:number}
}

function random() {
  return Math.round(Math.random()*100);
}

const Var = (n, i) => ({
  ...n,
  id: `${i}`,
  type: 'Var',
  value: 1,
})

// TODO: Continue building on TestView until it's on feature parity with View.
// It should keep its own state internally and get "immutable" updates from the outside.
// Try to keep the 'toD3' import outside of this TestView.

const clone = obj => JSON.parse(JSON.stringify(obj));

const testGraph = () => clone({
  nodes: [{}, {}, {}].map(Var),
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 0, target: 2 },
  ],
});

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
    const startGraph = testGraph();
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

    this.nodes = startGraph.nodes;
    this.links = startGraph.links;

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

    const currentNodes = this.simulation.nodes();
    const newNodes = [...this.simulation.nodes(), newNode];

    const links = this.simulation.links();
    const newLink = { source: 0, target: currentNodes.length };
    const newLinks = [...links, newLink];
    this.pushGraph({ nodes: newNodes, links: newLinks });
  }

  private pushGraph({ nodes = [], links = [] } : Graph) {
    // TODO Maintain positions from currentNodes. They are currently cleared if nodes does not contain positions

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
    console.log('nodes', (nodes));
    console.log('currentNodes', (currentNodes));
    jsdiff.patch(currentNodes, nodeDiff);

    console.log('links', currentLinks);
    // empty array
    currentLinks.splice(0,currentLinks.length);
    // Push all new links
    currentLinks.push(...this.normalizeLinks(currentNodes, links));
    // const linkDiff = jsdiff.diff(, this.normalizeLinks(nodes, links));
    // jsdiff.patch(this.simulation.links(), linkDiff);

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
    }, {
      name: 'Graph 1',
      f: () => {
        this.pushGraph({
          nodes: [{  }, {  }].map(Var),
          links: [{
            source: 0, target: 1
          }],
        });
      },
    },  {
      name: 'Graph 2',
      f: () => {
        this.pushGraph(testGraph());
      },
    }];
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
}