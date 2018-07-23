import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactView from './ReactView';
import createCore from '../calc/createCore';

// import toD3 from "../adaptors/toD3";
// import update from './render/update';
import View from "./View";
import TestView from "./TestView";
import * as d3 from "d3";

function initCore() {
  const graph = { nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },

      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
    ],
    components: [
      { left: [0, 1], right: [2, 3], verb: 'sum' },
      { left: [4, 5, 6, 8], right: [7], verb: 'sum' },
    ] };
  return createCore({ graph });
}

declare global {
  interface Window {
    buttonOperations: any
    foo: any;
    optimize: any;
    toggleGuides: any;
  }
}


export default function app () {
  ReactDOM.render(
      <ReactView></ReactView>,
      document.getElementById("view")
  );
}

// export default function app () {
//   let nodeRadius = 30;
//   let color = d3.scaleOrdinal(d3.schemeCategory10);
//   const view = new TestView({
//     Var: {
//       enter: (container) => {
//         console.log('var', container.selectAll(".node-label"));
//         container
//           .append('circle')
//           .attr("r", nodeRadius)
//           .style("fill", (d : any) => {
//             // console.log('node creation');
//             return color(d.group);
//           });
//
//         container
//           .append('text')
//           .attr('class', 'node-label');
//
//         container.selectAll(".node-label")
//           .text(d => d.value || 'no value');
//       },
//       update: () => {
//
//       },
//     },
//   }, {
//     Simple: {
//       create: e => {
//         // console.log('create', e);
//         e.insert('svg:path', 'g')
//           .attr('class', 'link');
//       },
//       tick: e => {
//         // console.log('update', e);
//         e.attr('d', (d) => 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x + ',' + d.target.y);
//       },
//     },
//   });
//
//   view.getOperations().forEach(({ name, f }) => {
//     const button = document.createElement('button');
//     button.appendChild(document.createTextNode(name));
//
//     button.onclick = f;
//
//     document.querySelector('#buttons').appendChild(button);
//   });
//   // view.start();
//   // window.changeValue = () => view.changeValue();
// };

// export default function _app () {
//   const core = initCore();
//   const view = new View(core);
//
//   window.foo = () => core.dispatch({ type: 'FOO' });
//   window.optimize = () => core.dispatch({ type: 'OPTIMIZE' });
// };
