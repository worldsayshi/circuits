
import { createStore } from 'redux';
import { getVerbResolvers } from '../components';
import { getNounResolvers } from '../nouns';


// Example of how to adapt to data changes: https://bl.ocks.org/mbostock/1095795

function createReducer({ nouns, verbs }) {
  return (graph = { nodes: [], components: [] }, action) => {

    switch (action.type) {
      case 'OPTIMIZE':
        throw new Error('Implement');
        return graph;
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
