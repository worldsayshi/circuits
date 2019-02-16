
import { createStore, Store } from 'redux';
import * as dp from 'dot-prop-immutable';
import * as jsdiff from 'jsondiffpatch';
import { getVerbResolvers, getVerbData, VerbResolvers } from '../components/index';
import {getNounResolvers, NounResolvers} from '../nouns/index';
import optimizeGraph from "./optimizeGraph";
// import {Core} from "./createCore";

function increaseAllComponentIndexes(nodes) {
  return nodes.map(n => n.type === 'Component' ? ({
    ...n,
    left: n.left.map(i => i +1),
    right: n.right.map(i => i +1),
  }) : n)
}

function createGraphReducer({ nouns, verbs } : { nouns: NounResolvers, verbs: VerbResolvers }) {
  return (graph = { nodes: [], }, action) => {

    switch (action.type) {
      case 'CLEAR_GRAPH':
        return { nodes: [], };
      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
      case 'TOGGLE_CONSTANT':
        return dp.set(graph, `nodes.${action.index}.constant`, !graph.nodes[action.index].constant);
      case 'INC_VALUE':
        return dp.set(graph, `nodes.${action.index}.value`, graph.nodes[action.index].value + 1);
      case 'ADD_LINK':
        const {
          fromId,
          toId,
          fromSubselection,
          toSubselection,
        } = action;

        const fromNode = graph.nodes[fromId];
        const toNode =  graph.nodes[toId];
        // Add the node to the list of adjacencies of the component
        if (fromNode.type === 'Component') {
          if (toNode.type !== 'Component') {
            // Drawing from a component to a node
            const adjacencies = dp.get(graph, `nodes.${fromId}.${fromSubselection}`);
            return dp.set(graph, `nodes.${fromId}.${fromSubselection}`,
              adjacencies.includes(toId) ? adjacencies : [...adjacencies, toId]);
          }
        } else if (toNode.type === 'Component') {
          if (fromNode.type !== 'Component') {
            // Drawing from a node to a component
            const adjacencies = dp.get(graph, `nodes.${toId}.${toSubselection}`);
            return dp.set(graph, `nodes.${toId}.${toSubselection}`,
              adjacencies.includes(fromId) ? adjacencies : [...adjacencies, fromId]);
          }
        }
        return graph;
      case 'ADD_NODE': {
        const { coordinates: { x, y } } = action;
        return { ...graph, nodes: [
            { noun: 'default', constant: true, value: 1, type: 'Var', x, y },
            ...increaseAllComponentIndexes(graph.nodes),
          ],
        };
      }
      case 'ADD_COMPONENT': {
        const { coordinates: { x, y } } = action;
        return { ...graph, nodes: [
            ...graph.nodes,
            { left: [], right: [], verb: 'sum', type: 'Component', x, y, ...getVerbData()['sum'], },
          ],
        };
      }

      default:
        return graph;
    }
  }
}

export function attachDefaultData({ nodes }) {
  // const components = nodes.filter(({ type }) => (type === 'Component')).map()
  return {
    nodes: nodes.map((node) => {
      if (node.type === 'Component') {
        return {
          ...node,
          ...getVerbData()[node.verb],
        };
      }
      return node;
    })
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
