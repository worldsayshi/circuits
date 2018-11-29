// import update from "./render/update";
import * as d3 from "d3";
import * as cola from "webcola/dist/index";
import toCola from "../../adaptors/toCola";
import { BaseType, ScaleOrdinal, Selection } from "d3";

function isIE() {
  return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}

function groupCenter (bounds) {
  return {
    x: (bounds.X - bounds.x) / 2 + bounds.x,
    y: (bounds.Y - bounds.y) / 2 + bounds.y
  };
}

/*
  Deprecated, kept for reference I guess?
 */

export default class View {

  private simulation: any;
  private svg: Selection<BaseType, any, HTMLElement, any>;
  private group: any;
  private color: ScaleOrdinal<string, string>;
  private showGuides: boolean;
  private node: any;
  private path: any;
  private graph: any;

  constructor(core) {
    let width = 960,
      height = 900;

    let showGuides = false;

    let svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    this.simulation = cola.d3adaptor(d3)
      .avoidOverlaps(true)
      .size([width, height]);
    this.svg = svg;
    this.group = null;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    console.log('typeof this.color', typeof this.color);
    this.showGuides = showGuides;

    core.subscribe(() => {
      // TODO Instead of replacing the state we could use json diff in a method core.getDelta() and
      // apply the delta onto the existing state. Then data-dom link may not need to be broken.
      const delta = core.getDelta();
      console.log('delta', delta);

      // let graph = core.getState();
      // graph = this.transferPositionalData(graph);
      // this.svg.selectAll("*").remove();
      // const d3Graph = toCola(JSON.parse(JSON.stringify(graph)));

      this.render(this.graph);
    });

    const graph = core.getState();
    this.render(toCola(JSON.parse(JSON.stringify(graph))));
  }

  transferPositionalData({ nodes, components }) {
    // Might be this issue here: https://github.com/tgdwyer/WebCola/issues/244
    // "just keep the layout engine around"
    // "I believe it works to fix the positions, run a couple iterations, then unfix them."
    const oldNodes = this.node.data();
    const oldComponents = this.path.data();
    console.log('oldNodes', oldNodes);
    // console.log('oldComponents data', oldComponents);

    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        // bounds: oldNodes[index].bounds,
        x: oldNodes[index].x,
        y: oldNodes[index].y,
        // fixed: true,
      })),
      components,
    };
  }

  render(graph) {
    let nodeRadius = 30;

    graph.nodes.forEach(function(v) {
      v.height = v.width = 2 * nodeRadius;
    });

    // console.log('nodes before d3');
    // console.log(JSON.stringify(graph.nodes, null, 2));

    this.simulation
      .nodes(graph.nodes)
      .links(graph.links)
      .groups(graph.groups)
      .symmetricDiffLinkLengths(40)
      .start(10, 20, 20);

    if (this.showGuides) {
      this.renderGroups(graph);
    }

    let path = this.svg.selectAll(".link")
      .data(graph.links)
      .enter().append('svg:path')
      .attr('class', 'link');

    let node = this.svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr('class', 'node')
      .call(this.simulation.drag);

    // Append images
    node
      .filter(function (d : any) { return !!d.img;})
      .append("svg:image")
      .attr("xlink:href",  function(d : any) { return d.img;})
      .attr("x", function(d) { return -nodeRadius;})
      .attr("y", function(d) { return -nodeRadius;})
      .attr("height", 2*nodeRadius)
      .attr("width", 2*nodeRadius)
      .attr("class", "component");

    node
      .filter(function (d : any) { return d.type === 'Var';})
      .append('circle')
      .attr("r", nodeRadius)
      .style("fill", (d : any) => {
        return this.color(d.group);
      })
      .attr("class", "var");

    // node.append("title")
    //   .text(function(d) {
    //     return d.name;
    //   });

    const self = this;
    this.simulation.on("tick", () => self.update({ node, path }));

    window.toggleGuides = () => {
      this.showGuides = !this.showGuides;
      if (this.showGuides) {
        this.renderGroups(graph);
      } else {
        this.removeGroups();
      }
      this.update({ node, path });
    };
    this.path = path;
    this.node = node;
    this.graph = graph;
  }

  renderGroups(graph) {
    this.group = this.svg.selectAll(".group")
      .data(graph.groups)
      .enter().insert("rect", ".link")
      .attr("rx", 8).attr("ry", 8)
      .attr("class", "group")
      .style("fill", (d, i) => {
        return this.color(`${i}`);
      })
      .call(this.simulation.drag);
  }

  removeGroups() {
    this.svg.selectAll(".group").remove();
  }

  update({ node, path }) {
    // console.log('data', this.node.data()[0].x);
    path.each(function(d) {
      if (isIE()) this.parentNode.insertBefore(this, this);
    });

    // draw directed edges with proper padding from node centers
    path.attr('d', (d) => {
      let varNode = d.source.type === 'Var' ? d.source : d.target;
      let varGroup = varNode.parent;
      let gCenter = groupCenter(varGroup.bounds);

      let deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = 0, // nodeRadius,
        targetPadding = 0, //nodeRadius + 2,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);

      if (d.target.type === 'Var' && d.source.type === 'Var') {
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
      }

      return 'M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY;
    });

    node
      .attr('transform', (d: any) => {
        let transform = 'translate(' + d.x + ','+ d.y +')';
        if (d.type == 'Component') {
          let gc1 = groupCenter(d.parent.groups[0].bounds);
          let gc2 = groupCenter(d.parent.groups[1].bounds);

          let angle = Math.atan2(gc2.y - gc1.y, gc2.x - gc1.x) * 180 / Math.PI;
          return transform + ' rotate('+angle+')'
        }
        return transform;
      });


    if (this.showGuides) {
      this.group.attr("x", (d) => {
          return d.bounds.x;
        })
        .attr("y", function(d) {
          return d.bounds.y;
        })
        .attr("width", function(d) {
          return d.bounds.width();
        })
        .attr("height", function(d) {
          return d.bounds.height();
        });
    }
  }
}