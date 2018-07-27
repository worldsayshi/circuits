
import { createStore, Store } from 'redux';
import * as dp from 'dot-prop-immutable';
import * as jsdiff from 'jsondiffpatch';
import { getVerbResolvers, getVerbData } from '../components';
import { getNounResolvers } from '../nouns';
import optimizeGraph from "./optimizeGraph";
// import {Core} from "./createCore";



function createGraphReducer({ nouns, verbs }) {
  return (graph = { nodes: [], components: [] }, action) => {

    switch (action.type) {
      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
      case 'TOGGLE_CONSTANT':
        return dp.set(graph, `nodes.${action.index}.constant`, !graph.nodes[action.index].constant);
        // graph.nodes[action.index].constant = !graph.nodes[action.index].constant;
        // return graph;
      case 'INC_VALUE':
        return dp.set(graph, `nodes.${action.index}.value`, graph.nodes[action.index].value + 1);
        // graph.nodes[action.index].value += 1;
        // console.log('inc', graph.nodes[action.index].value);
        // return graph;
      case 'FOO':
        return {...graph, foo: 'bar'};
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
