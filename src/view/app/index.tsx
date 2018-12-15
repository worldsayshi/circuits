import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactView from './ReactView';
import { attachDefaultData, createCoreReducer } from '../../model/calc/createCore';
import { interactionReducer } from "./interaction/index";

import toCola from "../../adaptors/toCola";
import toD3 from '../../adaptors/toD3';
// import toD3v4 from "../adaptors/toD3v4";

// import update from './render/update';
import View from "./View";
import TestView from "./TestView";
import * as d3 from "d3";
import { Provider } from 'react-redux'
import {combineReducers, createStore} from 'redux'
import Palette from "./interaction/Palette";
import GraphContext from "../../model/graphContext";
import Graph from "../../model/types/graph";

function initCore() {
  const graph = { nodes: [
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },

      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },
      { noun: 'default', constant: true, value: 1, type: 'Var' },

      { left: [0, 1], right: [2, 3], verb: 'sum', type: 'Component' },
      { left: [4, 5, 6, 8], right: [7], verb: 'sum', type: 'Component' },
    ],
  };
  const appReducer = combineReducers({
    graphContext: createCoreReducer(),
    interaction: interactionReducer,
  });
  return createStore(appReducer, {
    graphContext: attachDefaultData(graph),
  });
}

declare global {
  interface Window {
    buttonOperations: any
    foo: any;
    optimize: any;
    toggleGuides: any;
  }
}

const clone = obj => JSON.parse(JSON.stringify(obj));


const testGraph = () => clone({
  nodes: [{}, {}, {}].map(Var),
  links: [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 0, target: 2},
  ].map(Link),
});


const Var = (n, i) => ({
  id: `${i}`,
  type: 'Var',
  value: 1,
  ...n,
});

const Link = (l) => ({
  type: 'Simple',
  ...l,
});

const core = initCore();


class App extends React.Component<{}, {
  graphContext: Graph;
  interaction: any;
}> {


  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = core.getState();
    core.subscribe(() => {
      this.setState(core.getState());
    })
  }

  render() {
    const { graphContext, interaction: { mode } } = this.state;
    const { nodes, links } = toD3(graphContext);
    return (
      <div>
        <Palette
          switchMode={(mode) => {
            core.dispatch({
              type: 'SWITCH_MODE',
              mode,
            });
          }}
          interactionMode={mode}
        />
        <ReactView
          nodes={nodes}
          links={links}
          groups={[]}
          interactionMode={mode}

          lockNode={(ix) => {
            core.dispatch({ type: 'TOGGLE_CONSTANT', index: ix});
            core.dispatch({ type: 'OPTIMIZE' });
          }}
          incNode={(ix) => {
            core.dispatch({ type: 'INC_VALUE', index: ix});
            core.dispatch({ type: 'OPTIMIZE' });
          }}
          addLink={({ fromId, toId, fromSubselection, toSubselection }) => {
            core.dispatch({ type: 'ADD_LINK', fromId, toId, fromSubselection, toSubselection });
          }}
          // interactionStyle='DragLink'
        />
      </div>
    );
  }
}

export default function app () {
  const startGraph = testGraph();
  // const store = createStore((state = {graph: startGraph}, action: { type: string, graph: any }) => {
  //   switch (action.type) {
  //     case 'REPLACE':
  //       return {graph: action.graph};
  //   }
  //   return state;
  // });

  ReactDOM.render(
    <App />,
      document.getElementById("view")
  );

  // setTimeout(() => {
  //   store.dispatch({
  //     type: 'REPLACE',
  //     graph: {
  //       nodes: [{  }, {  }].map(Var),
  //       links: [{
  //         source: 0, target: 1
  //       }].map(Link),
  //     },
  //   });
  // }, 1000);
  //
  //
  // setTimeout(() => {
  //   store.dispatch({
  //     type: 'REPLACE',
  //     graph: testGraph(),
  //   });
  // }, 2000);
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
