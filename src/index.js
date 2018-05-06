import * as cola from 'webcola';
import * as d3 from "d3";

var width = 960,
  height = 900;

var groups;
let showGuides = false;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var d3cola = cola.d3adaptor(d3)
  .avoidOverlaps(true)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("graphdata/circuit.json", function(error, graph) {
  var nodeRadius = 30;

  graph.nodes.forEach(function(v) {
    v.height = v.width = 2 * nodeRadius;
  });

  d3cola
    .nodes(graph.nodes)
    .links(graph.links)
    .groups(graph.groups)
    // .flowLayout("y", -30)
    .symmetricDiffLinkLengths(40)
    .start(10, 20, 20);

  // define arrow markers for graph links
  // svg.append('svg:defs').append('svg:marker')
  //   .attr('id', 'end-arrow')
  //   .attr('viewBox', '0 -5 10 10')
  //   .attr('refX', 6)
  //   .attr('markerWidth', 5)
  //   .attr('markerHeight', 5)
  //   .attr('orient', 'auto')
  //   .append('svg:path')
  //   .attr('d', 'M0,-5L10,0L0,5')
  //   .attr('fill', '#000');

  if (showGuides) {
    renderGroups();
  }

  var path = svg.selectAll(".link")
    .data(graph.links)
    .enter().append('svg:path')
    .attr('class', 'link');

  var node = svg.selectAll(".node")
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
  var images = node
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

  function groupCenter (bounds) {
    return {
      x: (bounds.X - bounds.x) / 2 + bounds.x,
      y: (bounds.Y - bounds.y) / 2 + bounds.y
    };
  }

  function tick() {
    path.each(function(d) {
      if (isIE()) this.parentNode.insertBefore(this, this);
    });
    // draw directed edges with proper padding from node centers
    path.attr('d', function(d) {
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
      return 'M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY;
    });

    node
      .attr('transform', function (d) {
        let transform = 'translate(' + d.x + ','+ d.y +')';
        if(d.type == 'Component') {
          let gc1 = groupCenter(d.parent.groups[0].bounds);
          let gc2 = groupCenter(d.parent.groups[1].bounds);

          let angle = Math.atan2(gc2.y - gc1.y, gc2.x - gc1.x) * 180 / Math.PI;
          return transform + ' rotate('+angle+')'
        }
        return transform;
      })


    if (showGuides) {
      group.attr("x", function(d) {
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

  d3cola.on("tick", tick);

  window.toggleGuides = function() {
    showGuides = !showGuides;
    if (showGuides) {
      renderGroups();
    } else {
      removeGroups();
    }
    tick();
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
});

function isIE() {
  return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}
