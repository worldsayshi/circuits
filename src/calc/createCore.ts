
import { createStore, Store } from 'redux';
import * as jsdiff from 'jsondiffpatch';
import { getVerbResolvers, getVerbData } from '../components';
import { getNounResolvers } from '../nouns';
import optimizeGraph from "./optimizeGraph";
// import {Core} from "./createCore";

export interface Core extends Store {
  getDelta: any;
  lastState: any;
  _getState: any;
}


function createReducer({ nouns, verbs }) {
  return (graph = { nodes: [], components: [] }, action) => {

    switch (action.type) {
      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
      case 'FOO':
        return {...graph, foo: 'bar'};
      default:
        return graph;
    }
  }
}

function attachDefaultData({ nodes, components }, defaultVerbData) {
  return {
    nodes,
    components: components.map((component) => ({
      ...component,
      ...defaultVerbData[component.verb],
    })),
  };
}


// Stateful core
export default function createCore ({ graph, nouns = {}, verbs = {} }) : Core {
  const core = createStore(createReducer({
    nouns: { ...getNounResolvers(), ...nouns },
    verbs: { ...getVerbResolvers(), ...verbs },
  }), attachDefaultData(graph, getVerbData())) as Core;

  core.lastState = {};

  core._getState = core.getState;
  core.getState = () => {
    core.lastState = core._getState();
    return core.lastState;
  };

  core.getDelta = () => {
    const delta = jsdiff.diff(core.lastState, core.getState());
    core.lastState = core.getState();
    return delta;
  };

  return core;
}
