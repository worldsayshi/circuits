import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactView from './ReactView';
import { attachDefaultData, createCoreReducer } from '../../model/calc/createCore';
import { interactionReducer } from "./interaction/index";
import toD3 from '../../adaptors/toD3';
import { Provider } from 'react-redux'
import {combineReducers, createStore} from 'redux'
import Palette from "./interaction/Palette";
import Graph from "../../model/types/graph";
import { Node } from './ReactView/node';
import InteractionMode from "./InteractionMode.enum";
import addNode from "../../model/calc/actions/addNode";
import addComponent from "../../model/calc/actions/addComponent";
import addCustomComponent from "../../model/calc/actions/addCustomComponent";

const graph2 = { nodes: [
    { noun: 'default', constant: true, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },

    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },
    { noun: 'default', constant: false, value: 1, type: 'Var' },

    { left: [], right: [], verb: 'sum', type: 'Component', },
    { left: [0, 1], right: [2, 3], verb: 'sum', type: 'Component' },
    { left: [4, 5, 6, 8], right: [7], verb: 'sum', type: 'Component' },
  ],
};

const graph = { nodes: [
    { left: [], right: [], verb: 'sum', type: 'Component', }
  ],
};


function initCore() {

  const appReducer = combineReducers({
    graphContext: createCoreReducer(),
    interaction: interactionReducer,
  });
  return createStore(appReducer, {
    graphContext: attachDefaultData(graph2),
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

interface Core {
  graphContext: Graph;
  interaction: any;
}

class App extends React.Component<{}, {
  core: Core,
  cores: { [name: string]: Core },
}> {


  constructor(props, ...rest) {
    super(props, ...rest);

    let coresStr = localStorage.getItem('cores') || "{}";
    let cores = coresStr ? JSON.parse(coresStr) : null;
    this.state = { core: core.getState(), cores };

    // Subscribe to core reducer
    core.subscribe(() => {
      this.setState({ core: core.getState() });
    });

    // Subscribe to changes in localStorage
    window.addEventListener('storage', event => {
      if (event.storageArea === localStorage) {
        // It's local storage
        this.setState({ cores });
      }
    }, false);
  }

  render() {
    const { core: { graphContext, interaction: { mode, brush }, }, cores } = this.state;
    const { nodes, links }: { nodes: Node[]; links: any[] } = toD3(graphContext);

    return (
      <div>
        <Palette
          modes={Object.keys(InteractionMode as any)}
          switchMode={(mode) => {
            core.dispatch({
              type: 'SWITCH_MODE',
              mode,
            });
          }}
          stored={Object.keys(cores)}
          storeAs={(name) => {
            let coresStr = localStorage.getItem('cores') || "{}";
            let cores = coresStr ? JSON.parse(coresStr) : null;
            cores = {
              ...cores,
              [name]: core.getState().graphContext,
            };
            localStorage.setItem(`cores`, JSON.stringify(cores));
          }}
          load={(name) => {
            let coresStr = localStorage.getItem('cores') || "{}";
            let cores = coresStr ? JSON.parse(coresStr) : null;
            console.log('loading', cores[name]);
            if (cores) {
              core.dispatch({
                type: 'REPLACE_GRAPH',
                graph: cores[name],
              });
            }
          }}
          selectBrush={(name) => {
            let coresStr = localStorage.getItem('cores') || "{}";
            let cores = coresStr ? JSON.parse(coresStr) : null;
            if (cores) {
              core.dispatch({
                type: 'SELECT_BRUSH',
                brush: {
                  name,
                  brush: cores[name],
                },
              });
            }
          }}
          selectedMode={mode}
          selectedBrush={brush}
          actions={[{
            name: 'Clear Graph',
            f: () => core.dispatch({ type: 'CLEAR_GRAPH' }),
          }, {
            name: 'Custom Component',
            f: () => core.dispatch({ type: 'NEW_COMPONENT' }),
          }]}
        />
        <ReactView
          nodes={nodes}
          links={links}
          groups={[]}
          interactionMode={mode}


          // TODO Use actions directly instead in a more idiomatic way,
          // with mapDispatchToProps and Provider
          // (should remove some indirection)
          lockNode={(ix) => {
            core.dispatch({ type: 'TOGGLE_CONSTANT', index: ix});
            core.dispatch({ type: 'OPTIMIZE' });
          }}
          incNode={(ix) => {
            core.dispatch({ type: 'INC_VALUE', index: ix });
            core.dispatch({ type: 'OPTIMIZE' });
          }}
          addLink={({ fromId, toId, fromSubselection, toSubselection }) => {
            core.dispatch({ type: 'ADD_LINK', fromId, toId, fromSubselection, toSubselection });
          }}

          addNode={(coordinates) => {
            core.dispatch(addNode({ coordinates }));
          }}

          addComponent={(coordinates) => {
            core.dispatch(addComponent({ coordinates }));
          }}

          useBrush={(coordinates) => {
            core.dispatch(addCustomComponent({ coordinates, component: brush }));
            console.log('core', core.getState());
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