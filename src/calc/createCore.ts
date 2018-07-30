
import { createStore, Store } from 'redux';
import * as dp from 'dot-prop-immutable';
import * as jsdiff from 'jsondiffpatch';
import { getVerbResolvers, getVerbData, VerbResolvers } from '../components';
import {getNounResolvers, NounResolvers} from '../nouns';
import optimizeGraph from "./optimizeGraph";
// import {Core} from "./createCore";



function createGraphReducer({ nouns, verbs } : { nouns: NounResolvers, verbs: VerbResolvers }) {
  return (graph = { nodes: [], components: [] }, action) => {

    switch (action.type) {
      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
      case 'TOGGLE_CONSTANT':
        return dp.set(graph, `nodes.${action.index}.constant`, !graph.nodes[action.index].constant);
      case 'INC_VALUE':
        return dp.set(graph, `nodes.${action.index}.value`, graph.nodes[action.index].value + 1);
      default:
        return graph;
    }
  }
}

export function attachDefaultData({ nodes, components }) {
  return {
    nodes,
    components: components.map((component) => ({
      ...component,
      ...getVerbData()[component.verb],
    })),
  };
}

export function createCoreReducer ({ nouns = {}, verbs = {}  } = {}) {
  return createGraphReducer({
    nouns: { ...getNounResolvers(), ...nouns },
    verbs: { ...getVerbResolvers(), ...verbs },
  });
}

// Stateful core
export function createCore ({ graph, nouns = {}, verbs = {} }) {
  return createStore(createCoreReducer({ nouns, verbs }), attachDefaultData(graph));
}
