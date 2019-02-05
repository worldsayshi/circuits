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
      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },

      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },
      { noun: 'default', constant: false, value: 1, type: 'Var' },

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
          clearGraph={() => core.dispatch({ type: 'CLEAR_GRAPH'})}
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

          addNode={(coordinates) => {
            core.dispatch({ type: 'ADD_NODE', coordinates });
          }}

          addComponent={(coordinates) => {
            core.dispatch({ type: 'ADD_COMPONENT', coordinates });
          }}
          // interactionStyle='DragLink'
        />
      </div>
    );
  }
}

export default function app () {

  ReactDOM.render(
    <App />,
      document.getElementById("view")
  );

}