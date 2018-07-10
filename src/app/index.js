
import createCore from '../calc/createCore';
import * as d3 from "d3";
import * as cola from "webcola/dist/index";
import toD3 from "../adaptors/toD3";
import update from './render/update';

let width = 960,
  height = 900;

let group;
let showGuides = false;

let color = d3.scaleOrdinal(d3.schemeCategory20);

let d3cola = cola.d3adaptor(d3)
  .avoidOverlaps(true)
  .size([width, height]);

let svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

function initCore() {
  const graph = { nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default' }
    ],
    components: [
      { left: [0], right: [1], verb: 'sum' },
    ] };
  return createCore({ graph });
}

// function initView() {
//   import * as cola from 'webcola';
//   import * as d3 from "d3";
//
//   let width = 960,
//     height = 900;
//
//   let group;
//   let showGuides = false;
//
//   let color = d3.scaleOrdinal(d3.schemeCategory20);
//
//   let d3cola = cola.d3adaptor(d3)
//   .avoidOverlaps(true)
//   .size([width, height]);
//
//   let svg = d3.select("body").append("svg")
//   .attr("width", width)
//   .attr("height", height);
//
//   return { svg, color, showGuides };
// }

function render(graph) {
  let nodeRadius = 30;

  graph.nodes.forEach(function(v) {
    v.height = v.width = 2 * nodeRadius;
  });

  d3cola
    .nodes(graph.nodes)
    .links(graph.links)
    .groups(graph.groups)
    .symmetricDiffLinkLengths(40)
    .start(10, 20, 20);

  if (showGuides) {
    renderGroups();
  }

  let path = svg.selectAll(".link")
    .data(graph.links)
    .enter().append('svg:path')
    .attr('class', 'link');

  let node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .call(d3cola.drag);

  node
    .filter(function (d) { return d.type === 'Var';})
    .append('circle')
    .attr("class", "node")
    .attr("r", nodeRadius)
    .style("fill", function(d) {
      return color(d.group);
    });

  // Append images
  node
    .filter(function (d) { return !!d.img;})
    .append("svg:image")
    .attr("xlink:href",  function(d) { return d.img;})
    .attr("x", function(d) { return -nodeRadius;})
    .attr("y", function(d) { return -nodeRadius;})
    .attr("height", 2*nodeRadius)
    .attr("width", 2*nodeRadius);

  node.append("title")
    .text(function(d) {
      return d.name;
    });


  d3cola.on("tick", () => update({ node, path, showGuides }));

  window.toggleGuides = function() {
    showGuides = !showGuides;
    if (showGuides) {
      renderGroups();
    } else {
      removeGroups();
    }
    update({ node, path, showGuides });
  }

  function renderGroups() {
    group = svg.selectAll(".group")
    .data(graph.groups)
    .enter().insert("rect", ".link")
    .attr("rx", 8).attr("ry", 8)
    .attr("class", "group")
    .style("fill", function(d, i) {
      return color(i);
    })
    .call(d3cola.drag);
  }

  function removeGroups() {
    svg.selectAll(".group").remove();
  }
}

export default function app () {
  const core = initCore();
  core.subscribe(() => {
    const graph = core.getState();
    render(graph);
  });
  const graph = core.getState();
  render(toD3.d3(graph));
};
