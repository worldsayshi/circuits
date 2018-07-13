
import { createStore } from 'redux';
import { getVerbResolvers, getVerbData } from '../components';
import { getNounResolvers } from '../nouns';
import optimizeGraph from "./optimizeGraph";




function createReducer({ nouns, verbs }) {
  return (graph = { nodes: [], components: [] }, action) => {

    switch (action.type) {
      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
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
export default function createCore ({ graph, nouns = {}, verbs = {} }) {
  return createStore(createReducer({
    nouns: { ...getNounResolvers(), ...nouns },
    verbs: { ...getVerbResolvers(), ...verbs },
  }), attachDefaultData(graph, getVerbData()));
}
