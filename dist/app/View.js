"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import update from "./render/update";
var d3 = require("d3");
var cola = require("webcola/dist/index");
var toD3_1 = require("../adaptors/toD3");
function isIE() {
    return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}
function groupCenter(bounds) {
    return {
        x: (bounds.X - bounds.x) / 2 + bounds.x,
        y: (bounds.Y - bounds.y) / 2 + bounds.y
    };
}
var View = /** @class */ (function () {
    function View(core) {
        var _this = this;
        var width = 960, height = 900;
        var showGuides = false;
        var simulation = cola.d3adaptor(d3)
            .avoidOverlaps(true)
            .size([width, height]);
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
        this.simulation = simulation;
        this.svg = svg;
        this.group = null;
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
        console.log('typeof this.color', typeof this.color);
        this.showGuides = showGuides;
        core.subscribe(function () {
            debugger;
            var graph = core.getState();
            graph = _this.transferPositionalData(graph);
            _this.svg.selectAll("*").remove();
            var d3Graph = toD3_1.default(JSON.parse(JSON.stringify(graph)));
            _this.render(d3Graph);
        });
        var graph = core.getState();
        this.render(toD3_1.default(JSON.parse(JSON.stringify(graph))));
    }
    View.prototype.transferPositionalData = function (_a) {
        var nodes = _a.nodes, components = _a.components;
        // Might be this issue here: https://github.com/tgdwyer/WebCola/issues/244
        // "just keep the layout engine around"
        // "I believe it works to fix the positions, run a couple iterations, then unfix them."
        var oldNodes = this.node.data();
        var oldComponents = this.path.data();
        console.log('oldNodes', oldNodes);
        // console.log('oldComponents data', oldComponents);
        return {
            nodes: nodes.map(function (node, index) { return (__assign({}, node, { 
                // bounds: oldNodes[index].bounds,
                x: oldNodes[index].x, y: oldNodes[index].y })); }),
            components: components,
        };
    };
    View.prototype.render = function (graph) {
        var _this = this;
        var nodeRadius = 30;
        graph.nodes.forEach(function (v) {
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
        var path = this.svg.selectAll(".link")
            .data(graph.links)
            .enter().append('svg:path')
            .attr('class', 'link');
        var node = this.svg.selectAll(".node")
            .data(graph.nodes, function (d) { return d.nodeId; })
            .enter().append("g")
            .call(this.simulation.drag);
        node
            .filter(function (d) { return d.type === 'Var'; })
            .append('circle')
            .attr("class", "node")
            .attr("r", nodeRadius)
            .style("fill", function (d) {
            return _this.color(d.group);
        });
        // Append images
        node
            .filter(function (d) { return !!d.img; })
            .append("svg:image")
            .attr("xlink:href", function (d) { return d.img; })
            .attr("x", function (d) { return -nodeRadius; })
            .attr("y", function (d) { return -nodeRadius; })
            .attr("height", 2 * nodeRadius)
            .attr("width", 2 * nodeRadius);
        node.append("title")
            .text(function (d) {
            return d.name;
        });
        var self = this;
        this.simulation.on("tick", function () { return self.update({ node: node, path: path }); });
        window.toggleGuides = function () {
            _this.showGuides = !_this.showGuides;
            if (_this.showGuides) {
                _this.renderGroups(graph);
            }
            else {
                _this.removeGroups();
            }
            _this.update({ node: node, path: path });
        };
        this.path = path;
        this.node = node;
    };
    View.prototype.renderGroups = function (graph) {
        var _this = this;
        this.group = this.svg.selectAll(".group")
            .data(graph.groups)
            .enter().insert("rect", ".link")
            .attr("rx", 8).attr("ry", 8)
            .attr("class", "group")
            .style("fill", function (d, i) {
            return _this.color("" + i);
        })
            .call(this.simulation.drag);
    };
    View.prototype.removeGroups = function () {
        this.svg.selectAll(".group").remove();
    };
    View.prototype.update = function (_a) {
        var node = _a.node, path = _a.path;
        // console.log('data', this.node.data()[0].x);
        path.each(function (d) {
            if (isIE())
                this.parentNode.insertBefore(this, this);
        });
        // draw directed edges with proper padding from node centers
        path.attr('d', function (d) {
            var varNode = d.source.type === 'Var' ? d.source : d.target;
            var varGroup = varNode.parent;
            var gCenter = groupCenter(varGroup.bounds);
            var deltaX = d.target.x - d.source.x, deltaY = d.target.y - d.source.y, dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY), normX = deltaX / dist, normY = deltaY / dist, sourcePadding = 0, // nodeRadius,
            targetPadding = 0, //nodeRadius + 2,
            sourceX = d.source.x + (sourcePadding * normX), sourceY = d.source.y + (sourcePadding * normY), targetX = d.target.x - (targetPadding * normX), targetY = d.target.y - (targetPadding * normY);
            if (d.target.type === 'Var' && d.source.type === 'Var') {
                return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
            }
            return 'M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY;
        });
        node
            .attr('transform', function (d) {
            var transform = 'translate(' + d.x + ',' + d.y + ')';
            if (d.type == 'Component') {
                var gc1 = groupCenter(d.parent.groups[0].bounds);
                var gc2 = groupCenter(d.parent.groups[1].bounds);
                var angle = Math.atan2(gc2.y - gc1.y, gc2.x - gc1.x) * 180 / Math.PI;
                return transform + ' rotate(' + angle + ')';
            }
            return transform;
        });
        if (this.showGuides) {
            this.group.attr("x", function (d) {
                return d.bounds.x;
            })
                .attr("y", function (d) {
                return d.bounds.y;
            })
                .attr("width", function (d) {
                return d.bounds.width();
            })
                .attr("height", function (d) {
                return d.bounds.height();
            });
        }
    };
    return View;
}());
exports.default = View;
