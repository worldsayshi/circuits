
import { createStore } from 'redux';
import { getVerbResolvers } from '../components';
import { getNounResolvers } from '../nouns';
import optimizeGraph from "./optimizeGraph";


// Example of how to adapt to data changes: https://bl.ocks.org/mbostock/1095795

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


// Stateful core
export default function createCore ({ graph, nouns, verbs }) {
  return createStore(createReducer({
    nouns: { ...getNounResolvers(), ...nouns },
    verbs: { ...getVerbResolvers(), ...verbs },
  }), graph);
}
